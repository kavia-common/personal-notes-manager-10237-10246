Environment configuration

Create a .env file in the project root (notes_frontend) with:

- VITE_API_BASE_URL: Base URL of your backend REST API (e.g., http://localhost:4000).
- VITE_API_WITH_CREDENTIALS: "true" if your API uses cookie-based auth sessions; "false" to use same-origin only.
- VITE_SITE_URL: The site base URL used for email link redirects (only needed if your backend sends magic links).
- SESSION_SECRET: Secret string for Remix cookie sessions (required in production).

Example:
VITE_API_BASE_URL=http://localhost:4000
VITE_API_WITH_CREDENTIALS=false
VITE_SITE_URL=http://localhost:3000
SESSION_SECRET=please-change-me-to-a-long-random-secret
