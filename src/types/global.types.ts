// Global shared type definitions

// Common utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

// ID types
export type ID = string;
export type DateString = string; // ISO 8601 format or YYYY-MM-DD

// Week day with date and label
export interface WeekDay {
  date: Date;
  key: DateString; // YYYY-MM-DD
  label: string; // e.g. "Mon", "Tue"
}

// Generic callback types
export type VoidCallback = () => void;
export type Callback<T = void> = (arg: T) => void;
export type AsyncCallback<T = void> = (arg: T) => Promise<void>;
