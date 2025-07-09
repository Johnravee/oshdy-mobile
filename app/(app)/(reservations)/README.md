# Reservation Module — OSHDY Catering Services App

This module provides a full-featured event reservation flow for users, including reservation creation, progress tracking, and history review. It integrates with Supabase for data operations and provides a rich, guided user experience through multi-step forms, visual status indicators, and animated modals.

---

## 📁 Files Overview

| File                      | Description                                                     |
| ------------------------- | --------------------------------------------------------------- |
| `reservation.tsx`         | Multi-step form for users to submit a reservation               |
| `[reservation_id].tsx`    | Displays a vertical progress tracker and modals for reservation |
| `reservation-history.tsx` | Lists all user reservations with search and status filter tabs  |

---

## 🌟 Features

### ✅ Reservation Form (`reservation.tsx`)

- Multi-step guided form using `react-native-progress-steps`
- Event details, guest count, menu selection, and review
- Input validation per step with `Alert` dialogs
- Prevents duplicate pending reservations
- Redirects to status screen after successful submission
- Uses Lottie animations and modals for feedback
- Enforces profile completion before reservation

### 🔄 Reservation Status (`[reservation_id].tsx`)

- Vertical progress tracker for:
  - Pending → Confirmed → Contract Signing → Ongoing → Completed
- Displays reservation-specific data via modals:
  - 🎉 Event Details
  - 👥 Event Staff
  - 🍽️ Event Menu
  - ✉️ Custom Request (enabled after confirmation)
- Dynamic step calculation based on Supabase data
- Responsive loading and empty states

### 📚 Reservation History (`reservation-history.tsx`)

- List view of user reservations
- Search functionality for package name or celebrant
- Horizontal scrollable tabs to filter by reservation status
- Status badges with color-coded backgrounds and emojis
- Clicking on an item navigates to `reservation-status`

---

## 🧩 Components Used

### UI Components

- `BackButton`
- `Spinner`
- `CustomModal`
- `AnimatedModal`
- `VerticalProgressStep`
- Form steps: `EventDetailsForm`, `GuestDetailsForm`, `MenuDetailsForm`, `ReservationPreview`

### Feedback/Animation

- `LottieView` for success and warning modals

---

## 🧠 Custom Hooks Used

| Hook Name                            | Purpose                                           |
| ------------------------------------ | ------------------------------------------------- |
| `useAuthContext()`                   | Auth session check on form                        |
| `useProfileContext()`                | Check if profile is complete                      |
| `useInsertReservation()`             | Insert reservation to Supabase                    |
| `useHasPendingReservation()`         | Check if the user has a pending reservation       |
| `useFetchUserReservations()`         | Fetch reservations with package info              |
| `useUserFetchReservationWithJoins()` | Fetch a reservation with menu & staff info etc..  |
-------------------------------------------------------------------------------------------|


