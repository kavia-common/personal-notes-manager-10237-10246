Personal Notes Frontend (Remix)

Features implemented:
- User authentication (login, register, logout) via REST API
- CRUD for notes (create, read, update, delete)
- Tagging: create/ensure tags by name and attach to notes
- Search notes by query and filter by tag
- Responsive layout: header, sidebar (tags), list pane, detail pane
- Floating action button for new note
- Light/Dark theme switcher with localStorage preference
- Minimal, modern styling using TailwindCSS
- Environment-based configuration for API base URL and credentials

API endpoints expected:
- POST /auth/login -> { user, token? }
- POST /auth/register -> { user, token? }
- POST /auth/logout -> 204/200
- GET  /notes?q=&tag= -> Note[]
- POST /notes { title, content, tags: string[] } -> Note
- GET  /notes/:id -> Note
- PUT  /notes/:id { title?, content?, tags? } -> Note
- DELETE /notes/:id -> 204/200
- GET  /tags -> Tag[]
- POST /tags { name } -> Tag (idempotent)

Environment variables:
See .env.example and ENVIRONMENT.md.
