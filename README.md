# Kliment Ho - Portfolio Website (khfolio)

This repository contains the source code for Kliment Ho's personal portfolio website.

The website is designed with a modern, sleek aesthetic, showcasing projects, professional experience, and skills. It dynamically fetches and displays GitHub repositories from multiple specified accounts and features a prominent rotating banner for curated projects.

## Current Goal (Phase 2 - Modernization & GitHub Integration)

1.  **Update Site Aesthetic**: Transition to a sleek, modern dark theme.
2.  **Featured Curated Projects Banner**: Transform the curated projects display into a large, full-width rotating banner panel on the homepage, automatically cycling every 3 seconds.
3.  **Featured GitHub Projects Panel (Sidebar)**: Implement a smaller rotating panel in the sidebar showcasing the most recent Git projects from all configured accounts.
4.  **Decorate and Modernize**: Enhance the site with modern effects, colors, and typography.
5.  **Integrate All GitHub Repositories**: Dynamically fetch and display all public GitHub repositories from **multiple specified user accounts** in a grid format.

## Progress

### Iteration 1: Core Structure, Data, and Styling Foundation (Steam-Inspired)
-   **Status**: Completed.
-   **Details**: Initial setup with dynamic project display from `projects.js`, resume page, project detail page, and Steam-like styling.

### Iteration 2: Modern Aesthetic, GitHub Integration, New Featured Rotators
-   **Objective**: Implement a new sleek design, a large rotating banner for curated projects, a sidebar rotator for recent GitHub activity, and a grid for all GitHub repos (from multiple accounts).
-   **Status**: In Progress

### Key Tasks for Iteration 2:
-   [X] Define a new modern dark color palette (GitHub-inspired) in `css/style.css`.
-   [X] Update global CSS styles to use the new palette.
-   [X] Add HTML structure for the "Recent GitHub Activity" rotating panel in the sidebar in `index.html`.
-   [X] Add HTML structure for the "All GitHub Repositories" section in `index.html`.
-   [X] Implement CSS for the sidebar rotator and the overall sleek design, including effects.
-   [X] Add HTML structure for the large "Featured Curated Projects" rotating banner in `index.html`.
-   [X] Implement CSS for this new large banner rotator, including slide styling, text overlays, and navigation dots.
-   [X] Add JavaScript logic in `js/script.js` to:
    -   [X] Populate the "Featured Curated Projects" banner using `projects.js` data.
    -   [X] Implement automatic rotation (every 3 seconds) and navigation (dots) for this banner.
    -   [ ] **UPDATE**: Fetch all public repositories from **multiple specified GitHub user accounts** (e.g., "DevKlim", "klh005").
    -   [ ] **UPDATE**: Combine, de-duplicate, and sort fetched repositories.
    -   [X] Populate the "All GitHub Repositories" section with the combined list.
    -   [X] Select recent repositories from the combined list to populate the "Recent GitHub Activity" rotating panel in the sidebar.
    -   [X] Implement the rotation/slideshow functionality for the sidebar panel.
-   [ ] Ensure responsiveness of new elements.
-   [X] Update `README.md` (this file) with new goals and progress.

### Next Steps / To-Do (Post-Iteration 2 Implementation):
-   **Asset Population**:
    -   Ensure all project images (curated `mainImageUrl` for the banner, thumbnails for GitHub repos if a convention is adopted) are high quality and correctly sized.
    -   Verify the hero video (`assets/videos/hero-background-steam.mp4`) still fits the new aesthetic or replace it.
-   **Content Review**: Ensure all text content is accurate and well-presented with the new design.
-   **Thorough Testing**: Test across various devices and browsers. Fix any responsiveness or display issues.
-   **Advanced Effects**: Consider adding more subtle animations or micro-interactions.

---
*This README will be updated as development progresses.*