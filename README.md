# Music App Backend

A Fastify-based backend that exposes **GraphQL**, **REST** and **static file** endpoints to manage music tracks and genres, including file-upload functionality and real-time updates via GraphQL subscriptions.

---

## ✨ Features

| Area         | Details                                                                                                                                            |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| GraphQL API  | Full CRUD for tracks & genres, file uploads (`Upload` scalar) and **`activeTrack` subscription** that streams a random playable track every 1-2 s. |
| REST API     | Classic endpoints (`/api/tracks`, `/api/genres` etc.) for gradual migration.                                                                       |
| Static files | Serves uploaded audio files from `/files/<filename>` URL.                                                                                          |
| Validation   | Schema-level validation with `zod` & scalars.                                                                                                      |
| Docs         | Swagger-UI for REST (`/documentation`) & GraphQL Playground (`/graphql`).                                                                          |
| Dev UX       | Nodemon + ts-node hot-reload (`npm run dev`).                                                                                                      |

---

## 🚀 Quick Start

### 1. Prerequisites

- **Node.js ≥ 20.13.0**
- **npm ≥ 10.5.2** (comes with Node 20)

### 2. Install dependencies

```bash
npm install
```

### 3. Development mode (TypeScript, hot reload)

```bash
npm run dev           # ts-node + nodemon, listens on http://localhost:8000
```

### 4. Production build

```bash
npm run build         # tsc → dist/
npm start             # node dist/index.js
```

`npm start` expects compiled files in the `dist/` folder, so always run `build` before deploying.

---

## 📚 API Overview

### GraphQL

- Endpoint: `POST http://localhost:8000/graphql`
- Playground: `http://localhost:8000/graphql`
- Subscription WS: `ws://localhost:8000/graphql`

Example subscription:

```graphql
subscription ActiveTrack {
  activeTrack {
    id
    title
    artist
    audioFile
  }
}
```

### REST

| Method | Path              | Description                        |
| ------ | ----------------- | ---------------------------------- |
| GET    | `/api/tracks`     | List tracks (pagination & filters) |
| POST   | `/api/tracks`     | Create track                       |
| PUT    | `/api/tracks/:id` | Update track                       |
| DELETE | `/api/tracks/:id` | Delete track                       |
| GET    | `/api/genres`     | List genres                        |

### Static files

Uploaded audio is available under:

```
http://localhost:8000/files/<fileName>.mp3
```

---

## 🗂 Project Structure

```
├── src
│   ├── controllers/      # REST controllers
│   ├── graphql/          # Schema + resolvers + typeDefs
│   ├── services/         # Business logic
│   ├── utils/            # Helpers (db, slug, etc.)
│   └── index.ts          # App entry-point
└── data/                 # JSON DB & uploaded files
```

---

## 🧪 Testing

- Unit & integration tests written with **Vitest**.
- Run all tests:

```bash
npm test              # vitest run
```

---

## 💡 Tips

- Reset local database:
  ```bash
  npm run bd:reset
  ```
- Seed initial data (`data-initial` → `data`):
  ```bash
  npm run seed
  ```

---

Made with ❤️ for the Front-End School 3.0 homework series.
