# Tag-It Admin Portal

Admin frontend for the Tag-It backend API. Notion-style black & white UI.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- shadcn-style UI (Radix primitives)
- TanStack Query (server state)
- Zustand (auth state)
- React Router
- React Hook Form + Zod
- Axios

## Getting started

```bash
cd admin
cp .env.example .env
npm install
npm run dev

admin@tagit.local
admin123
```

App runs at **[http://localhost:3000](http://localhost:3000)** (CORS is already allowed on the backend).

Set `VITE_API_BASE_URL` to your backend, e.g. `http://localhost:8080/api/v1`.

## Pages


| Route           | API                                                    | Status  |
| --------------- | ------------------------------------------------------ | ------- |
| `/login`        | `POST /user/login`                                     | Wired   |
| `/`             | Product stats via `GET /product`                       | Wired   |
| `/products`     | `GET /product`                                         | Wired   |
| `/products/:id` | `GET /product/:id`, `PATCH /product/:id/status`        | Wired   |
| `/users/create` | `POST /user`                                           | Wired   |
| `/users/assign` | `POST /user/assign-requesters`, `/unassign-requesters` | Wired   |
| `/users`        | `GET /user/verifiers` + user management UI preview     | Partial |


## Backend-pending UI (for stakeholder review)

Sections marked **Backend pending** are UI-only previews for endpoints that do not exist yet:

- List all users
- Edit user profile / change role
- Suspend / delete user
- Edit product details (non-status fields)

Share these screens with the backend team so they know what to implement.

## Scripts

```bash
npm run dev       # development
npm run build     # production build
npm run preview   # preview production build
```

