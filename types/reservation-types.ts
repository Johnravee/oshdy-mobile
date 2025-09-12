/**
 * @file reservation-types.ts
 * @description
 * Defines TypeScript types for OSHDY Catering Event Services' multi-step reservation workflow.
 * This includes client details, event metadata, menu selections, and reservation payload structures.
 *
 * @types
 * - EventPackagesType: Selectable catering packages
 * - EventDetails: Core event form fields
 * - GuestDetails: Total, adult, and child headcounts
 * - MenuSelection: Categorized food selections
 * - ReservationData: Consolidated payload passed across reservation steps
 * - ReservationWithPackage: Supabase result with optional relations
 *
 * @usedIn
 * - personal-info.tsx
 * - event-details.tsx
 * - guest-details.tsx
 * - menu-details.tsx
 * - reservation-preview.tsx
 *
 * @author
 * John Rave Mimay
 * @created
 * 2025-06-15
 */

/* ================================
 * 📦 Package / Option Definitions
 * ================================ */

/**
 * Selectable package option from the admin-defined list.
 */
export type EventPackagesType = {
  id: number;
  name: string;
  package_id?: number; // Foreign key reference, if applicable
};

/**
 * Minimal package object used in relational queries.
 */
export interface Package {
  id: number;
  name: string;
}

/**
 * Grazing table theme or visual motif.
 */
export interface Grazing {
  id: number;
  name: string;
}

/* ================================
 * 🗓 Event Information
 * ================================ */

/**
 * Core event form data.
 */
export type EventDetails = {
  receiptId: string;
  celebrant: string;
  pkg: { id: number; name: string };
  theme: { id: number; name: string };
  venue: string;
  eventDate: string; // ISO 8601 string
  eventTime: string; // "HH:mm" format
  grazingTable: { id: number; name: string };
  location: string;
};

/* ================================
 * 👤 Guest Breakdown
 * ================================ */

/**
 * Grouped guest counts.
 */
export type GuestDetails = {
  pax: string;
  adults: string;
  kids: string;
};

/* ================================
 * 🍱 Menu Selection
 * ================================ */

/**
 * Individual food item (used if fetching menu list).
 */
export type Menu = {
  id: number;
  name: string;
};

/**
 * Food choices selected by the user, grouped by category.
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

/* ================================
 * 📋 Reservation Structures
 * ================================ */

/**
 * Supabase reservation query result joined with a package.
 */
export interface ReservationWithPackage {
  id: number;
  receipt_number: string;
  celebrant: string;
  status: string;
  packages?: Package; // Optional FK relation
}


/**
 * Supabase reservation query result joined tables.
 */

export interface Reservation {
  id: number;
  receipt_number: string;
  celebrant: string;
  theme_motif_id: number;
  venue: string;
  event_date: string;
  event_time: string;
  location: string;
  adults_qty: number;
  package: number,
  kids_qty: number;
  status: string;
  created_at: string;
  menu: any;
  packages?: Package;
  grazing?: Grazing;
}


/**
 * Complete reservation payload passed through form steps and submitted to Supabase.
 */
export type ReservationData = {
  event: EventDetails;
  guests: GuestDetails;
  menu: MenuSelection;
};
