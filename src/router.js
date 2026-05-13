export const ROUTES = {
  WELCOME: "bienvenida",
  ONBOARDING: "onboarding",
  TODAY: "hoy",
  HABITS: "habitos",
  PROGRESS: "progreso",
  ACHIEVEMENTS: "logros",
  PROFILE: "perfil",
  HELP: "ayuda",
  NOT_FOUND: "not-found",
};

export const VALID_ROUTES = Object.values(ROUTES);

export const NAV_ITEMS = [
  { id: "nav-today", icon: "home", label: "Hoy", route: ROUTES.TODAY },
  { id: "nav-habits", icon: "check", label: "Habitos", route: ROUTES.HABITS },
  { id: "nav-progress", icon: "chart", label: "Progreso", route: ROUTES.PROGRESS },
  { id: "nav-achievements", icon: "award", label: "Logros", route: ROUTES.ACHIEVEMENTS },
  { id: "nav-profile", icon: "user", label: "Perfil", route: ROUTES.PROFILE },
];

export function getRawHashRoute() {
  const rawHash = window.location.hash || "";
  return rawHash.replace("#", "").trim().toLowerCase();
}

export function normalizeRoute(route) {
  if (!route) return ROUTES.WELCOME;
  return VALID_ROUTES.includes(route) ? route : ROUTES.NOT_FOUND;
}

export function getCurrentRoute() {
  return normalizeRoute(getRawHashRoute() || ROUTES.WELCOME);
}

export function goToRoute(route) {
  window.location.hash = `#${normalizeRoute(route)}`;
}
