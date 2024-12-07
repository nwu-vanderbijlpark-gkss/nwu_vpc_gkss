# GKSS Website

Welcome to the GKSS Website project! This repository contains the source code for the GKSS website built using [SvelteKit](https://kit.svelte.dev/), [Tailwind CSS](https://tailwindcss.com/), and [DaisyUI](https://daisyui.com/). This document will guide you on how to navigate the project and make updates or changes, even if you are new to Svelte.

## Project Setup

### Prerequisites

To work on this project, you'll need:

- [Node.js](https://nodejs.org/) (version 16 or later recommended)
- A code editor (e.g., [VS Code](https://code.visualstudio.com/))
- Basic understanding of HTML and JavaScript

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/gkss-website.git
   cd gkss-website
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the project in your browser at [http://localhost:5173](http://localhost:5173).

---

## Project Structure

Here is a simplified overview of the project structure:

```
src/
├── routes/
│   ├── +page.svelte      # Homepage
│   ├── +layout.svelte    # Layout page with shared UI, Header, etc.
│   ├── about/
│   │   └── +page.svelte  # About page
│   └── contact/
│       └── +page.svelte  # Contact page
├── components/
│   ├── Header.svelte     # Navigation bar
│   ├── Footer.svelte     # Footer section
│   └── Card.svelte       # Reusable card component for content
├── app.html              # HTML template for the app
└── app.css        # Global styles (Tailwind CSS and custom styles)
```

---

## How to Make Changes

### 1. **Update Content on a Page**

To edit the content of a specific page, locate the corresponding file in the `src/routes/` folder.  
For example:

- To edit the homepage, open `src/routes/+page.svelte`.
- For the About page, edit `src/routes/about/+page.svelte`.

Inside these files, you'll see HTML-like code. Simply edit the text inside the tags.

Example:

```html
<h1>Welcome to GKSS</h1>
<p>Here is some introductory text.</p>
```

### 2. **Add a New Page**

1. Create a new folder under `src/routes/` (e.g., `new-page`).
2. Create a `+page.svelte` file inside the new folder and add your content.
3. To link to the new page, update the navigation in `src/components/Header.svelte`.

### 3. **Edit the Navigation Bar**

To add or remove links from the navigation bar, edit `src/components/Header.svelte`.  
Look for the `<nav>` section and update the links.

Example:

```html
<nav class="flex space-x-4">
	<a href="/" class="text-xl">Home</a>
	<a href="/about" class="text-xl">About</a>
	<a href="/events" class="text-xl">Events</a>
	<a href="/contact" class="text-xl">Contact</a>
</nav>
```

This code uses Tailwind CSS classes for styling, such as `text-xl` for large text and `space-x-4` to add spacing between links.

### 4. **Change the Layout**

The layout for all pages is controlled by `src/routes/+layout.svelte`.

- To change the header or footer across all pages, edit this file.
- For CSS styles, use `src/app.css`.

You can also add Tailwind utility classes here or in specific components.

### 5. **Update Global Styles**

Global styles are located in `src/app.css`. You can modify this file to change the website's overall appearance.

Tailwind CSS is used for utility-first styling, and DaisyUI provides pre-built components. Feel free to mix and match Tailwind utilities and DaisyUI components for a consistent design.

Example:

```css
/* app.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
	font-family: 'Arial', sans-serif;
}
```

---

## Common Commands

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the development server         |
| `npm run build`   | Build the project for production     |
| `npm run preview` | Preview the production build locally |

---

## Need Help?

If you encounter any issues or need assistance, feel free to reach out to the project maintainers or check out the [SvelteKit Documentation](https://kit.svelte.dev/docs), [Tailwind CSS Documentation](https://tailwindcss.com/docs), and [DaisyUI Documentation](https://daisyui.com/docs/).

Happy coding! 🚀
