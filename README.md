# 🍲 Recipe Book

A community cookbook built with **React + Vite** and **Supabase** (Postgres, Auth, Row Level Security).
Guests can browse recipes; registered users can publish, edit and delete their own recipes, like other recipes and comment on them.

- **Live app (frontend):** _paste your deployed frontend URL here_
- **Backend:** Supabase (hosted – database and Auth are already live, no separate server to deploy)
- **GitHub:** _paste your repository URL here_

## Installation & Running Locally

```bash
# 1. Install packages
npm install

# 2. Create your env file and fill in the values from Supabase → Project Settings → API
cp .env.example .env

# 3. Start the dev server
npm run dev        # http://localhost:5173

# Production build
npm run build
npm run preview
```

### Supabase setup (one time)

1. Create a project at <https://supabase.com>.
2. Open **SQL Editor** and run the file `supabase/migrations/001_init.sql` (creates the `recipes`, `likes` and `comments` tables and all RLS policies).
3. **Authentication → Providers → Email:** for easiest testing, turn **off** "Confirm email" (otherwise new users must confirm via email before they can log in).
4. Put the project URL and the publishable/anon key in `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).

### Deployment

Deploy the frontend on Vercel or Netlify (build command `npm run build`, output `dist`) and add the same two environment variables in the host's settings. `vercel.json` and `public/_redirects` already contain the SPA fallback rules so deep links like `/recipes/<id>` work.

## Project Structure

```
src/
├── api/           # all Supabase calls (recipes, likes, comments)
├── components/    # Layout, Header, PrivateRoute, GuestRoute, RecipeCard, RecipeForm, Comments, Spinner, ErrorMessage
├── context/       # AuthContext (session + login/register/logout)
├── hooks/         # useFetch (loading/error/cleanup), useForm (controlled forms + validation)
├── lib/           # supabase client, validators
├── pages/         # Home, About, Catalog, RecipeDetails, CreateRecipe, EditRecipe, MyRecipes, Login, Register, NotFound
└── styles/        # global.css, layout.css
supabase/migrations/001_init.sql   # database schema + security policies
```

---

# Functional Guide

## 1. Project Overview

**Application Name:** Recipe Book

**Application Category / Topic:** Recipe sharing / community cookbook

**Main Purpose:** Recipe Book lets people discover recipes and share their own. Anyone can browse the catalog and read recipe details; registered users can publish recipes, edit or delete the ones they authored, like recipes and discuss them in comments. It solves the problem of keeping and sharing favourite recipes in one searchable place.

## 2. User Access & Permissions

**Guest (Not Authenticated)**

- Available pages / routes: `/` (Home), `/about`, `/recipes` (Catalog), `/recipes/:recipeId` (Details), `/login`, `/register`
- Public data shown: all recipes, like counts, comment counts and all comments (read-only)

**Authenticated User**

- Main sections / pages: Catalog, `My recipes` (`/my-recipes`), `Add recipe` (`/recipes/create`)
- Details pages: same details page as guests, plus Like button, comment form, and Edit / Delete buttons on own recipes
- Create / Edit / Delete actions: create recipes and comments; edit / delete **only their own** recipes; delete their own comments; like / unlike any recipe

## 3. Authentication & Session Handling

**Authentication Flow**

- On load, `AuthProvider` calls `supabase.auth.getSession()`; until it resolves `loading` is `true` and guarded routes show a spinner.
- Authentication status is exposed through `useAuth()` (`user`, `isAuthenticated`, `username`, `loading`).
- On successful register / login the user is stored in context (via `onAuthStateChange`) and redirected to the catalog (or to the private page they originally tried to open).
- On logout `supabase.auth.signOut()` is called, the context user becomes `null` and the user is sent to the home page.

**Session Persistence**

- The session is stored by Supabase Auth in `localStorage` and mirrored in React Context.
- After a page refresh `getSession()` restores the session automatically, so the user stays logged in.

## 4. Routing Structure

**Route Guards Logic**

- `GuestRoute` wraps `/login` and `/register` – logged-in users are redirected to `/recipes`.
- `PrivateRoute` wraps `/recipes/create`, `/recipes/:recipeId/edit` and `/my-recipes` – guests are redirected to `/login`.
- Owner guard: `EditRecipe` redirects to the details page when the logged-in user is not the recipe's author (the database RLS policies enforce the same rule server-side).

**Main Routes**

- 10 routes in total: Home, About, Catalog, Details, Create, Edit, My recipes, Login, Register, and a 404 catch-all.
- Dynamic (data-driven) pages: Catalog, Details, Create/Edit, My recipes.

**Nested & Parameterized Routes**

- A layout route (`Layout` with `<Outlet />`) nests all pages under shared header/footer; guard routes are nested layout routes too.
- URL parameters: `/recipes/:recipeId` and `/recipes/:recipeId/edit`.

## 5. List → Details Flow

**Catalog / List Page**

- Displays recipe cards: image, category, title, cooking time, author, likes and comments counts.
- Interaction: search by title, filter by category, sort by newest / most liked / quickest.

**Details Page**

- Navigation is triggered with `<Link to={`/recipes/${id}`}>` on each card.
- `useParams()` provides `recipeId`, which is used to fetch the recipe, its likes and its comments.

## 6. Data Source & Backend

**Backend Type**

- Real backend: **Supabase** (hosted Postgres + Auth + Row Level Security) accessed with `@supabase/supabase-js`. Data persists between visits; no hardcoded data.

## 7. Data Operations (CRUD)

Collection: **recipes** (separate from users), with related **likes** and **comments** collections.

**Create (POST)** – The "Add recipe" form (`/recipes/create`) validates input and inserts a row into `recipes`; the user is then redirected to the new recipe's details page.

**Read (GET)** – `getRecipes()` populates Home and Catalog, `getMyRecipes()` populates My recipes, `getRecipe()` + `getLikes()` + `getComments()` populate Details.

**Update (PUT/PATCH)** – The author opens "Edit" (pre-filled form), changes fields and saves; the row is updated and the user is redirected to the details page, which re-fetches fresh data.

**Delete** – The author clicks "Delete" on the details page and confirms; the row is deleted and the user is redirected to the catalog (which re-fetches). Comments can be deleted by their authors and disappear from the list immediately.

## 8. Forms & Validation

**Forms Used:** Login, Register, Create recipe, Edit recipe, Add comment. All inputs are controlled (bound to state) and use React synthetic events (`onChange`, `onSubmit`).

**Validation Rules**

- `title`: required, 3–80 characters.
- `cook_time`: required, whole number between 1 and 1440.
- `password` (register): at least 6 characters, and `confirm` must match; `email`: must match an email pattern; `username`: 3–20 characters.
- `image_url`: optional, but must be a valid http(s) URL; `ingredients` ≥ 10 chars, `instructions` ≥ 20 chars; `comment` 2–500 chars.

## 9. React-Specific Techniques

**Hooks & Component Lifecycle**

- `useState`, `useEffect`, `useMemo`, `useCallback`, `useContext`, `useParams`, `useNavigate`, `useLocation`, plus custom hooks `useFetch` and `useForm`.
- Mount / update / unmount example: `useFetch` fetches on mount, re-fetches when `recipeId` changes (update), and its cleanup function sets an `active` flag to `false` on unmount so no state is set on an unmounted component. `AuthProvider` also unsubscribes its auth listener on unmount.

**Context API** – `AuthContext` shares the current user, `isAuthenticated`, `username`, `loading` and `login` / `register` / `logout`; it is consumed by Header, route guards, RecipeDetails, Comments, Create/Edit/My recipes and the auth pages.

**Component Styling** – Plain external CSS files (`styles/global.css` for tokens, base elements, buttons and forms; `styles/layout.css` for layout, cards and details page).

## 10. Typical User Flow

1. A visitor opens the app, browses the catalog and opens a recipe's details page.
2. They register (or log in) and are redirected to the catalog.
3. They click "Add recipe", fill in the form and publish it.
4. They open another recipe, like it and leave a comment.
5. From "My recipes" they open their own recipe, edit it, or delete it.

## 11. Error & Edge Case Handling

- **Authentication errors:** wrong credentials, already-registered email, etc. are shown as an error message above the form; field-level validation errors appear under each input.
- **Network or data errors:** every data page shows a loading spinner and an error banner with a "Try again" button; failed like / comment / delete actions show an error message and the UI stays consistent.
- **Empty or missing data states:** "No recipes found", "No comments yet", "You haven't added any recipes yet", a 404 page for unknown routes, and a friendly message when a recipe id doesn't exist. Broken image URLs fall back to a placeholder.
