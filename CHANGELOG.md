# SponsorMe – CHANGELOG

## [2025-05-04] SponsorMe App Update

### Frontend Changes
- Updated `OpportunityFeed.js` to wrap each opportunity in a `<Link>` for navigation to the detail page.
- Updated `OpportunityDetail.js` to:
  - Fetch opportunity details using `useParams()` and `GET /api/opportunities/:id`.
  - Add "Sponsor Now" functionality that sends a message and redirects to the messages page.
- Verified the route for `OpportunityDetail` exists in `App.js`.

### Backend Changes
- Updated `GET /api/opportunities/:id` to populate `sponseeId` with the full user object, including `_id` and `name`.

### Result
- Opportunities are now clickable and link to detailed views.
- Sponsors can initiate conversations using the "Sponsor Now" feature.
- Real-time messaging and role-based restrictions are functioning correctly.

---

## [May 3, 2025] – Stability + Messaging Fixes

### ✅ Messages Page
- Added safeguards to ensure both `userId` and `token` are present in `localStorage` before making API calls to `/api/messages/conversations`.
- Improved error messaging and loading state management.
- Enhanced Socket.IO integration:
  - Prevented emitting `join` events without a valid `userId`.
  - Added `console.log` statements for debugging connection status.
  - Cleanly disconnected on unmount.

### ✅ Opportunity Feed
- Made opportunity titles clickable using `<Link to={`/opportunity/:id`}>`.
- Each opportunity now navigates properly to its detailed view.

### ✅ Routing Fixes
- Verified that `<Route path="/opportunity/:id" element={<OpportunityDetail />} />` is registered in `App.js`.
- Removed or renamed duplicate detail components (`OpportunityDetail.js` vs `OpportunityDetails.tsx`) to avoid route conflicts.

### ✅ Backend Socket.IO
- Confirmed proper Socket.IO initialization:
  - Uses `http.createServer(app)` and `new Server(...)`.
  - CORS configured to allow frontend on `localhost:3000`.
  - Connection and disconnection logs added for traceability.

---

## Next Steps
- Add sponsorship payment flow (Stripe or similar)
- Allow sponsors to see past supported opportunities
- Add real-time notifications for messages and sponsorship events

## [Unreleased]

### Added
- **Frontend**:
  - `ToastContainer` component for displaying toast notifications.
  - `LogoutButton` component for handling user logout.
  - `OpportunityDetails.tsx` for detailed opportunity views.
  - `PostOpportunity.tsx` for creating new opportunities.
  - `OpportunityFeed.tsx` for listing opportunities.
  - `EditOpportunity.js` for editing existing opportunities.
  - CSS files for styling various pages and components.

- **Backend**:
  - `Sponsorship` model for tracking sponsorships.
  - `Message` model for handling real-time messaging.
  - `Opportunity` model for managing sponsorship opportunities.
  - `messageController.js` for handling message-related logic.
  - `messageRoutes.js` for message-related API routes.
  - `validateRole` middleware for role-based access control.
  - `requireAuth` middleware for authentication.

### Changed
- **Frontend**:
  - Updated `App.js` and `App.tsx` to include new routes for opportunities, dashboards, and account management.
  - Improved `Messages.js` to handle missing `userId` and `token` gracefully.
  - Enhanced `DashboardSponsor.js` and `DashboardSponsee.js` with better data fetching and error handling.
  - Updated `Navbar.js` to include a `LogoutButton`.

- **Backend**:
  - Updated `auth.js` to include Apple login support.
  - Enhanced `opportunities.js` with filtering by `sponseeId` and additional endpoints.
  - Improved `messages.js` with better error handling and dynamic message previews.
  - Added `sponsorships.js` for sponsorship-related API routes.

### Fixed
- **Frontend**:
  - Fixed 400 error on the `/messages` page by ensuring valid API calls and socket actions.
  - Resolved navigation issues in `OpportunityFeed.js` by wrapping items in `Link`.

- **Backend**:
  - Fixed Socket.IO connection issues in `server.js`.
  - Resolved issues with missing or invalid JWT tokens in `requireAuth` middleware.

### Removed
- Duplicate or unused components like `OpportunityDetail.js` to avoid conflicts.
