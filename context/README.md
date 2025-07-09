# 🧠 React Contexts for OSHDY App

This directory contains all global React Context providers used in the OSHDY event management app.

## Available Contexts

### 1. `AuthContext.tsx`

- **Purpose:** Provides authentication session and user auth-related state.
- **Usage:** Wraps the root of the app to expose Supabase `session` and login/logout utilities.
- **Exports:**
  - `useAuthContext()`
  - `AuthProvider`

---

### 2. `ProfileContext.tsx`

- **Purpose:** Fetches and provides the current user's profile information (name, contact, address, etc).
- **Depends on:** `AuthContext` (uses `session.user.id`)
- **Usage:** Wrap this after `AuthProvider`.
- **Exports:**
  - `useProfileContext()`
  - `ProfileProvider`

---

### 3. `ChatMessageContext.tsx`

- **Purpose:** Handles sending, deleting, and live-receiving chat messages between user and admin.
- **Features:**
  - Fetches chat history
  - Real-time updates via Supabase channels
  - Exposes `messages`, `sendMessage`, `deleteMessage`, and `hasNewMessage`
- **Depends on:** `ProfileContext`
- **Exports:**
  - `useChatMessageContext()`
  - `ChatMessageProvider`

---

## Setup Example

```tsx
// root layout or app.tsx
<AuthProvider>
  <ProfileProvider>
    <ChatMessageProvider>
      <DeepLinkBootstrapper />
      <Slot />
    </ChatMessageProvider>
  </ProfileProvider>
</AuthProvider>
```
