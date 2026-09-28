# OnlyWeebs — Nuxt front

Nuxt 4 front-end for the `symfonyOW` API.

## Pages

| Route          | API used                                  |
| -------------- | ----------------------------------------- |
| `/`            | `GET /api/home`                           |
| `/search`      | `GET /api/animes?searchTerm=&page=&limit=` |
| `/anime/:id`   | `GET /api/animes/{id}`                    |
| `/login`       | `POST /api/auth/login`                    |
| `/register`    | `POST /api/auth/register` (then logs in)  |

The nav bar loads the current user from `GET /api/me`, logs out via `POST /api/auth/logout`,
and has a light/dark switcher (saved in `localStorage`, defaults to the OS preference).
Icons are Font Awesome Free.

## Setup

```bash
yarn install
yarn dev        # http://localhost:3000
```

The API base URL defaults to `http://localhost:8000/api`; override it with:

```bash
NUXT_PUBLIC_API_BASE=https://api.example.com/api yarn dev
```

Auth uses the Symfony session cookie, so the API's `CORS_ALLOW_ORIGIN` must match this app's origin.

## Production

```bash
yarn build
node .output/server/index.mjs
```
