# Wobb Influencer Search — Take-Home Assignment

Live demo: https://wobb-influencer-search-two.vercel.app/

## What I Changed

### Bug Fixes
- Fixed engagement rate calculation in the profile detail page — it was multiplying by 10000 instead of 100, showing wildly incorrect percentages.
- Fixed the "Engagements" stat box, which was displaying the engagement rate percentage instead of the actual engagement count.
- Fixed username search to be case-insensitive (it previously only worked for full names, not usernames).
- Removed a hardcoded `width: 700px` on profile cards that broke the layout on mobile screens.
- Removed an unused `data-search` attribute and the `searchQuery` prop that was being passed through three component layers for no functional reason.
- Removed a `clickCount` state variable in the search page that served no purpose beyond a console log, and was causing unnecessary re-renders.
- Added missing `alt` attributes on profile images for accessibility.
- Removed `react-beautiful-dnd` from dependencies — it was installed but never used anywhere in the code, and doesn't support React 19.
- Consolidated three separate, duplicate implementations of follower-count formatting (in `ProfileDetailPage.tsx`, `ProfileCard.tsx`, and `formatters.ts`) into a single shared function.

### State Management
The starter project did not contain any React Context implementation (no `createContext`, `useContext`, or `Provider` anywhere in the codebase), despite the brief asking to "replace Context with Zustand." I added Zustand directly as the state management solution for the new shortlist feature, since there was nothing existing to replace.

The store (`src/store/useListStore.ts`) holds the list of shortlisted profiles and uses Zustand's `persist` middleware to save the list to `localStorage`, so it survives a page refresh.

### Shortlist Feature ("Add to List")
- Profiles can be added to a shortlist from both the search results and the profile detail page.
- Duplicate entries are prevented by checking `user_id` before adding.
- A dedicated `/shortlist` page displays all selected profiles with the ability to remove any of them.
- The shortlist count is shown live in the navigation bar from anywhere in the app.
- The list persists across page refreshes via `localStorage`.

### UI/UX Redesign
Rebuilt the interface with a deliberate design system rather than default Tailwind styling:
- Color palette: a dark navigation bar, warm off-white background, teal as the single accent color, and amber reserved specifically for "already shortlisted" states.
- Typography: Space Grotesk for names/headings, Inter for body text, IBM Plex Mono for all numeric data (followers, engagement rate, etc.) to give the data a clear, scannable, dashboard-like feel.
- Switched from a single-column stacked list to a responsive card grid (1 column mobile, 2 tablet, 3 desktop).
- Added a signature "signal bar" — a small filled bar next to each engagement rate that visually communicates relative strength at a glance, used consistently across the search cards, profile detail page, and shortlist page.
- Added keyboard accessibility to profile cards (`tabIndex`, `role="button"`, Enter/Space key handling, visible focus ring) — the cards were originally only clickable with a mouse.
- Added a designed empty state for both "no search results" and "empty shortlist," each with guidance on what to do next.

### Performance
- Wrapped `ProfileCard` in `React.memo` to skip re-rendering cards whose props haven't changed.
- Used `useCallback` for event handlers passed down to memoized components, since a new function reference on every render would otherwise defeat the `React.memo` optimization.
- Used `useMemo` to avoid recalculating the full profile list and filtered results on every keystroke in the search box.
- Note: with the current dataset size (a few dozen profiles), these optimizations make no visible difference to the user — the app is instant either way. They're included to demonstrate the pattern and would matter at a larger data scale.

## Libraries Added
- **zustand** — lightweight state management for the shortlist feature, with built-in `localStorage` persistence via its `persist` middleware. Chosen over Redux/Context for its minimal boilerplate.

No other libraries were added. I considered adding a UI component library but decided the existing Tailwind setup was sufficient for the scope of this app and kept the bundle smaller.

## Assumptions Made
- The brief mentioned replacing React Context with Zustand, but no Context implementation existed in the starter code. I treated this as introducing Zustand as the state solution from scratch.
- Some usernames that appear in the search results (e.g. `therock`) do not have a corresponding individual profile JSON file in `src/assets/data/profiles/`. This is a gap in the provided static dataset, not a bug in the app. The app handles this gracefully with a "Could not load profile details" message rather than crashing.

## Trade-offs
- Git commit history for this submission is not as granular as it should be — most of the implementation work happened locally before being committed, resulting in fewer, larger commits rather than many small incremental ones. In a real working environment I would commit after each logical change.
- I did not add a UI component library (e.g. shadcn/ui) or animation library — given the time available, I prioritized correctness, accessibility, and a cohesive design system over additional polish from a third-party library.
- No automated tests were added, given the time constraints of the assignment window.

## Remaining Improvements
If continuing this project, I would prioritize:
- Adding unit tests for the filtering logic (`dataHelpers.ts`) and the Zustand store actions.
- Adding loading skeletons instead of a plain "Loading..." text on the profile detail page.
- Expanding the dataset so every profile in search results has a matching detail file.
- Adding sort options (e.g. by followers, by engagement rate) to the search results.