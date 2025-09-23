# Contributing to the GKSS Website

<img src="https://nwu-vaal-gkss.netlify.app/icon.png" style="width: 100px;height: 100px;"/>

We are excited to have you contribute to the GKSS Website! Whether you're fixing bugs, adding features, or improving documentation, we appreciate your efforts to help make this project better.

This document provides guidelines to help you get started with contributing. Please follow these steps to ensure consistency and clarity in your contributions.

---

## Table of Contents

- [How to Get Started](#how-to-get-started)
- [Issues](#issues)
- [Pull Requests](#pull-requests)
- [Code Style](#code-style)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Branching Strategy](#branching-strategy)
- [Getting Help](#getting-help)

---

## How to Get Started

1. **Fork the repository:**  
   Start by forking the project on GitHub so you can work on your own copy.

2. **Clone your fork locally:**  
   Clone the forked repository to your local machine:

   ```bash
   git clone https://github.com/nwu-vanderbijlpark-gkss/gkss_portal.git
   cd gkss-website
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Start the local development server:**  
   To start working on the frontend:

   ```bash
   npm run dev
   ```

   Your local server will run at [http://localhost:5173](http://localhost:5173).

5. **Set up the backend (Supabase) locally:**  
   The app will not run without the backend, so you will need to start the Supabase local instance using the Supabase CLI:

   ```bash
   npx supabase start
   ```

   Make sure to configure the `.env.local` file as per the local development instructions in the [README](./README.md).

---

## Issues

Before starting a new feature or bug fix, check the [Issues](https://github.com/nwu-vanderbijlpark-gkss/gkss_portal/issues) tab to see if the problem has already been reported or if a feature request already exists. If you find an existing issue, feel free to add comments or contribute directly to the discussion.

To submit a new issue:

1. Go to the [Issues page](https://github.com/nwu-vanderbijlpark-gkss/gkss_portal/issues).
2. Click "New Issue."
3. Provide a descriptive title and fill out the issue template, including any necessary context, screenshots, or error logs.

---

## Pull Requests

When you're ready to submit your changes, follow these steps:

1. **Create a new branch** from `main`:

   ```bash
   git checkout main
   git pull origin main
   git checkout -b your-feature-branch
   ```

2. **Make your changes** to the code.

3. **Test your changes locally.** Run both the frontend and the local Supabase instance to make sure everything works as expected.

4. **Commit your changes.** Follow the [Commit Message Guidelines](#commit-message-guidelines) for writing meaningful and clear commit messages.

5. **Push your changes to your fork:**

   ```bash
   git push origin your-feature-branch
   ```

6. **Open a Pull Request (PR):**
   - Go to the [Pull Requests](https://github.com/nwu-vanderbijlpark-gkss/gkss_portal/pulls) tab.
   - Click "New Pull Request" and select your feature branch.
   - Fill out the PR template with context about the changes you made.

---

## Code Style

We follow some basic coding guidelines to ensure consistency across the project:

- **Svelte:** Use the [Svelte style guide](https://svelte.dev/docs) for component formatting and structure.
- **Tailwind CSS:** Follow the [Tailwind CSS best practices](https://tailwindcss.com/docs).
- **DaisyUI**: Check out the v4 [Daisyui docs for components](https://v4.daisyui.com/)
- **JavaScript:** Use modern ES6 syntax (e.g., `const`, `let`, arrow functions) and avoid `var`.

If you aren't sure about the formatting, feel free to use [Prettier](https://prettier.io/) for automatic code formatting. This project includes a `.prettierrc` config to maintain consistency.

---

## Commit Message Guidelines

We use the following guidelines for writing commit messages:

### Format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring (no feature changes)
- `test`: Adding or modifying tests

### Example:

```bash
feat(auth): add login functionality

Implemented login API endpoint and integrated with frontend forms.
```

---

## Branching Strategy

We follow a **feature-branch workflow**:

- **`main`**: This is the stable production-ready branch.
- **`feature/<name>`**: All new features should be developed in separate branches based on `main`.

For example:

```bash
git checkout -b feature/add-login
```

After your feature is complete and reviewed, it will be merged into `main`.

---

## Getting Help

If you need help, feel free to reach out to the maintainers or check the following resources:

- [SvelteKit Docs](https://kit.svelte.dev/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Daisyui](https://v4.daisyui.com/)

You can also open an issue or ask for clarification via discussions or direct messages.

---

Thank you for contributing to the GKSS Website! Your input helps improve the project and benefit everyone in the community.

---
