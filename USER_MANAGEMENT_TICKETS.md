# User Management Tickets

## Lot 1 - Backend Foundations (In Progress)
- [x] `USER-CRUD-001` Create `UserPolicy` (RBAC admin-first).
- [x] `USER-CRUD-002` Add secured API CRUD endpoints for users.
- [x] `USER-CRUD-003` Implement `UserController` (index/show/store/update/destroy).
- [x] `USER-CRUD-004` Add Feature tests for authz + CRUD API behavior.

## Lot 2 - Frontend UsersPage Integration
- [ ] `USER-UI-001` Load users from backend API instead of local empty state.
- [ ] `USER-UI-002` Implement create user flow from "Nouvel utilisateur".
- [ ] `USER-UI-003` Implement edit role/profile and activate/deactivate actions.
- [ ] `USER-UI-004` Handle API errors and optimistic updates safely.

## Lot 3 - Role & Access Hardening
- [ ] `RBAC-001` Protect `/utilisateurs` route with auth and role check.
- [ ] `RBAC-002` Align role naming front/back (`autorite` vs `autorité_locale`).
- [ ] `RBAC-003` Add role-aware navigation visibility (hide forbidden pages).
- [ ] `RBAC-004` Add tests for route/page access by role.

## Lot 4 - Operational Quality
- [ ] `OPS-001` Add API docs examples for user CRUD.
- [ ] `OPS-002` Add audit logging for user create/update/delete.
- [ ] `OPS-003` Add pagination + search on user list endpoint.
