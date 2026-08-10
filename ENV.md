# Website env (Vercel)

## Required

```env
NEXT_PUBLIC_API_URL=https://YOUR-REAL-RENDER-URL.onrender.com/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-real-key
```

## Do NOT use placeholders

These will break DNS / build / runtime:

- `https://your-api-host/api`
- `https://YOUR-API.onrender.com/api` (literal text)

Use the **exact** Render service URL after it is live, e.g.:

```env
NEXT_PUBLIC_API_URL=https://growra-realty-server.onrender.com/api
```

Must end with `/api` (not the bare Render host). Wrong values cause `Properties API 404` at build.

## CORS on the API

On Render, set:

```env
CORS_ORIGINS=https://your-app.vercel.app
PUBLIC_BASE_URL=https://growra-realty-server.onrender.com
DATABASE_URL=postgresql://...   # required — health shows database:"down" without it
```
