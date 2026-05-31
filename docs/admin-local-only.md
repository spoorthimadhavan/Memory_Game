# Admin feature (local only)

The **admin login, inbox, and related API** are intentionally **not uploaded to GitHub**.

They remain on your Mac in the project folder but are excluded by `.gitignore`.

## What stays local

- `frontend/src/app/features/admin/` — login, inbox UI
- `frontend/src/app/core/auth/`, `guards/`, `admin-api.service.ts`
- `frontend/src/app/shared/layout/admin-toolbar-login.component.ts`
- `backend/app/api/routes/admin.py` and related services
- `backend/.env` — your `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `JWT_SECRET`
- `backend/data/contact_messages.csv` and `suggestions.csv` (form submissions)

## What is on GitHub

- Public game, About, Roadmap, Contact, Suggestion pages
- `/feedback/*` API (forms still work; messages save to CSV on your server)
- No `/admin/*` routes or login icon in the public repo

## Use admin on your machine

1. Ensure admin files still exist locally (they were created during development).
2. In `backend/.env` (never commit this file):

```env
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-password
JWT_SECRET=long-random-secret-at-least-32-characters
FRONTEND_URL=http://localhost:4200
```

3. Enable admin routes locally (do **not** commit this change):

Copy `docs/admin-routes.example.ts` into `frontend/src/app/admin.routes.ts` (replace the empty `ADMIN_ROUTES` export).

4. Restore the toolbar login icon locally: copy `admin-toolbar-login.component.ts` from your backup, or re-add `<app-admin-toolbar-login />` to `app-site-toolbar.component.ts` (that component file is gitignored).

5. Start API + UI → http://localhost:4200/admin/login

The API loads admin automatically when `admin.py` is present (`ImportError` is skipped on GitHub clones without those files).

## Back up admin before a new clone

Zip these paths or copy them to a safe folder:

- `frontend/src/app/features/admin/`
- `frontend/src/app/core/auth/`
- `backend/app/api/routes/admin.py`
- `backend/app/services/admin_service.py`
- `backend/.env`
