# Lore Repository: Architecture Overview

This document provides a comprehensive overview of the architecture of the **kynaruniverse/Lore** repository. The analysis is based on a thorough reconnaissance of the project's file structure, configuration, and source code.

## 1. Project Overview

The Lore project is a sophisticated, client-centric web application designed as a community-driven knowledge platform. It empowers users to create, manage, and explore interconnected knowledge bases called "Lores." Each Lore serves as a dedicated space for a specific topic, such as a TV series, video game, or historical event, and is composed of individual "Pages" that contain detailed content, images, tags, and relational links to other pages.

The application is distinguished by its polished user interface and a strong emphasis on user experience, which is governed by a custom design system named **"Ember Archive."** This design system ensures a consistent, warm, and immersive environment for knowledge exploration and contribution.

## 2. Technology Stack

The project leverages a modern, full-stack TypeScript approach, with a clear separation between the frontend and backend concerns.

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19** | The core library for building the user interface, utilizing a component-based architecture. |
| **Language** | **TypeScript 5.6** | Provides static typing for both frontend and backend, enhancing code quality and maintainability. |
| **Build Tool** | **Vite 7** | A fast and modern build tool and development server for the frontend. |
| **Styling** | **Tailwind CSS 4** | A utility-first CSS framework for rapid and consistent UI development. |
| **UI Components** | **Radix UI** | A collection of unstyled, accessible UI primitives used as the foundation for the design system. |
| **Routing** | **wouter** | A minimalist and efficient routing library for React SPAs. |
| **State Management** | **Custom Hooks & localStorage** | Data is managed through custom React hooks and persisted in the browser's `localStorage`. |
| **Backend Framework** | **Express 4** | A minimal and flexible Node.js web application framework used for serving the application. |
| **Runtime** | **Node.js** | The JavaScript runtime environment for the backend server. |
| **Package Manager** | **pnpm 10** | A fast, disk space-efficient package manager. |

## 3. Repository Structure

The repository is organized into several key directories, each with a specific role in the application's lifecycle.

- **`client/`**: Contains the entire frontend application, including source code, public assets, and configuration.
  - **`src/`**: The heart of the frontend, containing components, contexts, hooks, pages, and library functions.
  - **`public/`**: Static assets that are served directly by the web server.
- **`server/`**: Contains the backend server code, primarily responsible for serving the frontend assets and handling routing fallbacks.
- **`shared/`**: Contains code and constants that are shared between the client and the server, ensuring consistency across the stack.
- **`patches/`**: Contains patches for third-party dependencies, such as `wouter`, to address specific issues or add custom functionality.
- **`dist/`**: The build output directory, containing the optimized and bundled application ready for deployment.

## 4. Architecture Style

The Lore project follows a **Single Page Application (SPA)** architecture with a **Client-Side Data Management** approach.

### 4.1. Frontend Architecture

The frontend is built using a modular component-based architecture. It is organized into:
- **Pages**: High-level components representing different views of the application (e.g., Home, LoreHub, PageView).
- **Components**: Reusable UI elements, further divided into core components (e.g., Layout, KnowledgeGraph) and atomic UI primitives (e.g., Button, Input).
- **Contexts**: Used for global state management, such as the application's theme.
- **Hooks**: Custom React hooks for encapsulating logic and interacting with the data store.
- **Library (lib)**: Contains utility functions and the core data management logic.

### 4.2. Data Flow and Persistence

A key architectural decision in the current version of Lore is the use of **`localStorage` for data persistence**.
- **Seed Data**: The application comes with a set of predefined "seed" lores and pages, which are stored as static constants in `client/src/lib/data.ts`.
- **User Data**: When a user creates or edits a lore or page, the changes are saved to the browser's `localStorage`.
- **Data Store**: The `client/src/lib/loreStore.ts` file acts as the central data access layer, providing functions to read, write, and manipulate both seed and user-created data.

### 4.3. Backend Architecture

The backend is a minimal Express server (`server/index.ts`) whose primary responsibility is to:
1. **Serve Static Assets**: Deliver the bundled frontend files from the `dist/public` directory.
2. **SPA Routing Fallback**: Implement a "catch-all" route that serves `index.html` for any request that doesn't match a static file, allowing the frontend router to handle the request.

## 5. Key Components and Services

- **Knowledge Graph**: A custom SVG-based visualization component (`KnowledgeGraph.tsx`) that displays the relationships between pages within a lore.
- **Map Integration**: A Google Maps integration (`Map.tsx`) that provides geographical context for locations within a lore.
- **Ember Archive Design System**: A comprehensive set of styles and components that define the application's unique visual identity.
- **Search Service**: A client-side search implementation (`SearchPage.tsx`) that allows users to find lores and pages based on their content and metadata.

## 6. Entry Points

- **Frontend**: `client/src/main.tsx` is the entry point for the React application.
- **Backend**: `server/index.ts` is the entry point for the Node.js server.

## 7. Build and Deployment

- **Build System**: The project uses Vite for the frontend build and `esbuild` for the backend server build.
- **Deployment**: The project is configured for deployment on **Vercel**, as evidenced by the `vercel.json` configuration file. The build process generates a `dist/` directory containing the final production-ready assets.

## 8. External Integrations

- **Google Maps API**: Used for the map visualization features.
- **Umami Analytics**: Integrated into `index.html` for privacy-focused web analytics.
- **Google Fonts**: Used for the "Lora" and "Inter" typefaces.

## 9. Authentication Mechanisms

The project currently includes a `ManusDialog` component and a `getLoginUrl` utility, suggesting an integration with a **Manus-based OAuth** authentication system. However, the core data management logic currently operates on a per-user basis using `localStorage`, without a centralized backend authentication and database system.

---

This architecture overview provides a solid foundation for the subsequent phases of the audit, including threat modeling, security analysis, and performance evaluation.
