# DevDesk

🚀 **Live Demo:** [DevDesk — Issue Tracker](https://dev-desk-xj52.vercel.app)

A developer issue-tracking workspace built as a take-home assessment project. DevDesk lets you create, view, update, and delete software issues in a clean, responsive dashboard — with live statistics, search, and filtering built in.

---

## Features

- **Issue management** — create, view, edit, and delete issues through a modal-driven UI
- **Issue types** — Bug, Feature, Improvement, Task — each with a distinct inline SVG icon
- **Priority levels** — Low, Medium, High, Critical
- **Status tracking** — Open, In Progress, Resolved, Closed
- **Live dashboard statistics** — total issue count plus per-status breakdowns, loaded from the API on every change
- **Title search** — real-time client-side filtering by issue title
- **Status, priority, and type filters** — combinable dropdowns with a one-click clear
- **Form validation** — required title (3–100 characters), optional description (max 1000 characters), character counter, inline error messages
- **Confirmation dialogs** — explicit confirmation before any deletion
- **Loading, empty, and error states** — throughout the issue list and statistics panels
- **Responsive layout** — sidebar navigation on desktop, compact top bar on mobile (375 px and up)

---

## Technology Stack

### Frontend
| Technology | Version |
|---|---|
| React | ^19.2.8 |
| Vite | ^8.3.0 |
| ESLint + react-hooks plugin | ^10.10.0 / ^7.1.1 |

### Backend
| Technology | Version |
|---|---|
| Node.js | LTS (v18 or v20 recommended) |
| Express | ^5.3.0 |
| Mongoose | ^9.11.1 |
| cors | ^2.8.6 |
| dotenv | ^18.0.7 |
| nodemon (dev) | ^3.1.14 |

### Database
- **MongoDB** — document store for issues

---

## Project Structure

```
devdesk/
├── .gitignore
├── README.md
│
├── backend/
│   ├── server.js              # Express entry point; connects to MongoDB, mounts routes
│   ├── package.json
│   ├── models/
│   │   └── Issue.js           # Mongoose schema and model
│   └── routes/
│       └── issueRoutes.js     # All /api/issues route handlers
│
└── frontend/
    ├── .env.example           # Frontend environment variable template
    ├── vite.config.js
    ├── eslint.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx            # App shell — sidebar + main content
        ├── index.css          # Design system tokens and all component styles
        ├── services/
        │   └── issueService.js  # All fetch() calls to the backend API
        ├── components/
        │   ├── Navbar.jsx       # Sidebar navigation component
        │   ├── Badge.jsx        # Status, priority, and type badge components
        │   ├── IssueCard.jsx    # Single issue row with type icon
        │   ├── FilterBar.jsx    # Search input and filter dropdowns
        │   ├── IssueForm.jsx    # Create / edit modal form
        │   ├── IssueDetail.jsx  # Issue detail view modal
        │   ├── ConfirmModal.jsx # Delete confirmation dialog
        │   └── StatCard.jsx     # Statistics tile component (retained)
        └── pages/
            └── Dashboard.jsx    # Main page — stats strip, toolbar, issue list
```

---

## Prerequisites

- **Node.js and npm** — any recent LTS release (v18 or v20 recommended)
- **MongoDB** — a locally running MongoDB instance, or a MongoDB Atlas connection string

---

## Installation and Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/SyedRoshannn/DevDesk.git
cd DevDesk
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory:

```
# backend/.env
MONGODB_URI=mongodb://127.0.0.1:27017/devdesk
PORT=5000
```

> Replace the `MONGODB_URI` value with your MongoDB Atlas URI if you are not running MongoDB locally.
> `MONGODB_URI` is required. The server will exit on startup if it cannot connect.

Start the backend:

```bash
# Development — auto-restarts on file changes
npm run dev

# Or: production-style
npm start
```

The API will be available at `http://localhost:5000`.
Verify it is running: `GET http://localhost:5000/api/health`

### 3. Set up the frontend

Open a **second terminal** from the project root:

```bash
cd frontend
npm install
```

The frontend connects to `http://localhost:5000/api` by default.
If your backend runs on a different port, create a `frontend/.env` file:

```
# frontend/.env  (optional)
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Environment Variables

### Backend — `backend/.env`

| Variable | Required | Example value | Notes |
|---|---|---|---|
| `MONGODB_URI` | **Yes** | `mongodb://127.0.0.1:27017/devdesk` | Local or Atlas URI |
| `PORT` | No | `5000` | Defaults to `5000` if omitted |

### Frontend — `frontend/.env` (optional)

| Variable | Required | Example value | Notes |
|---|---|---|---|
| `VITE_API_BASE_URL` | No | `http://localhost:5000/api` | Defaults to this value if omitted |

> `.env` files are listed in `.gitignore` and are never committed to the repository. See `frontend/.env.example` for the frontend template.

---

## API Reference

All issue endpoints are mounted at `/api/issues`. Every response follows this envelope:

```json
{ "success": true, "data": { ... } }
```

On error:

```json
{ "success": false, "message": "Human-readable error description" }
```

---

### `POST /api/issues` — Create an issue

**Request body:**

```json
{
  "title": "Login button unresponsive on Safari",
  "description": "Clicking the login button does nothing on Safari 17.",
  "type": "bug",
  "priority": "high",
  "status": "open"
}
```

| Field | Type | Required | Constraints |
|---|---|---|---|
| `title` | String | Yes | 3–100 characters |
| `description` | String | No | Max 1000 characters; defaults to `""` |
| `type` | String | No | `bug` `feature` `improvement` `task`; defaults to `task` |
| `priority` | String | No | `low` `medium` `high` `critical`; defaults to `medium` |
| `status` | String | No | `open` `in_progress` `resolved` `closed`; defaults to `open` |

**Success:** `201 Created` — returns `{ "success": true, "data": { ...issue } }`
**Validation error:** `400`

---

### `GET /api/issues` — List all issues

**Success:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "_id": "664a1b2c3d4e5f6a7b8c9d01",
      "title": "Login button unresponsive on Safari",
      "description": "Clicking the login button does nothing on Safari 17.",
      "type": "bug",
      "priority": "high",
      "status": "open",
      "createdAt": "2024-05-20T10:30:00.000Z",
      "updatedAt": "2024-05-20T10:30:00.000Z"
    }
  ]
}
```

---

### `GET /api/issues/stats` — Dashboard statistics

Returns total count plus a breakdown by status. This route is registered before `/:id` so the literal string `"stats"` is never treated as an ID.

**Success:** `200 OK`

```json
{
  "success": true,
  "data": {
    "total": 12,
    "open": 5,
    "in_progress": 3,
    "resolved": 2,
    "closed": 2
  }
}
```

---

### `GET /api/issues/:id` — Get a single issue

| Outcome | Status |
|---|---|
| Found | `200 OK` — `{ "success": true, "data": { ...issue } }` |
| Not found | `404` — `{ "success": false, "message": "Issue not found" }` |
| Malformed ID | `400` — `{ "success": false, "message": "Invalid issue ID format" }` |

---

### `PATCH /api/issues/:id` — Update an issue

Partial update — only fields present in the request body are changed. Fields outside the schema are silently ignored. Schema validation (`runValidators: true`) is enforced on every update.

**Request body** (all fields optional):

```json
{
  "status": "in_progress",
  "priority": "critical"
}
```

| Outcome | Status |
|---|---|
| Success | `200 OK` — returns updated issue |
| Validation error | `400` |
| Not found | `404` |
| Malformed ID | `400` |

---

### `DELETE /api/issues/:id` — Delete an issue

**Success:** `200 OK`

```json
{ "success": true, "message": "Issue deleted successfully" }
```

| Outcome | Status |
|---|---|
| Success | `200 OK` |
| Not found | `404` — `{ "success": false, "message": "Issue not found" }` |
| Malformed ID | `400` — `{ "success": false, "message": "Invalid issue ID format" }` |

---

### `GET /api/health` — Health check

```json
{ "success": true, "message": "DevDesk API is running!" }
```

---

## Validation and Error Handling

**Backend (Mongoose + Express):**
- `title` is required; 3–100 characters; whitespace-only titles are rejected
- `description` is optional; maximum 1000 characters
- `type`, `priority`, and `status` are validated against their enum values; invalid values return `400`
- Malformed MongoDB ObjectIds return `400 Invalid issue ID format`
- Missing documents return `404 Issue not found`
- Unexpected server errors return `500` with the error message

**Frontend (before API call):**
- Title required check, minimum 3 characters, maximum 100 characters
- Description maximum 1000 characters with a live character counter
- Errors are displayed inline below the relevant field
- API errors from the backend surface in an alert banner inside the form modal

---

## AI-Assisted Development

This project was built with the assistance of **Kiro IDE Agent**, an AI-powered development environment. The following work was completed with Kiro’s direct involvement:

1. **API design and implementation** — Kiro generated all six Express route handlers (`POST`, `GET`, `GET /stats`, `GET /:id`, `PATCH /:id`, `DELETE /:id`), including `CastError` and `ValidationError` handling. I reviewed each handler against the Mongoose schema and tested all endpoints manually in Postman before moving to the frontend.

2. **React frontend architecture** — Kiro designed and implemented the full component hierarchy (`Dashboard`, `IssueCard`, `IssueForm`, `IssueDetail`, `FilterBar`, `Badge`, `ConfirmModal`), the `issueService.js` API layer, and a `useReducer`-based fetch pattern that satisfies the strict `react-hooks/set-state-in-effect` rule enforced by `eslint-plugin-react-hooks` v7. I reviewed the component structure, verified prop flows, and validated filtering and modal behavior in the browser.

3. **UI/UX redesign across three iterative passes** — Kiro redesigned the frontend from the Vite boilerplate into a sidebar-based developer workspace: a full layout redesign, a visual polish pass introducing per-type SVG icons, a compact stats strip with accent bars, and a final targeted pass removing a duplicate New Issue button and improving layout cohesion. I reviewed each iteration in the browser, requested specific changes, and confirmed the final result visually.

4. **Accessibility and keyboard navigation** — Kiro refactored issue rows from `<div>` to `<button>` elements for native Enter/Space keyboard activation, added `aria-label` and `aria-current` attributes, associated form labels with inputs via `htmlFor`/`id`, and ensured all interactive controls have visible focus rings. I verified keyboard navigation manually using tab and Enter in the browser.

5. **Documentation** — Kiro generated this README by directly inspecting all source files — route handlers, the Mongoose model, environment configuration, package scripts, and component logic — before writing any content. I reviewed the README against the actual implementation for accuracy.

**Validation approach:** After each AI-assisted change, `npm run lint` and `npm run build` were run from the `frontend/` directory and confirmed zero errors before proceeding. All CRUD operations, search, filter combinations, empty states, validation errors, and the backend-offline error state were tested manually in the browser. No automated test suite exists for this project.

---

## Known Limitations

- **No authentication** — the API has no access control; any client can read, create, modify, or delete issues
- **No pagination** — all issues are fetched in a single request; large datasets will degrade performance
- **No automated tests** — there is no unit or integration test suite; all testing was performed manually
- **Client-side filtering only** — search and filter operations run on the already-fetched issue list; there is no server-side query filtering

---

## Future Improvements

- User authentication and per-user issue ownership
- Server-side pagination and query filtering
- Unit and integration tests (Vitest, Supertest)
- Issue assignment, labels, and due dates
- Dark mode support

---

## License

No license has been specified for this repository.
