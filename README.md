# Firebase Realtime Database + Next.js SSR + Cloudflare Workers

This project uses the database structure visible in your screenshot:

- `/articles` — read by the public website
- `/pendingArticles` — never requested by this website
- `/settings` — never requested by this website

## Article fields
The renderer supports common field names: `title`/`headline`/`articleTitle`, `slug`/`urlSlug`/`permalink`, `description`/`excerpt`/`summary`, `content`/`body`/`articleContent`, `image`/`imageUrl`/`thumbnail`, `category`, `author`, `publishedAt`/`createdAt`/`date`/`timestamp`.

Each child under `/articles` can use its Firebase key as the URL slug, or provide a `slug` field. Records marked `status: draft|pending|unpublished|rejected|private`, `published: false`, or `isPublished: false` are hidden.

## Firebase security
This app performs public REST reads. For it to work, Firebase rules must allow `.read` on `/articles`. Do not make `/` public. Merge an appropriate rule into your existing rules; do not overwrite unrelated rules blindly. `/pendingArticles` and `/settings` are not accessed by this app and should remain protected.

## Local setup
Requires Node.js 20.9+.

```bash
npm install
npm run dev
```

Open http://localhost:3000. The Firebase database URL is configured in `.dev.vars` for Cloudflare local development. For plain `next dev`, create `.env.local` containing:

```env
FIREBASE_DATABASE_URL=https://artical-c2280-default-rtdb.asia-southeast1.firebasedatabase.app
```

## Cloudflare deployment
This project is configured for the OpenNext Cloudflare adapter and Workers.

```bash
npm install
npx wrangler login
npm run preview
npm run deploy
```

Follow the current official guide for account-specific setup: https://opennext.js.org/cloudflare/get-started

The site uses dynamic server rendering (`force-dynamic`) and `cache: no-store`, so the server requests the latest data on each page request. For large article collections, add pagination/query indexes rather than downloading the entire `/articles` node.

Article body is output as plain text, not raw HTML. Replace the default site name and add your production domain/metadata before launch.


## Single-page website
The entire visible website (homepage, article list, and article detail view) is rendered from `app/page.js`. Article links use `/?article=your-slug`, so you do not need a separate article page file. The page is still server-rendered by Next.js and fetches Firebase data on the server.
