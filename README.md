# FreshWave Detergents & Chemicals

Website, product catalogue, WhatsApp enquiry basket and admin dashboard.

Built with Next.js, TypeScript, Tailwind CSS, Framer Motion, three.js and PostgreSQL.

## Run it

1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env` and fill it in (see below).
3. Run:

```
npm install
npm run build
npm start
```

The site opens on http://localhost:3000. The admin is at `/admin`.

For development use `npm run dev`.

## Settings in `.env`

| Name | What it is |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | The public address of the site, for example `https://www.yourdomain.co.ke` |
| `DATABASE_URL` | PostgreSQL connection string. If empty, a small embedded database in `./.data` is used so you can try the site. Use real PostgreSQL when live. |
| `AUTH_SECRET` | A long random string (32+ characters). Required when live. |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | The first admin login. Created on first start if no admin exists. |
| `UPLOAD_DIR` | Folder for product photos and SDS files. Default `./uploads`. |

Tables are created on first start. If the database is empty, the full FreshWave catalogue (113 products, 18 categories) is added automatically. After that, everything is managed in the admin.

## First things to do in the admin

1. **Business details**: add the WhatsApp number (with country code, e.g. `2547...`), phone, email, opening hours and social links. Empty fields stay hidden on the site. WhatsApp buttons start working as soon as the number is saved.
2. **Products**: upload a real photo for each product. Until then a neutral "Photo pending" image is shown. Add packaging sizes and prices where you have them. No price is shown unless you enter one.
3. **Raw chemicals**: add the trade name, verified grade and the Safety Data Sheet (PDF) where you have them.
4. **Categories**: upload a photo for each category tile.

## Hosting notes

- Needs a Node.js host with a PostgreSQL database and a folder that keeps files (for uploads). A VPS, Railway or Render all work.
- On serverless hosts such as Vercel the upload folder is not kept. Use a host with a disk, or change `lib/uploads.ts` to use object storage.
- Serve the site over HTTPS. The admin login cookie is HTTPS-only in production.
- The shop map uses the exact coordinates in `lib/shared.ts` (`SHOP`). Change them there if the shop moves.
- The privacy policy and terms pages are plain starting text. Have them checked before going live.

## Design

- Font: Raleway (the font used on iGamingUbuntu), self-hosted.
- Colours: `#011C40`, `#023859`, `#26658C`, `#54ACBF`, `#A7EBF2`, from the "Luna" palette reference.
- Icons: Lucide. No emojis are used anywhere.

## Where things are

- `app/(site)` public pages. `app/admin` admin dashboard. `app/actions.ts` and `app/admin/actions.ts` server actions.
- `components/HeroScene.tsx` the 3D hero (loaded only in the browser, after the page).
- `db/schema.ts` database tables. `db/catalogue.ts` the starting catalogue.
- `lib/` database, auth, uploads and shared helpers.
