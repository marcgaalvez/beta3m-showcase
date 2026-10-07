// Extracto de Beta3M (código fuente privado). Mostrado con fines de portfolio. © 2026 Marc Gálvez & Ignasi Palau.
//
// Store de apuntes (Zustand) con persistencia offline-first en dos capas:
//   Capa 1 — IndexedDB (Dexie): cada cambio se escribe al instante. La UI nunca espera a la red.
//   Capa 2 — API: un worker agrupa los cambios y los sube cuando el usuario deja de escribir.
// Sin conexión, las notas nuevas reciben un id temporal negativo y los borrados se encolan;
// al volver la red (evento `online`) se sube todo en orden.
//
// Omitido en el extracto: modo invitado, acciones de IA y algunos detalles de la UI.

import { create } from 'zustand';
import { apiClient, NetworkError } from '../api/client';
import { db } from '../db/dexie';
import type { Note } from '../types/models';
import { useAuthStore } from './authStore';

interface NotesStore {
  notes: Note[];
  currentNote: Note | null;
  isLoading: boolean;
  isSaving: boolean;
  activeSubjectId: number | null;
  fetchNotes: (subjectId?: number) => Promise<void>;
  createNote: (data?: Partial<Note>) => Promise<Note>;
  updateNote: (id: number, data: Partial<Note>, skipQueue?: boolean) => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
  searchNotes: (query: string) => Promise<void>;
  uploadOfflineNotes: () => Promise<void>;
}

// ── Cola de sincronización ─────────────────────────────────────────────────────

interface PendingSync {
  data: Partial<Note>;
  timestamp: number;
}

const IDLE_BEFORE_SYNC_MS = 8000;
const MAX_PENDING_BEFORE_SYNC = 5;
const WORKER_TICK_MS = 5000;

const pendingSync = new Map<number, PendingSync>();
let lastKeystroke = Date.now();
let workerInterval: ReturnType<typeof setInterval> | null = null;

/** La UI lo usa para avisar antes de cerrar la pestaña con cambios sin subir. */
export const hasPendingNoteSync = () => pendingSync.size > 0 || pendingDeletes().length > 0;

const isNetworkError = (e: unknown) => !navigator.onLine || e instanceof NetworkError;

// Borrados sin conexión: se guardan para reintentarlos y para que la nota
// no "resucite" al recargar la lista desde el servidor.
const PENDING_DELETES_KEY = 'pending_deletes';
const pendingDeletes = (): number[] => {
  try { return JSON.parse(localStorage.getItem(PENDING_DELETES_KEY) || '[]'); } catch { return []; }
};
const setPendingDeletes = (ids: number[]) => {
  try { localStorage.setItem(PENDING_DELETES_KEY, JSON.stringify(ids)); } catch { /* sin almacenamiento */ }
};

const startWorker = (syncFn: (id: number, data: Partial<Note>) => Promise<void>) => {
  if (workerInterval) return;
  workerInterval = setInterval(async () => {
    if (pendingSync.size === 0) return;
    // Se sube cuando el usuario lleva un rato sin escribir o si se acumulan muchas notas
    const idle = Date.now() - lastKeystroke > IDLE_BEFORE_SYNC_MS;
    if (!idle && pendingSync.size < MAX_PENDING_BEFORE_SYNC) return;

    const entries = [...pendingSync.entries()];
    pendingSync.clear();
    for (const [noteId, { data }] of entries) {
      try {
        await syncFn(noteId, data);
      } catch {
        pendingSync.set(noteId, { data, timestamp: Date.now() }); // se reintenta en el siguiente ciclo
      }
    }
  }, WORKER_TICK_MS);
};

const syncViaApi = (noteId: number, data: Partial<Note>) =>
  useNotesStore.getState().updateNote(noteId, data, true);

// ── Store ──────────────────────────────────────────────────────────────────────

