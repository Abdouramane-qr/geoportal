## UI/UX Design Tickets - LandSense Hub

These tickets are designed for a React TypeScript environment, incorporating the branding guidelines from `branding.md`.

---
### General / Global Design Principles (Apply to all pages)

1.  **Ticket: Global Font Integration**
    *   **Description:** Implement 'Instrument Sans' as the primary font throughout the application, ensuring proper loading and fallbacks. This involves configuring Tailwind CSS or a global stylesheet to use 'Instrument Sans' for all text elements.
    *   **Guideline Reference:** Typography section.
    *   **Priority:** High
    *   **Type:** Frontend (CSS/Theme)
    *   **Affected Files (Example):** `tailwind.config.js`, `resources/css/app.css`

2.  **Ticket: Color Palette Implementation**
    *   **Description:** Create a centralized CSS variables or Tailwind CSS configuration for the defined color palette (`#2ECC71` (Primary Green), `#27AE60` (Secondary Green), `#D68910` (Accent Orange), `#212121` (Dark Gray), `#616161` (Light Gray), `#ffffff` (White)) to ensure consistent usage across components and pages.
    *   **Guideline Reference:** Palette principale section.
    *   **Priority:** High
    *   **Type:** Frontend (CSS/Theme)
    *   **Affected Files (Example):** `tailwind.config.js`, `resources/css/app.css`

