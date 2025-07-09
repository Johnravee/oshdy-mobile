# 📦 Reservation Form Module – OSHDY Catering App

This folder contains the modular components used to construct the reservation form for OSHDY Catering's mobile application. It enables users to specify event details, guest count, menu choices, and preview their full reservation before submission.

---

## 📁 Folder: `reservationform/`

### 🔧 Technologies Used:

- **React Native + Expo**
- **Supabase (Auth & Database)**
- **Tailwind CSS (NativeWind)**
- **Context API** for global state

---

## 📄 Components Overview

### 1. `event-details.tsx`

**Step 1 – Event Configuration**

- Choose:
  - 📦 Event Package
  - 🎨 Theme/Motif (filtered by selected package)
  - 🧀 Grazing Table
- Enter:
  - 🎉 Celebrant name
  - 📍 Venue
  - 📅 Date and ⏰ Time
  - 🗺️ Event Location

---

### 2. `guest-details.tsx`

**Step 2 – Guest Count**

- Input guest numbers:
  - Total Pax
  - Number of Adults
  - Number of Kids
- Tip shown to ensure totals match (`Pax = Adults + Kids`)

---

### 3. `menu-details.tsx`

**Step 3 – Menu Selection**

- Choose 1 item per category:
  - 🍝 Pasta
  - 🥬 Vegetable
  - 🍗 Chicken
  - 🐖 Pork
  - 🥩 Beef
  - 🐟 Fillet
  - 🍰 Dessert
  - 🧃 Juice Drinks
- Options fetched from Supabase (via `usePGMTData`)

---

### 4. `reservation-preview.tsx`

**Step 4 – Review All Details**

- Read-only summary of:
  - 👤 Personal Info (from ProfileContext)
  - 📅 Event Info
  - 👥 Guest Breakdown
  - 🍽️ Menu Choices
- Each section is styled for readability

---

## 🧠 State Management

- **`ReservationData`**: Main state object passed across steps
- **`ProfileContext`**: Holds user info from Supabase Auth
- **`usePGMTData`**: Loads packages, menu items, and themes

---

## ✅ Reservation Workflow

1. 🔐 Sign in via `login.tsx`
2. Fill out:
   - `event-details.tsx`
   - `guest-details.tsx`
   - `menu-details.tsx`
3. Review summary in `reservation-preview.tsx`
4. Submit reservation to Supabase

---

## 🧾 Developer Notes

- Components are reusable, stateless, and driven by props
- Designed for integration into a multi-step wizard (e.g. `react-native-progress-steps`)
- Real-time validation and dynamic field control included

---

> Developed by **John Rave Mimay**, 2025  
> For OSHDY Catering Event Services
