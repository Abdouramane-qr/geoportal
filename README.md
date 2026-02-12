# geoportal

## Mobile API Authentication

Base URL (local): `http://127.0.0.1:8000`

### 1) Login

```bash
curl -X POST http://127.0.0.1:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password",
    "device_name": "android-app"
  }'
```

Possible responses:
- `200 OK`: returns `token`, `token_type`, `user`
- `202 Accepted`: returns `two_factor_required: true` + `challenge_token`
- `422 Unprocessable Entity`: invalid credentials

### 2) Two-Factor Challenge (if required)

Use OTP code from authenticator app or a recovery code:

```bash
curl -X POST http://127.0.0.1:8000/api/auth/two-factor-challenge \
  -H "Content-Type: application/json" \
  -d '{
    "challenge_token": "CHALLENGE_TOKEN",
    "code": "123456",
    "device_name": "android-app"
  }'
```

Success returns the same payload as login (`token`, `user`).

### 3) Get Current User

```bash
curl http://127.0.0.1:8000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4) Logout (Revoke Current Token)

```bash
curl -X POST http://127.0.0.1:8000/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Token Notes

- Tokens are Sanctum Personal Access Tokens.
- Store tokens securely on mobile (secure storage / keychain).
- On logout, only the current token is revoked.

## User Management API (Admin)

All endpoints below require:
- `Authorization: Bearer YOUR_TOKEN`
- an authenticated user with role `admin`

### List users (with pagination and search)

```bash
curl "http://127.0.0.1:8000/api/users?page=1&per_page=10&search=alpha" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create user

```bash
curl -X POST http://127.0.0.1:8000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New User",
    "email": "new.user@example.com",
    "password": "Password#12345",
    "role": "agronome",
    "full_name": "New User Full"
  }'
```

### Update user

```bash
curl -X PATCH http://127.0.0.1:8000/api/users/123 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "autorite"}'
```

### Delete user

```bash
curl -X DELETE http://127.0.0.1:8000/api/users/123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```
