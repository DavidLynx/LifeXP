export const ROUTES = {
  WELCOME: "bienvenida",
  ONBOARDING: "onboarding",
  TODAY: "hoy",
  HABITS: "habitos",
  PROGRESS: "progreso",
  ACHIEVEMENTS: "logros",
  SHOP: "tienda",
  PROFILE: "perfil",
  HELP: "ayuda",
  NOT_FOUND: "not-found",
};

export const VALID_ROUTES = Object.values(ROUTES);

export const NAV_ITEMS = [
  { id: "nav-today", icon: "home", labelKey: "nav.today", route: ROUTES.TODAY },
  { id: "nav-habits", icon: "check", labelKey: "nav.habits", route: ROUTES.HABITS },
  { id: "nav-progress", icon: "chart", labelKey: "nav.progress", route: ROUTES.PROGRESS },
  { id: "nav-shop", icon: "shop", labelKey: "nav.shop", route: ROUTES.SHOP },
  { id: "nav-profile", icon: "user", labelKey: "nav.profile", route: ROUTES.PROFILE },
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
