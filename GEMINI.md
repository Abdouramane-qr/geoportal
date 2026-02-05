# GEMINI.md

This document provides a comprehensive overview of the **geoportal** project, intended to be used as a context for future interactions with the Gemini CLI.

## Project Overview

The **geoportal** is a web application built with **Laravel** and **React**. It functions as a Geographic Information System (GIS) for managing and analyzing land parcels, with a specific focus on soil science and erosion risk assessment.

### Key Technologies

*   **Backend:** Laravel 12
*   **Frontend:** React 19 with Vite
*   **Backend/Frontend Bridge:** Inertia.js
*   **Database:** PostgreSQL with PostGIS for geometric data
*   **Authentication:** Laravel Fortify
*   **Styling:** Tailwind CSS
*   **Linting:** ESLint (frontend) and Pint (backend)
*   **Testing:** PHPUnit

### Architecture

The application follows a standard Laravel structure. The backend provides a JSON API that the React frontend consumes. Inertia.js is used to seamlessly render React components from Laravel controllers.

The core of the application revolves around the `Parcel` model, which represents a land parcel. This model includes attributes for ownership, status, and soil data. It also contains business logic for calculating soil erosion metrics, such as the K-factor and soil loss.

The frontend is a single-page application (SPA) built with React. It uses React Query for data fetching from the API and provides a user interface for viewing and interacting with parcel data, including a map-based view (`/carte`).

## Building and Running

### Setup

To set up the project for the first time, run the following command:

```bash
composer run setup
```

This command will:
1.  Install Composer dependencies.
2.  Create a `.env` file from `.env.example`.
3.  Generate an application key.
4.  Run database migrations.
5.  Install NPM dependencies.
6.  Build the frontend assets.

### Development

To start the development servers, run:

```bash
composer run dev
```

This will start the following processes concurrently:
*   The PHP development server (`php artisan serve`).
*   The Vite development server (`npm run dev`).
*   A queue worker.
*   The Pail log viewer.

### Building for Production

To build the frontend assets for production, run:

```bash
npm run build
```

## Development Conventions

### Coding Style

*   **Backend:** The project uses **Pint** for enforcing a consistent PHP coding style. Use the following command to format the code:
    ```bash
    composer run lint
    ```
*   **Frontend:** The project uses **Prettier** for code formatting and **ESLint** for identifying and fixing problems in the JavaScript/TypeScript code. Use the following commands:
    ```bash
    npm run format
    npm run lint
    ```

### Testing

The project uses **PHPUnit** for backend testing. To run the test suite, use:

```bash
composer run test
```

This will also run the linter in test mode.