export const useNotesStore = create<NotesStore>((set, get) => ({
  notes: [],
  currentNote: null,
  isLoading: false,
  isSaving: false,
  activeSubjectId: null,

  fetchNotes: async (subjectId) => {
    set({ isLoading: true });
    const userId = useAuthStore.getState().user?.id ?? 0;
    try {
      const path = subjectId ? `/notes?subject_id=${subjectId}` : '/notes';
      const deleted = new Set(pendingDeletes());
      const serverNotes = (await apiClient.get<Note[]>(path)).filter(n => !deleted.has(n.id));

      // Resolución de conflictos "last write wins" por updated_at: una copia local más
      // reciente (p. ej. editada sin conexión) gana y se vuelve a encolar para subirla.
      const merged: Note[] = [];
      for (const serverNote of serverNotes) {
        const local = await db.notes.get(serverNote.id);
        if (local && Date.parse(local.updated_at) > Date.parse(serverNote.updated_at)) {
          merged.push(local);
          pendingSync.set(serverNote.id, { data: local, timestamp: Date.now() });
        } else {
          merged.push(serverNote);
        }
      }

      // Notas creadas sin conexión (id negativo) que aún no existen en el servidor
      const offlineNotes = (await db.notes.where('user_id').equals(userId).toArray())
        .filter(n => n.id < 0 && (!subjectId || n.subject_id === subjectId));
      merged.unshift(...offlineNotes);

      await db.notes.bulkPut(merged);
      set({ notes: merged, isLoading: false });
      if (pendingSync.size > 0) startWorker(syncViaApi);
    } catch {
      // Sin red: se sirve la caché local
      const cached = await db.notes.where('user_id').equals(userId).toArray();
      set({
        notes: subjectId ? cached.filter(n => n.subject_id === subjectId) : cached,
        isLoading: false,
      });
    }
  },

  createNote: async (data = {}) => {
    const localNote = (): Note => ({
      id: -Math.floor(Math.random() * 1_000_000) - 1, // id temporal hasta que lo asigne el servidor
      title: 'Sin título',
      content: '',
      content_plain: '',
      subject_id: get().activeSubjectId,
      user_id: useAuthStore.getState().user?.id ?? 0,
      ai_processed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...data,
    });

    let note: Note;
    try {
      note = await apiClient.post<Note>('/notes', {
        title: 'Sin título', content: '', subject_id: get().activeSubjectId, ...data,
      });
    } catch (e) {
      if (!isNetworkError(e)) throw e;
      note = localNote();
    }

    await db.notes.put(note);
    set(s => ({ notes: [note, ...s.notes], currentNote: note }));
    return note;
  },

  updateNote: async (id, data, skipQueue = false) => {
    lastKeystroke = Date.now();

    // Capa 1: IndexedDB, inmediato
    await db.notes.update(id, { ...data, updated_at: new Date().toISOString() }).catch(() => {});
    set(s => ({
      notes: s.notes.map(n => (n.id === id ? { ...n, ...data } : n)),
      currentNote: s.currentNote?.id === id ? { ...s.currentNote, ...data } : s.currentNote,
    }));

    if (!skipQueue) {
      // Capa 2 diferida: los cambios pendientes de una misma nota se fusionan en uno
      const existing = pendingSync.get(id);
      pendingSync.set(id, { data: { ...existing?.data, ...data }, timestamp: Date.now() });
      startWorker(syncViaApi);
      return;
    }

    // Capa 2 directa (llamada desde el worker). Las notas temporales se suben enteras al crearse.
    if (id < 0) return;
    set({ isSaving: true });
    try {
      const updated = await apiClient.put<Note>(`/notes/${id}`, data);
      await db.notes.put(updated);
      set(s => ({
        notes: s.notes.map(n => (n.id === id ? updated : n)),
        currentNote: s.currentNote?.id === id ? updated : s.currentNote,
        isSaving: false,
      }));
    } catch (e) {
      set({ isSaving: false });
      throw e;
    }
  },

  deleteNote: async (id) => {
    if (id > 0) {
      try {
        await apiClient.delete(`/notes/${id}`);
      } catch (e) {
        if (isNetworkError(e)) setPendingDeletes([...new Set([...pendingDeletes(), id])]);
      }
    }
    await db.notes.delete(id);
    pendingSync.delete(id);
    set(s => ({
      notes: s.notes.filter(n => n.id !== id),
      currentNote: s.currentNote?.id === id ? null : s.currentNote,
    }));
  },

  searchNotes: async (query) => {
    const q = query.trim();
    if (q.length < 2) return get().fetchNotes(get().activeSubjectId ?? undefined);
    try {
      // Búsqueda full-text en PostgreSQL (índice GIN + ts_rank)
      set({ notes: await apiClient.get<Note[]>(`/notes/search?q=${encodeURIComponent(q)}`) });
    } catch {
      // Sin red: búsqueda simple sobre IndexedDB
      const needle = q.toLowerCase();
      const userId = useAuthStore.getState().user?.id ?? 0;
      const all = await db.notes.where('user_id').equals(userId).toArray();
      set({
        notes: all.filter(n =>
          n.title.toLowerCase().includes(needle) || (n.content_plain ?? '').toLowerCase().includes(needle)),
      });
    }
  },

  uploadOfflineNotes: async () => {
    const offline = await db.notes.filter(n => n.id < 0).toArray();
    for (const local of offline) {
      try {
        const serverNote = await apiClient.post<Note>('/notes', {
          title: local.title,
          content: local.content,
          subject_id: local.subject_id && local.subject_id > 0 ? local.subject_id : null,
        });
        // Se sustituye el id temporal por el definitivo en IndexedDB y en el estado
        await db.transaction('rw', db.notes, async () => {
          await db.notes.delete(local.id);
          await db.notes.put(serverNote);
        });
        pendingSync.delete(local.id);
        set(s => ({
          notes: s.notes.map(n => (n.id === local.id ? serverNote : n)),
          currentNote: s.currentNote?.id === local.id ? serverNote : s.currentNote,
        }));
      } catch {
        // Se reintentará en la próxima reconexión
      }
    }
  },
}));

// ── Al recuperar la conexión: borrados pendientes → notas nuevas → cambios en cola ──

const flushOfflineChanges = async () => {
  const remaining: number[] = [];
  for (const id of pendingDeletes()) {
    try {
      await apiClient.delete(`/notes/${id}`);
    } catch (e) {
      if (isNetworkError(e)) remaining.push(id); // un 404 (ya borrada) se descarta
    }
  }
  setPendingDeletes(remaining);

  await useNotesStore.getState().uploadOfflineNotes();

  for (const [noteId, { data }] of [...pendingSync.entries()]) {
    pendingSync.delete(noteId);
    try {
      await syncViaApi(noteId, data);
    } catch {
      pendingSync.set(noteId, { data, timestamp: Date.now() });
    }
  }
};

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => { void flushOfflineChanges(); });
}
