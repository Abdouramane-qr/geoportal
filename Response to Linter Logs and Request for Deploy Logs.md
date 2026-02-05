Thank you for providing the logs!

These logs are from the **`linter` job** in your GitHub Actions workflow. While they show some important errors and warnings that need to be addressed in your React code (which can impact application stability and performance), they do *not* tell us why the **`deploy` job** is failing.

The `linter` job detected several critical issues:

*   **React Hook `set-state-in-effect` errors**: You are calling `setState` directly inside `useEffect` hooks in multiple components (`GISMap.tsx`, `MapContainer.tsx`, `RestrictedGISMap.tsx`, `NotificationCenter.tsx`, `Navbar.tsx`, `Index.tsx`, `ValidationPage.tsx`). This is an anti-pattern that can lead to performance problems, unexpected behavior, or even infinite loops.
*   **React Hook `preserve-manual-memoization` errors**: In `Index.tsx`, your `useMemo` hook for `kpiData` has an empty dependency array (`[]`) but it uses `parcels`. This will cause the memoized value to be stale.
*   **React Hook `purity` error**: In `sidebar.tsx`, `Math.random()` is called directly during rendering, which is an impure operation and can lead to unpredictable results.
*   Numerous **`no-unused-vars` errors**: Variables are defined but never used.
*   **`import/order` error**: Incorrect import order in `ValidationMapView.tsx`.

These are important to fix for your application's health, but they are separate from the deployment failure.

**To debug the deployment failure, I still need the logs from the `deploy` job.**

**Please follow these steps again, but ensure you select the correct job:**

1.  **Go to the "Actions" tab** in your GitHub repository: `https://github.com/Abdouramane-qr/geoportal/actions`
2.  **Click on the most recent workflow run** that shows a "Failure" (it should be the one associated with the commit `d1eeafa` for "Confirmation of successful push and task completion").
3.  On the left sidebar, **click on the job named `.github/workflows/deploy.yml`** (or simply `deploy`). This job will be marked with a red 'X'.
4.  **Copy the entire output/logs from that failing `deploy` job** and paste it here.

Once I have those logs, I can help you fix the deployment issue. After that, we can address these linting errors in your React code.