# 🔐 Seguridad

[← Volver al README](../README.md)

Este documento resume **qué medidas** aplica Beta3M. Los valores concretos (ventanas de tiempo,
límites, políticas y configuración) se omiten a propósito.

## Autenticación

- Contraseñas con **bcrypt** (hash con sal, coste ajustado).
- Sesiones con **JWT** firmados en el servidor y con caducidad. Un token caducado o inválido cierra la sesión en el cliente.
- **Verificación de email** y recuperación de contraseña con tokens de un solo uso y caducidad, enviados por email transaccional.
- El login responde con un mensaje genérico ("credenciales incorrectas") sin distinguir email de contraseña.

## API

- **helmet** para las cabeceras de seguridad HTTP.
- **CORS restringido** a una lista blanca de orígenes.
- **Rate limiting** global, más estricto en autenticación, búsqueda e IA.
- **Validación y saneado** declarativo de todas las entradas: tipos, longitudes, patrones y caracteres de control ([`validate.js`](../code-samples/backend/middleware/validate.js)). Los errores no indican qué campo ha fallado.
- **SQL siempre parametrizado**.
- **Autorización por propietario** en cada consulta (`WHERE user_id = $n`), también al relacionar recursos. Por ejemplo, una nota no puede asignarse a una asignatura de otro usuario.
- Errores internos que **no se exponen** al cliente.

## Datos

- PostgreSQL en Supabase con **Row Level Security** activado en todas las tablas. El acceso directo desde fuera de la API está bloqueado.
- Conexión a la base de datos con **TLS** y verificación del certificado.
- **Secretos solo en variables de entorno**, nunca en el código. El repositorio incluye un `.env.example` con valores falsos.

## IA

- Las claves de los proveedores solo existen en el servidor.
- Defensa frente a **prompt injection**: el contenido del usuario va delimitado y se trata como datos.
- Validación de las salidas del modelo antes de usarlas en la interfaz.
- **Límites de uso** por usuario.

## Frontend

- No hay secretos en el bundle: solo la URL pública de la API.
- Accesibilidad y seguridad en los modales (foco atrapado, cierre con Escape).
- Modo invitado aislado: los datos locales no se mezclan con los de una cuenta.

## Este repositorio

- Creado **desde cero**, sin el historial del repositorio privado.
- Contenido copiado por **lista blanca** y revisado con **gitleaks** y búsquedas manuales de patrones antes de cada commit.
- Sin URLs de infraestructura, emails ni datos personales.