3.  **Ticket: Responsive Grid System Setup**
    *   **Description:** Establish a responsive grid system (e.g., using Tailwind CSS's grid utilities or a custom solution) that supports 2-3 column layouts on desktop and a single column on mobile, with generous `gap` and `padding` for content sections.
    *   **Guideline Reference:** Attitude visuelle section.
    *   **Priority:** High
    *   **Type:** Frontend (CSS/Layout)
    *   **Affected Files (Example):** `resources/js/components/shared/Container.tsx`, global CSS

4.  **Ticket: Standard Button Components (Primary, Secondary, CTA)**
    *   **Description:** Develop reusable React button components (e.g., `ButtonPrimary.tsx`, `ButtonSecondary.tsx`, `ButtonCtaNav.tsx`) that encapsulate the specified styles, hover effects (TranslateY, box-shadow, lighten background), and micro-animations. Ensure they are type-safe with TypeScript.
    *   **Guideline Reference:** Boutons & CTA section.
    *   **Priority:** High
    *   **Type:** Frontend (Components)
    *   **Affected Files (Example):** `resources/js/components/ui/ButtonPrimary.tsx`, `resources/js/components/ui/ButtonSecondary.tsx`, etc.

5.  **Ticket: Implement Soft Gradients and Shadows**
    *   **Description:** Design global styles or utility classes (e.g., `gradient-hero`, `shadow-card`) to encourage the use of soft gradients and subtle box-shadows on cards, containers, and interactive elements throughout the application to avoid flat backgrounds and simulate relief.
    *   **Guideline Reference:** Attitude visuelle, Gradients dominants sections.
    *   **Priority:** Medium
    *   **Type:** Frontend (CSS/Theme)
    *   **Affected Files (Example):** `tailwind.config.js` (for custom utilities), `resources/css/app.css`

6.  **Ticket: Micro-animations for Interactivity**
    *   **Description:** Plan and implement subtle micro-animations (e.g., float, slight translation on hover) on interactive elements, cards, and key figures to enhance user experience and reinforce the technology/reliability visual attitude.
    *   **Guideline Reference:** Attitude visuelle section.
    *   **Priority:** Medium
    *   **Type:** Frontend (CSS/Animations, Components)
    *   **Affected Files (Example):** Global CSS, individual component CSS/Tailwind classes

---
### Page Specific Tickets

#### 1. Users Page (User Management, Profiles)

7.  **Ticket: Users Page Layout and Typography**
    *   **Description:** Design the user list/detail page layout using the established responsive grid. Apply 'Instrument Sans' typography: main headings (e.g., "User Management") at 24-48px (using Primary Green or Dark Gray), body text (user names, roles) at 18px (Dark Gray).
    *   **Guideline Reference:** Typography, Attitude visuelle sections.
    *   **Priority:** High
    *   **Type:** Frontend (Page Design)
    *   **Affected Files (Example):** `resources/js/pages/Users/Index.tsx`, `resources/js/pages/Users/Show.tsx`

8.  **Ticket: User Actions - Buttons & Modals**
    *   **Description:** Integrate `ButtonPrimary` for affirmative actions like "Add New User" or "Save Changes," and `ButtonSecondary` for "Cancel" or "Delete." Ensure any modals for user editing/creation also follow the color and typography guidelines.
    *   **Guideline Reference:** Boutons & CTA, Palette principale sections.
    *   **Priority:** Medium
    *   **Type:** Frontend (Page Design, Components)
    *   **Affected Files (Example):** `resources/js/pages/Users/Index.tsx`, `resources/js/components/users/UserFormModal.tsx`

9.  **Ticket: User Status Badges**
    *   **Description:** Implement user status badges (e.g., "Active", "Inactive", "Pending") using the White background and Primary Green/Accent Orange for text/border depending on status, with generous spacing.
    *   **Guideline Reference:** Palette principale, Attitude visuelle sections.
    *   **Priority:** Low
    *   **Type:** Frontend (Components)
    *   **Affected Files (Example):** `resources/js/components/users/UserStatusBadge.tsx`

---
#### 2. Map Page (`/carte`)

10. **Ticket: Map Page Header & Controls**
    *   **Description:** Design the map page header using Primary Green for main titles (e.g., "Interactive Map") at 24-48px and White/Transparent White for subtitles/taglines if present. Ensure map controls (zoom, layers, search bar) integrate gracefully with the color palette.
    *   **Guideline Reference:** Palette principale, Typography sections.
    *   **Priority:** High
    *   **Type:** Frontend (Page Design)
    *   **Affected Files (Example):** `resources/js/pages/Map/Index.tsx`

11. **Ticket: Parcel Information Cards on Map**
    *   **Description:** Design information cards (e.g., displayed when clicking a parcel) to use soft gradients (e.g., 'Features & crédibilité' gradient or 'Stats light') and subtle shadows. Text should be Dark Gray (18px for body) and titles Primary Green (24px).
    *   **Guideline Reference:** Gradients dominants, Palette principale, Typography, Attitude visuelle sections.
    *   **Priority:** High
    *   **Type:** Frontend (Components)
    *   **Affected Files (Example):** `resources/js/components/map/ParcelInfoCard.tsx`

12. **Ticket: Interactive Elements on Map**
    *   **Description:** Ensure interactive map elements (e.g., search bar, filter buttons, layer toggles) utilize `ButtonPrimary` or `ButtonSecondary` styling and appropriate hover animations.
    *   **Guideline Reference:** Boutons & CTA section.
    *   **Priority:** Medium
    *   **Type:** Frontend (Components)
    *   **Affected Files (Example):** `resources/js/pages/Map/Index.tsx`, map control components

---
#### 3. Import Page (Data Import Functionality)

13. **Ticket: Import Section Layout & Progress Indicators**
    *   **Description:** Design the import page with clear sections for file upload, data mapping configuration, and import progress using the responsive grid. Progress bars should leverage the Primary Green color.
    *   **Guideline Reference:** Palette principale, Attitude visuelle sections.
    *   **Priority:** High
    *   **Type:** Frontend (Page Design)
    *   **Affected Files (Example):** `resources/js/pages/Import/Index.tsx`

14. **Ticket: File Upload & Action Buttons**
    *   **Description:** Implement a file upload component with a `ButtonPrimary` for "Upload File" and `ButtonSecondary` for "Cancel." Provide clear instructions using Light Gray (18px body text).
    *   **Guideline Reference:** Boutons & CTA, Palette principale, Typography sections.
    *   **Priority:** Medium
    *   **Type:** Frontend (Page Design, Components)
    *   **Affected Files (Example):** `resources/js/components/import/FileUpload.tsx`

---
#### 4. Validations Page (Data Validation Results)

15. **Ticket: Validation Results Display**
    *   **Description:** Design the validation results table/list view. Use Dark Gray (18px) for data and Light Gray for descriptions. Highlight valid entries with subtle Primary Green text/border and errors with Accent Orange.
    *   **Guideline Reference:** Palette principale, Typography sections.
    *   **Priority:** High
    *   **Type:** Frontend (Page Design)
    *   **Affected Files (Example):** `resources/js/pages/Validations/Index.tsx`

16. **Ticket: Validation Action Buttons**
    *   **Description:** Integrate `ButtonPrimary` for affirmative actions like "Fix Selected Errors" or "Approve All" and `ButtonSecondary` for "Download Report."
    *   **Guideline Reference:** Boutons & CTA section.
    *   **Priority:** Medium
    *   **Type:** Frontend (Page Design)
    *   **Affected Files (Example):** `resources/js/pages/Validations/Index.tsx`

---
#### 5. Alert Page (System Alerts, Notifications)

17. **Ticket: Alert Component Design**
    *   **Description:** Create a reusable Alert component that uses the color palette: Primary Green for success, Accent Orange for warnings, and define a consistent error color (e.g., a standard red, like `#E74C3C`). Text should be White or Dark Gray (18px) depending on background contrast. Apply subtle shadows to alerts.
    *   **Guideline Reference:** Palette principale, Typography, Attitude visuelle sections.
    *   **Priority:** High
    *   **Type:** Frontend (Components)
    *   **Affected Files (Example):** `resources/js/components/ui/Alert.tsx`

18. **Ticket: Alert List/History Display**
    *   **Description:** Design a page to display a list of historical alerts, using the responsive grid. Each alert item should be presented as a card with soft gradients and micro-animations on hover to indicate interactivity or dismissibility.
    *   **Guideline Reference:** Attitude visuelle, Gradients dominants sections.
    *   **Priority:** Medium
    *   **Type:** Frontend (Page Design)
    *   **Affected Files (Example):** `resources/js/pages/Alerts/Index.tsx`

---
#### 6. Authority Page (User Roles & Permissions)

19. **Ticket: Authority Management Layout**
    *   **Description:** Design the roles and permissions management page using the responsive grid, with clear sections for roles and their assigned permissions. Headings at 24-48px (Primary Green/Dark Gray), body text for descriptions and permission names at 18px (Dark Gray).
    *   **Guideline Reference:** Typography, Attitude visuelle sections.
    *   **Priority:** High
    *   **Type:** Frontend (Page Design)
    *   **Affected Files (Example):** `resources/js/pages/Authority/Index.tsx`

20. **Ticket: Role & Permission Interaction Elements**
    *   **Description:** Use `ButtonPrimary` for "Add Role" or "Save Permissions" and `ButtonSecondary` for "Remove Role." Checkboxes and toggles for permissions should visually align with the brand's color scheme (e.g., Primary Green for active/checked states).
    *   **Guideline Reference:** Boutons & CTA, Palette principale sections.
    *   **Priority:** Medium
    *   **Type:** Frontend (Page Design, Components)
    *   **Affected Files (Example):** `resources/js/pages/Authority/Index.tsx`, `resources/js/components/ui/Checkbox.tsx`, `resources/js/components/ui/Toggle.tsx`

---
#### 7. Audit Page (Activity Logs)

21. **Ticket: Audit Log Display**
    *   **Description:** Design the audit log display with a clear, readable table or list view. Use Dark Gray (18px) for log entries, and Light Gray for timestamps or secondary details. Apply soft gradients to table rows or cards where appropriate to enhance readability and visual appeal.
    *   **Guideline Reference:** Palette principale, Typography, Attitude visuelle sections.
    *   **Priority:** High
    *   **Type:** Frontend (Page Design)
    *   **Affected Files (Example):** `resources/js/pages/Audit/Index.tsx`

22. **Ticket: Audit Log Filters & Export**
    *   **Description:** Implement filter controls (date range, user, action type) and an "Export" button using `ButtonSecondary` styling. Ensure filter inputs visually integrate with the overall theme.
    *   **Guideline Reference:** Boutons & CTA section.
    *   **Priority:** Medium
    *   **Type:** Frontend (Page Design)
    *   **Affected Files (Example):** `resources/js/pages/Audit/Index.tsx`

---
#### 8. Notification Page (In-app Notifications)

23. **Ticket: Notification Display Component**
    *   **Description:** Create a reusable Notification component for in-app messages (e.g., toasts). Similar to the Alert component, but potentially smaller/less intrusive. Use Primary Green for success, Accent Orange for warnings. Text White (18px), subtle shadows, and micro-animations for appearance/disappearance.
    *   **Guideline Reference:** Palette principale, Typography, Attitude visuelle sections.
    *   **Priority:** High
    *   **Type:** Frontend (Components)
    *   **Affected Files (Example):** `resources/js/components/ui/Notification.tsx`

24. **Ticket: Notification Settings/Preference Page**
    *   **Description:** Design a page for managing user notification preferences, utilizing the responsive grid and standard form elements (toggles, checkboxes, dropdowns) styled consistently with the brand's color palette.
    *   **Guideline Reference:** Attitude visuelle, Palette principale sections.
    *   **Priority:** Medium
    *   **Type:** Frontend (Page Design)
    *   **Affected Files (Example):** `resources/js/pages/Settings/NotificationPreferences.tsx`
