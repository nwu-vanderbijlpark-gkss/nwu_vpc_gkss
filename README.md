# GKSS Portal

<img src="https://nwu-vaal-gkss.netlify.app/icon.png" style="width: 100px;height: 100px;"/>\
Welcome to the GKSS portal repository. This is a modern, full-stack SvelteKit web application styled with Tailwind CSS and DaisyUI. Supabase handles backend services including authentication, database, and storage.

This project is maintained under the [MIT License](#license) and will be made public to encourage collaboration. Contributions are welcome, all code changes are reviewed before being merged.

---

## Tech Stack

- [SvelteKit](https://kit.svelte.dev) - Full-stack Framework
- [Tailwind CSS](https://tailwindcss.com) - Utility-first Styling
- [DaisyUI(v4)](https://v4.daisyui.com) - Prebuilt CSS UI Components
- [Supabase](https://supabase.com) - Backend-as-a-Service (PostgreSQL, Auth, Realtime, Storage)
- [Docker](https://www.docker.com) - Local containerized development
- [Brevo](https://www.brevo.com) - Used for emails: Free plan(300 daily emails)
- [GroqCloud](https://console.groq.com/) - AI models

---

## How Chapters Can Self-Host (On Netlify)

Each GKSS chapter can **deploy and manage their own portal instance** with Netlify.  
This ensures that **chapters fully own their data, branding, and customizations** .

> Why Netlify?
>
> - Simple one-click deployment.
> - Automatic HTTPS and CI/CD from your repo.
> - Includes a special **Netlify Function** that pings Supabase every day to **keep your supabase project awake** since supabase free plan sleeps after a week on inactivity.

You can host it anywhere else, as long as you will be able to keep your supabase project awake, and also change the svelte-adapter

### Setup Steps

1. Fork this repo and clone it locally.
2. Create netlify, supabase, brevo and groqcloud accounts
3. Copy `env.example` to `.env` and replace the placeholders with your keys:
   ```env
    PUBLIC_SUPABASE_URL='https://<project_id>.supabase.co'
    PUBLIC_SUPABASE_ANON_KEY='<your_anon_key>'
    GROQ_API_KEY='<your_groq_api_key>'
    BREVO_API_KEY='<your_brevo_api_key>'
    CRYPTO_KEY='<your_crypto_key>'
   ```
4. Set the environment variables in Netlify > _Site Settings > Environment Variables_:
5. Go to netlify and deploy your portal or click the button below: <br/>
   [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/nwu-vanderbijlpark-gkss/gkss_portal)
6. Connect your github
7. Click **Deploy Site**.
8. Your portal will be live in minutes, now you have to customize everything.🎉

### Supabase setup

1. Login to your supabase account and head over to your project
2. Go to Storage and create a public bucket named `files`
3. Go to Policies then click "New Policy" on the `files` bucket
4. Name your Policy anything.
5. Check every operation, then click "Review", then "Save Policy" - this was to allow any user to apply crud operations on the bucket, you can modify later.
6. For database schema, go to ["/supabase/schema.sql"](/supabase/schema.sql), then copy the sql, and run it in supabase SQL editor
7. Everything is set now, but you need an admin, all leaders of your chapter are admins in the portal.

---

### Admin User setup

1. Create an account on the portal
2. After completing that, go to your supabase database, in `team` table, Click "Insert"
3. Click "Insert row", skip `id` and `created_at`
4. Add your role(Chairperson/Secretary...) in `role` and current year in `year`
5. Link your member account to the `member_id` by clicking the pencil button, then clicking "select record", and select your member record
6. Return to the portal and refresh the page, you should see a new button `Admin` will appear
7. You can now add other leaders to the portal. A video will be made available.

---

### Customizing Your Portal

- Update **chapter name, logo, and theme colors(would advise not to)** in `src/lib/config.ts`.
- Note that the email in `src/lib/config.ts` must match the one registered with brevo
- Update the `manifest.json`, change the chapter name.
- Add or edit content pages in `src/routes/`.
- Customize styles with Tailwind/DaisyUI in `app.css`.
- Update `.github/workflows/keep-alive.yml` and `netlify/functions/keep-alive.js`, change the url to the url your new hosted portal.
- ***

### Support

If your chapter needs help deploying or customizing:

- Open an Issue in this repository.
- Or contact the maintainers directly.

---

# Development Guide

## Project Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [Docker Desktop](https://docs.docker.com/desktop)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- A code editor (e.g., [VS Code](https://code.visualstudio.com/))
- If using VS Code, install svelte extensions.

### 1. Clone the Repository

```bash
git clone https://github.com/nwu-vanderbijlpark-gkss/gkss_portal.git
cd gkss_portal
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start SvelteKit (Frontend)

```bash
npm run dev
```

App will be available at: [http://localhost:5173](http://localhost:5173)

---

If you visit [http://localhost:5173](http://localhost:5173), the app will probably show a 404 or 500 page,
This happens because the backend is not running, so to run the backend, read the instructions below

## 🗃️ Backend: Supabase (Local)

We use Supabase in Docker to provide a self-contained local development backend, so make sure docker is running on your machine.

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Start Local Supabase

```bash
npx supabase start
```

This starts:

- Supabase Auth
- PostgreSQL
- Storage
- Studio (web dashboard)

Default ports:

- Supabase API: `http://localhost:54321`
- Studio: `http://localhost:54323`

### 3. Setup `.env.local`

Create a `.env.local` in the project root then copy and paste:

```env
PUBLIC_SUPABASE_URL='http://localhost:54321'
PUBLIC_SUPABASE_ANON_KEY='your-local-anon-key'
```

> - Anon keys are printed in the terminal when you run `npx supabase start`.
> - Replace `your-local-anon-key` with the value of the anon key printed in your terminal
> - Once all that is done, the app will be running smoothly.

### 4. Supabase Client

The Supabase client is already configured inside the project. No need to create a new client — simply import it where needed.

---

## 📁 Project Structure

```
src/
├── routes/                 # Page routes
│   ├── +page.svelte        # Home page
│   ├── +layout.svelte      # Layout template for all pages under a pathname
│   ├── +page.server.js     # This page runs on the server, see svelteKit docs
│   └── team/+page.svelte   # Team page
├── components/             # Reusable UI components
│   ├── Header.svelte
│   ├── Footer.svelte
│   └── Card.svelte
├── api/ 		    # All api routes
|   ├── cities/	    	    # An example cities api route
|       ├── server.js       # The required file for the api logic, see sveltekit api docs
├── lib/                    # Supabase clients and utilities
├── static/ 		    # Public assets
├── app.html                # Entry HTML template
├── app.css                 # Global CSS (Tailwind config)
```

---

## ✍️ How to Contribute

### Content Changes

Edit the appropriate `.svelte` file inside `src/routes/`.

- Home: `src/routes/+page.svelte`
- About: `src/routes/about/+page.svelte`

### Add a New Page

1. Create a folder in `src/routes/` (e.g. `events`)
2. Add a `+page.svelte` file with your content.

---

## 📦 Common Commands

| Command              | Description                      |
| -------------------- | -------------------------------- |
| `npm run dev`        | Start frontend dev server        |
| `npm run build`      | Build frontend for production    |
| `npm run preview`    | Preview production build         |
| `npx supabase start` | Start Supabase in Docker locally |

---

## 🧠 Contributor Notes

- Read [how to contribute](./CONTRIBUTING.md)
- All changes must go through Pull Requests and be reviewed before merging.
- Feature branches should be prefixed with your initials or team (e.g., `ts-feature-header`)
- Use semantic commits if possible.
- Never commit `.env.local` or secret keys.

---

## 📜 License

This project is open-sourced under the MIT License.  
See [LICENSE](https://github.com/nwu-vanderbijlpark-gkss/gkss_portal/tree/main#MIT-1-ov-file) for full terms.

---

## 📚 Docs & Resources

- [SvelteKit Docs](https://kit.svelte.dev/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [DaisyUI Docs](https://daisyui.com/docs)
- [Supabase Docs](https://supabase.com/docs)

---

## 🤝 Maintainers

This repository is actively maintained. Code reviews are strict to ensure project health, scalability, and security. If you'd like to become a project lead, speak with a current maintainer.

---
