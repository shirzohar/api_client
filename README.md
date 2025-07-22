# API Client (Mini Postman)

A modern, cross-platform desktop application for sending HTTP requests, managing request history, and visualizing API usage statistics. Built with **TypeScript**, **React**, and **Electron**.

---

## Application Description
API Client is a lightweight desktop tool inspired by Postman, designed for developers and testers to easily send HTTP requests, manage request history, and visualize API usage. The app features a modern UI, dynamic headers, JSON body support, and a dashboard with charts.

---

## Features
- Clean, intuitive, and responsive UI
- Send GET, POST, PUT, DELETE requests
- Dynamic headers and JSON body support
- Request history (CRUD): save, load, delete
- Data persistence via localStorage
- Dashboard with charts (Recharts)
- Error handling and loading states
- Unit-tested core logic
- Popular API templates for quick testing

---

## Screenshots

**Send Request**
![Send Request](./screenshots/send-request.png)

**Request History**
![Request History](./screenshots/history.png)

**Dashboard**
![Dashboard](./screenshots/dashboard.png)

**Popular APIs**
![Popular APIs](./screenshots/popular-apis.png)

---

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd api_client
   ```
2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```
3. **Run in development mode:**
   ```bash
   npm run dev
   ```
   - The Electron app will open automatically. If not, run:
     ```bash
     npx cross-env NODE_ENV=development electron .
     ```

---

## Build Instructions

1. **Build the app:**
   ```bash
   npm run build
   ```
2. **Run the production build:**
   ```bash
   npm start
   ```
3. **To package as an executable:**
   ```bash
   npm run dist
   ```
   - The Windows executable will be in `dist/win-unpacked/API Client.exe`.
   - For a full installer, see electron-builder docs.

---

## Architecture Decisions
- **Electron** for cross-platform desktop delivery
- **React** for UI, with modular components
- **TypeScript** for type safety
- **Webpack** for bundling
- **localStorage** for simple, fast persistence (no DB setup required)
- **Jest** for unit testing
- **Recharts** for dashboard charts
- **Inline styles** for maximum compatibility and simplicity

---

## Known Limitations
- No authentication or environment variables support
- CORS limitations may block some public APIs
- Data is stored locally (per device, per user)
- No advanced request scripting (like Postman pre-request scripts)
- No file upload/download support

---

## API Documentation
See [`src/renderer/api-docs.md`](src/renderer/api-docs.md) for documentation of the main modules and types.

---



