# Yatra

Cloud-ready refactor with clean app separation.

## Folder Structure

```text
Yatra./
  backend/        # Stateless Express API (JWT, MongoDB)
  frontend/       # React + Vite client
  legacy-ssr/     # Old EJS + Passport monolith (kept for reference)
  CLOUD_READY_REFACTOR.md
  README.md
```

## Run Backend (API)

```bash
cd backend
npm install
npm run dev
```

API base: `http://localhost:4000/api/v1`

## Run Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Frontend dev URL: `http://localhost:5173`

## Environment Files

- Backend: `backend/.env`
- Frontend: `frontend/.env`

Use each folder's `.env.example` as template.

## Legacy Code

Old SSR code was moved to `legacy-ssr/` to keep the root clean while preserving previous implementation.
