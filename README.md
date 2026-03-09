# Yatra

Cloud-ready refactor with clean app separation.






## Architecture Diagram

```mermaid
flowchart TB

%% Title
%% Serverless Airbnb Clone – Zero-Cost AWS + MongoDB Atlas (ap-south-1 Mumbai)

subgraph Frontend
    User["User Browser"]
    S3Frontend["S3: yatra-frontend-static (React/Vite)"]
end

subgraph "API & Compute"
    APIGateway["API Gateway\nREST API (prod stage)"]
    Lambda["Lambda\n yatra-backend-express (Node.js)"]
    CloudWatch["CloudWatch Logs"]
end

subgraph "Storage & Database"
    MongoDB["MongoDB Atlas\nAtlas M0 (Listings, Users, Hosts)"]
    S3Images["S3: yatra-images-2026 (public-read)"]
end

%% User loads frontend
User -->|Loads static React app| S3Frontend

%% Frontend to API
S3Frontend <-->|API calls (Axios + JWT)| APIGateway

%% API Gateway to Lambda
APIGateway -->|Lambda Proxy Integration| Lambda

%% Lambda connections
Lambda -->|logs & errors| CloudWatch
Lambda <-->|Mongoose queries + JWT auth| MongoDB
Lambda -->|Upload photos (multer + aws-sdk)| S3Images
S3Images -->|returns public URL| Lambda
Lambda -->|saves image URLs| MongoDB

%% Direct browser image loading
User -->|Direct image load from S3| S3Images
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
