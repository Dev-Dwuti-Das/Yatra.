# Yatra

Cloud-ready refactor with clean app separation.






## Architecture Diagram

```mermaid
flowchart TB

subgraph Frontend
    User["User Browser"]
    S3Frontend["S3 Frontend: yatra-frontend-static (React/Vite)"]
end

subgraph "API & Compute"
    APIGateway["API Gateway REST API (prod stage)"]
    Lambda["Lambda: yatra-backend-express (Node.js)"]
    CloudWatch["CloudWatch Logs"]
end

subgraph "Storage & Database"
    MongoDB["MongoDB Atlas M0 (Listings, Users, Hosts)"]
    S3Images["S3 Images: yatra-images-2026 (public-read)"]
end

User -->|Loads static React app| S3Frontend

S3Frontend -->|API calls Axios + JWT| APIGateway
APIGateway -->|Lambda Proxy Integration| Lambda

Lambda -->|Logs and errors| CloudWatch

Lambda -->|Mongoose queries + JWT auth| MongoDB
MongoDB -->|Query results| Lambda

Lambda -->|Upload photos multer + aws-sdk| S3Images
S3Images -->|Returns public URL| Lambda

Lambda -->|Save image URL| MongoDB

User -->|Direct image load| S3Images
```

## Folder Structure

```text
Yatra./
  backend/        # Stateless Express API (JWT, MongoDB)
  frontend/       # React + Vite client
  infrastructure/ # Serverless Framework deployment config
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

## Deployment

Serverless deployment lives in `infrastructure/serverless.yml` and targets the Lambda handler at `backend/handler.js`.
