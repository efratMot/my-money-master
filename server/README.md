# FinanceFlow Backend

Simple Express server with JSON file storage.

## Setup

```bash
cd server
npm install
node server.js
```

Server runs on `http://localhost:5000`.

## API Endpoints

### Transactions (`/api/transactions`)
- `GET /` — List all
- `GET /:id` — Get by ID
- `POST /` — Create (body: `{ type, amount, category, description, date, isRecurring? }`)
- `PUT /:id` — Update
- `DELETE /:id` — Delete

### Budgets (`/api/budgets`)
- `GET /` — List all
- `GET /:category` — Get by category
- `POST /` — Create (body: `{ category, limit }`)
- `PUT /:category` — Update
- `DELETE /:category` — Delete

### Goals (`/api/goals`)
- `GET /` — List all
- `GET /:id` — Get by ID
- `POST /` — Create (body: `{ name, targetAmount }`)
- `POST /:id/contribute` — Add contribution (body: `{ amount }`)
- `PUT /:id` — Update
- `DELETE /:id` — Delete
