# User Management Tickets

## Lot 1 - Backend Foundations (In Progress)
- [x] `USER-CRUD-001` Create `UserPolicy` (RBAC admin-first).
- [x] `USER-CRUD-002` Add secured API CRUD endpoints for users.
- [x] `USER-CRUD-003` Implement `UserController` (index/show/store/update/destroy).
- [x] `USER-CRUD-004` Add Feature tests for authz + CRUD API behavior.

## Lot 2 - Frontend UsersPage Integration
- [x] `USER-UI-001` Load users from backend API instead of local empty state.
- [x] `USER-UI-002` Implement create user flow from "Nouvel utilisateur".
- [x] `USER-UI-003` Implement edit role/profile actions (role updates + delete).
- [x] `USER-UI-004` Handle API errors and optimistic updates safely.

## Lot 3 - Role & Access Hardening
- [x] `RBAC-001` Protect `/utilisateurs` route with auth and role check.
- [x] `RBAC-002` Align role naming front/back (`autorite` standard).
- [x] `RBAC-003` Add role-aware navigation visibility (hide forbidden pages).
- [x] `RBAC-004` Add tests for route/page access by role.

## Lot 4 - Operational Quality
- [x] `OPS-001` Add API docs examples for user CRUD.
- [x] `OPS-002` Add audit logging for user create/update/delete.
- [x] `OPS-003` Add pagination + search on user list endpoint.

## Lot 5 - Security & Consistency (In Progress)
- [x] `SEC-001` Protect `/api/parcels` write operations behind `auth:sanctum`.
- [x] `SEC-002` Add feature tests for guest-denied parcel API writes.
- [x] `CONS-001` Make user profile upsert resilient for legacy data (`updateOrCreate`).
- [x] `SEC-003` Add dedicated API endpoint/authorization for audit log consultation.
- [x] `SEC-004` Tighten web route access for non-public back-office pages.

## Lot 6 - Mobile Auth Observability
- [x] `AUTH-AUDIT-001` Log `auth.login.success` into `audit_logs`.
- [x] `AUTH-AUDIT-002` Log `auth.login.failed` into `audit_logs`.
