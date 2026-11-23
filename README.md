# Proyecto Base — Parcial Práctico Backend (NestJS + MongoDB)

API REST en NestJS y Mongoose para la gestión de **Usuarios (`/users`)** y **Tareas (`/tasks`)**.

---

## Requisitos Previos

- **Node.js** 18+ y **npm**
- **Docker Desktop** (o instancia local de MongoDB en el puerto `27017`)

---

## Instalación y Puesta en Marcha

1. **Levantar la base de datos MongoDB:**
   ```bash
   docker compose up -d
   ```
   *(Si utilizas una instancia local o MongoDB Atlas diferente a `mongodb://localhost:27017/nest-parcial`, configura la variable `MONGODB_URI` en un archivo `.env` tomando como base `.env.example`.)*

2. **Instalar dependencias del proyecto:**
   ```bash
   npm install
   ```

3. **Iniciar la aplicación en modo desarrollo:**
   ```bash
   npm run start:dev
   ```
   El servidor quedará disponible en `http://localhost:3000`.

---

## Pruebas y Validación

- **Ejecutar pruebas unitarias:**
  ```bash
  npm test
  ```
- **Ejecutar pruebas end-to-end:**
  ```bash
  npm run test:e2e
  ```
- **Verificar compilación y linter:**
  ```bash
  npm run build
  npm run lint
  ```

---

## Endpoints del Sistema

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Público | Verificación básica del servidor |
| `POST` | `/users` | Público | Crear usuario (`name`, `email`) |
| `GET` | `/users` | Público | Listar usuarios registrados |
| `GET` | `/users/:id` | Público | Consultar usuario por ID |
| `GET` | `/tasks` | Público | Listar tareas registradas |
| `GET` | `/tasks/:id` | Público | Consultar tarea por ID |
| `POST` | `/tasks` | Restringido (`Authorization: admin-secret-token`) | Crear una tarea asociada a un usuario |

También puedes importar `nest-parcial.postman_collection.json` en Postman o utilizar `requests.http` con la extensión REST Client de VS Code para probar manualmente los endpoints.

---

## explicacion de los 4 casos

### caso 1
creé un DTO llamado CreateTaskDto que define cuáles datos se pueden enviar al crear una tarea, usando class-validator y class-transformer. Después configuré un ValidationPipe global en main.ts para que revise todas las peticiones y rechace las que traen datos que no están en el DTO. Por último cambié el esquema de tareas para que sea estricto y así la base de datos solo guarde los campos que están definidos.

### caso 2

Hice que el módulo de usuarios exporte su servicio UsersService para que sea la única forma de trabajar con usuarios desde otros módulos. Quité del módulo de tareas el acceso directo al esquema de usuarios e importé el módulo de usuarios. Ahora la revisión de que el usuario exista se hace usando UsersService.

### caso 3
Eliminé el Middleware que bloqueaba todas las rutas de tareas. En su lugar creé un Guard llamado AuthGuard que revisa la cabecera Authorization y lanza una ForbiddenException cuando el token no es válido. Puse el Guard solo en la creación de tareas, así las consultas de tareas quedaron públicas.

### caso 4

Quité los modelos de Mongoose del controlador de tareas para que solo dependa de TasksService. Pasé la lógica de crear una tarea, que incluye revisar el usuario y guardarla, a un método create dentro de TasksService. Ahora el controlador solo recibe el DTO y le pasa el trabajo al servicio. También agregué pruebas unitarias para el controlador y el servicio usando mocks.
