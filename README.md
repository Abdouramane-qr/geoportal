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
