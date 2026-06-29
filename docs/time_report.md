# Time report

| Date       | Hours | Tasks |
| ---------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 24.9.2025  | 6     | - Initiated the project<br>- Docker development setup<br>- Create separate API client module|
| 1.10.2025  | 5     | - Production setup with Docker Compose<br>- Add API to fetch weather data<br>- Create hook to get user's location<br>- Frontend func to display weather data|
| 2.10.2025  | 5     | - Improve logging and error handling<br>- Use middleware for error handling<br>- Automate setting up dev environment<br>- Create pre-commit hook<br>- Fix async operations in useWeather hook|
| 3.10.2025  | 4     | - Stricter ESLint rules + fix errors<br>- Install testing tools and add tests<br>- Fix error handler and improve logging queries|
| 8.10.2025  | 4     | - Add art service and controller (route for art resource, controller, service to fetch art with keywords)<br>- Add stricter ESLint rules (eol-last, no-trailing-spaces, no-multiple-empty-lines)|
| 17.11.2025 | 3     | - genAI backend functionality finished<br>- Redux initialization|
| 18.11.2025 | 5     | - Redux and weather component update<br>- Created keyword slice and useKeywords hook<br>- Use real weather data in genAI service|
| 20.11.2025 | 4     | - Fix URL in artworkService<br>- Artwork reducer<br>- Artwork hook<br>- colorService<br>- ColorController|
| 25.11.2025 | 4     | - Color slice<br>- Color manager to change colors at runtime|
| 27.11.2025 | 2     | - Refactored slices (migrate to RTK Query, refactor color, artwork and keyword services)|
| 29.12.2025 | 5     | - Designed and implemented masonry layout for feed items<br>- Started book-related backend implementation|
| 30.12.2025 | 8     | - Created image proxy to proxy images through backend<br>- Added caching for backend services<br>- Finished book service backend implementation<br>- Started designing book display in frontend|
| 31.12.2025 | 6     | - Image proxying as own controller and route<br>- Backend book-related changes for multiple keyword support<br>- Frontend work for book display<br>- Started implementing recipe fetching|
| 2.1.2026   | 7     | - Finished recipe-related backend functionality<br>- Created related frontend functionality and component<br>- Setup Prisma and Postgres<br>- Improve development documentation<br>- Update setup and start scripts<br>- Start implementing user authentication|
| 7.1.2026   | 3     | - Debugged issue with Prisma|
| 8.1.2026   | 8     | - Registration initial setup<br>- Backend architecture changes (move to DDD)<br>- Improvements and fixes for neglected tests|
| 9.1.2026   | 9     | - Implemented validations with Zod<br>- Updated tests<br>- Implemented login, access token control, logout|
| 12.1.2026  | 7     | - More testing and polishing authentication<br>- Create new layout with sidebar for home page<br>- Refactor frontend components|
| 13.1.2026  | 2     | - Designing and exploring frontend design|
| 14.1.2026  | 4     | - Implemented frontend registration<br>- Eslint update|
| 21.2.2026  | 9  | - Debug & fallback for Gemini API<br>- Improved/implemented user authentication in frontend<br>- Created shared register/login component<br>- Added login page<br>- Investigated minimatch vulnerability (eslint)<br>- Home page redesign, started top bar, components|
| 22.2.2026  | 7     | - Finished home page changes<br>- Updated color palette and manager<br>- Improved artwork item cards<br>- Designed & implemented collage cards (book, artwork, recipe selection)<br>&nbsp; - Backend: data types for DB and API, card creation<br>&nbsp; - Fixed user id type in JwtPayload|
| 3.3.2026   | 4     | - Card frontend functionality: cardService, favoriteSelectionSlice, designing selection process<br>- Added and discarded select favorites button<br>- Other UI tweaks|
| 4.3.2026   | 2     | - Improved ImageProxy error handling<br>- Created reusable FeedCard component<br>- Finished frontend card services<br>- Started card creation UI elements|
| 5.3.2026   | 3     | - Bug fixes<br>- Handlers to add liked item to selection<br>- Frontend card services refinements<br>- Created selection component for displayed items|
| 23.3.2026  | 4     | - Set up project on another computer: updated dev guide<br>- Home page feed mode can be set via URL<br>- Started handler to create card from frontend, error handling<br>- Improved authentication for user info refresh|
| 11.4.2026  | 7     | - Finished card creation handler<br>- Improved Zod schema/validation<br>- Created notification modal for login requirement<br>- Register/login FE design improvements<br>- Misc bug fixes and tweaks<br>- Started profile page and postcard backend|
| 16.4.2026  | 4     | - Finished backend: fetch user and postcards (with permissions), create postcards with meta data<br>- Started UI for profile/postcard page|
| 10.5.2026  | 6     | - Created profile page<br>- Created postcard UI<br>- Small fixes<br>- Spotify integration for registered users:<br>&nbsp; - Connect account<br>&nbsp; - Show/store music with postcard|
| 15.5.2026  | 3     | - Created Spotify OAuth auth flow (backend)|
| 30.5.2026  | 4     | - Music cue component and FE functionality<br>- FE component and functionality for Spotify connect<br>- Custom color usage updates|
| 31.5.2026  | 5     | - Initial implementation for Spotify recommendations<br>- Spotify query generation<br>- Improved auth flows<br>- Schema for validating music cue body<br>- Guardrail failing requests & dedup<br>- Added ranking for Spotify results|
| 6.6.2026   | 3     | - Created UI for artist/playlist/track cards<br>- Final touches & committed next day after BE improvements|
| 7.6.2026   | 5     | - Spotify result ranking util<br>- Small Spotify service changes (logging, result count)<br>- Improved Spotify query in genAI service|
| 8.6.2026   | 4     | - BE/FE to add music item to card|
| 9.6.2026   | 4     | - BE/FE for card visibility change<br>- Created settings UI<br>- Remove button for cards|
| 13.6.2026  | 2     | - BE for removing cards and user<br>- Connect remove button<br>- Settings refactor|
| 23.6.2026  | 5     | - Completed user removal in profile settings<br>- Postcard refactor<br>- BE: get all public cards<br>- FE: display public cards in community tab, add creator info<br>- Store colors to local storage<br>- Loading screen for APIs<br>- Enhanced logging<br>- Misc fixes|
| 26.6.2026  | 5     | - Deployment and production fixes|
| 29.6.2026  | 4    | - Adaptations to mobile screens<br>- Documentation<br>- Fixes to making book and recipe optional|
| **Total**  | **191** ||
