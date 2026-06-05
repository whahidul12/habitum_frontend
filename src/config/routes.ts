// Application route paths

export const ROUTES = {
  // Public routes
  LANDING: "/",
  LOGIN: "/login",
  REGISTER: "/register",

  // Protected routes
  DASHBOARD: "/dashboard",
  HABITS: "/habits",
  WEEKLY: "/weekly",
  STATS: "/stats",
  INSIGHTS: "/insights",
} as const;

// Type-safe route keys
export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
