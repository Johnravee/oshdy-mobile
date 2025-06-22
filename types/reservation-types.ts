/**
 * @file reservation-types.ts
 * @description
 * Contains TypeScript types used for the multi-step reservation process
 * of OSHDY Catering Event Services. This includes data structures for:
 * - Personal Information
 * - Event Details
 * - Guest Breakdown
 * - Menu Selections
 * - Final Reservation Payload
 * 
 * These types are used across form components, Supabase insert hooks,
 * and preview components to ensure consistent structure and validation.
 * 
 * @types
 * - EventPackagesType: Structure for selectable packages.
 * - EventDetails: Form data for event-specific details.
 * - PersonalInfo: Client identification data.
 * - GuestDetails: Breakdown of guest counts.
 * - MenuSelection: Food selection per category.
 * - ReservationData: The complete state object passed through the form.
 * 
 * @usedIn
 * - personal-info.tsx
 * - event-details.tsx
 * - guest-details.tsx
 * - menu-details.tsx
 * - reservation-preview.tsx
 * 
 * @author John Rave Mimay
 * @created 2025-06-15
 */

/**
 * Represents an available event package (e.g., Gold, Silver).
 */
export type EventPackagesType = {
  id: number;
  name: string;
};

/**
 * Event-related details for the reservation form.
 */
export type EventDetails = {
  celebrant: string;
  pkg: string;
  theme: string;
  venue: string;
  eventDate: string;
  eventTime: string;
  location: string;
};

/**
 * Structure for a single menu item.
 */
export type Menu = {
  id: number;
  title: string;
};

/**
 * Personal information of the client.
 */
export type PersonalInfo = {
  name: string;
  email: string;
  contact: string;
  address: string;
};

/**
 * Guest information including total, adult, and child guests.
 */
export type GuestDetails = {
  pax: string;
  adults: string;
  kids: string;
};

/**
 * Food menu selections grouped by category.
 */
export type MenuSelection = {
  beef: string;
  chicken: string;
  vegetable: string;
  pork: string;
  pasta: string;
  fillet: string;
  dessert: string;
  juice: string;
};

/**
 * Final reservation data model passed between steps and submitted to Supabase.
 */
export type ReservationData = {
  personal: PersonalInfo;
  event: EventDetails;
  guests: GuestDetails;
  menu: MenuSelection;
};
