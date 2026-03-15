# Lore Repository: Performance & Dependency Audit

This document provides a comprehensive performance and dependency audit of the **kynaruniverse/Lore** repository, focusing on bundle size, dependency management, and potential optimizations.

## 1. Dependency Analysis

The project uses **pnpm** for package management, which is a highly efficient choice. The `node_modules` directory occupies approximately **464MB**, which is typical for a modern React project with a comprehensive UI library like Radix UI and Tailwind CSS.

### 1.1. Production Dependencies

The project has a robust set of production dependencies, primarily focused on the frontend UI and state management.

| Category | Key Dependencies | Impact |
| :--- | :--- | :--- |
| **Core Framework** | `react`, `react-dom`, `wouter` | Essential for the SPA architecture. |
| **UI Components** | `@radix-ui/*`, `lucide-react`, `framer-motion` | Provides accessible, high-quality UI elements and animations. |
| **Styling** | `tailwindcss`, `class-variance-authority`, `tailwind-merge` | Enables utility-first styling and efficient class management. |
| **Data & Validation** | `zod`, `react-hook-form`, `nanoid` | Handles data schema validation, form management, and ID generation. |
| **Visualization** | `recharts` | Used for data-driven charts and visualizations. |
| **Backend** | `express` | Minimal server for serving the application. |
| **Unused/Redundant** | `axios` | **Axios is listed as a dependency but not used in the codebase.** The project uses the native `fetch` API or local data access. |

### 1.2. Development Dependencies

The development environment is well-equipped with modern tools.

- **Build & Dev Server**: `vite`, `@vitejs/plugin-react`, `esbuild`.
- **TypeScript**: `typescript`, `@types/*`.
- **Linting & Formatting**: `prettier`.
- **Testing**: `vitest`.
- **PostCSS**: `autoprefixer`, `postcss`.

## 2. Build Performance & Bundle Size

A production build was performed using `pnpm build`, yielding the following results:

| Asset | Size (Uncompressed) | Size (Gzip) | Status |
| :--- | :--- | :--- | :--- |
| `index.html` | 367.96 kB | 105.66 kB | **Large** |
| `index.js` (Main Bundle) | 571.40 kB | 170.02 kB | **Warning (>500kB)** |
| `index.css` | 126.69 kB | 19.78 kB | **Good** |

### 2.1. Observations & Issues

1. **Large Main Bundle**: The main JavaScript bundle exceeds the recommended 500kB limit. This is likely due to the inclusion of large libraries like `framer-motion`, `recharts`, and the entire `lucide-react` icon set if not properly tree-shaken.
2. **Large `index.html`**: The `index.html` file is unusually large (367kB). This is often caused by inlining large amounts of CSS or data, or by including large static assets directly in the HTML.
3. **Missing Environment Variables**: The build process reported warnings for missing environment variables: `%VITE_ANALYTICS_ENDPOINT%` and `%VITE_ANALYTICS_WEBSITE_ID%`. This indicates that the analytics integration is not fully configured for production.
4. **Analytics Script Issue**: The Umami analytics script in `index.html` is missing the `type="module"` attribute, which prevents it from being bundled correctly by Vite.

## 3. Performance Optimization Recommendations

### 3.1. Bundle Size Reduction

- **Code Splitting**: Implement dynamic imports (`import()`) for large pages and components (e.g., `KnowledgeGraph`, `Map`, `SearchPage`) to reduce the initial load time.
- **Tree Shaking**: Ensure that only the necessary icons from `lucide-react` are imported.
- **Manual Chunking**: Configure Vite's `rollupOptions.output.manualChunks` to split the vendor libraries into a separate bundle.
- **Remove Unused Dependencies**: Uninstall `axios` to reduce the project's footprint.

### 3.2. Build Process Improvements

- **Environment Variable Configuration**: Ensure all necessary `VITE_` environment variables are defined in the production environment or a `.env.production` file.
- **Fix Analytics Integration**: Add `type="module"` to the analytics script and ensure the variables are correctly injected during the build.

### 3.3. Runtime Performance

- **Memoization**: Use `React.memo`, `useMemo`, and `useCallback` in performance-critical components like the `KnowledgeGraph` to prevent unnecessary re-renders.
- **Image Optimization**: Use modern image formats (WebP/AVIF) and implement lazy loading for images in the Lore and Page views.
- **LocalStorage Efficiency**: While `localStorage` is fast for small amounts of data, it can become a bottleneck as the knowledge base grows. Consider migrating to `IndexedDB` for better performance and larger storage capacity.

---

This performance and dependency audit identifies several key areas for improvement, particularly regarding bundle size and build configuration. Addressing these issues will significantly enhance the application's load time and overall user experience.
