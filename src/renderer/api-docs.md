# API Documentation

## Components

### `RequestScreen`
- **Props:**
  - `onHistoryAdd(req: ApiRequest)`: callback when a request is sent
  - `url?`, `method?`, `body?`: optional prefill values
- **Description:**
  - Main form for sending HTTP requests. Supports dynamic headers, JSON body, and displays results.

### `HistoryScreen`
- **Props:**
  - `history: ApiRequest[]`: list of saved requests
  - `onDelete(id: string)`: delete a request
  - `onLoad(req: ApiRequest)`: load a request into the form
- **Description:**
  - Displays request history with load/delete actions.

### `Dashboard`
- **Props:**
  - `history: ApiRequest[]`: list of requests
- **Description:**
  - Visualizes request statistics (methods, status codes, requests per day) using Recharts.

### `PopularApis`
- **Props:**
  - `onSelect(api: ApiTemplate)`: callback when a template is chosen
- **Description:**
  - Shows a list of popular API templates for quick testing.

---

## Hooks

### `useRequestHistory`
- **Returns:** `[history, addRequest, deleteRequest]`
- **Description:**
  - Custom React hook for managing request history in localStorage.

---

## Types

### `ApiRequest`
- `{ id: string, url: string, method: string, body?: string, date: string, status?: number }`

### `ApiTemplate`
- `{ url: string, method: string, body?: string, description?: string }` 