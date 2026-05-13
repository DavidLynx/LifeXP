import { getState, initializeSession, resetState, setState } from "./state/state.manager.js";
import { HABIT_TEMPLATES } from "./data/habits.data.js";
import { getCurrentRoute, goToRoute, normalizeRoute, NAV_ITEMS, ROUTES } from "./router.js";
import { localizeVisibleText, t } from "./i18n.js";
import { renderBrandMark, renderIcon } from "./views/view.helpers.js";
import {
  addHabit,
  completeHabit,
  createReductionPlan,
  deleteHabit,
  exportStateAsJson,
  recordHabit,
  setHabitActive,
  updateDayStatus,
  updateHabit,
  updateProfile,
} from "./systems/habits.system.js";

import { renderTodayView } from "./views/today.view.js";
import { renderWelcomeView } from "./views/welcome.view.js";
import { renderOnboardingSetupView } from "./views/onboarding.setup.view.js";
import { renderHabitsView } from "./views/habits.view.js";
import { renderProgressView } from "./views/progress.view.js";
import { renderAchievementsView } from "./views/achievements.view.js";
import { renderProfileView } from "./views/profile.view.js";
import { renderHelpView } from "./views/help.view.js";
import { renderNotFoundView } from "./views/not-found.view.js";
import { renderShopView } from "./views/shop.view.js";
import { buyShopItem, equipShopItem, getBits } from "./systems/shop.system.js";

const APP_ROOT_ID = "app";
let pendingDeleteHabitId = null;
let pendingLocalReset = false;
const busyHabitIds = new Set();

const GOAL_TEMPLATE_RULES = {
  "Crear habitos saludables": ["Tomar agua", "Caminar al menos 15 minutos", "Dormir 7 horas"],
  "Mejorar enfoque": ["Bloque de enfoque", "Leer 10 minutos", "Planear el dia"],
  "Reducir distracciones": ["No usar celular al despertar", "Reducir redes sociales", "Bloque de desconexion"],
  "Hacer mas ejercicio": ["Entrenar", "Hacer movilidad", "Caminar al menos 15 minutos"],
  "Dormir mejor": ["Dormir 7 horas", "No usar pantalla antes de dormir", "Preparar el dia siguiente"],
  "Manejar estres o ansiedad": ["Respirar 2 minutos", "Registrar como me siento", "Salir al sol"],
  "Reducir consumo": ["Reducir cafeina", "Registrar como me siento", "Respirar 2 minutos"],
  "Organizar mi rutina": ["Planear el dia", "Tender la cama", "Revisar pendientes"],
  "Ser mas creativo": ["Crear una idea diaria", "Escribir", "Practicar musica"],
};

function templatesForOnboarding(data, selectedTemplates) {
  if (selectedTemplates.length) {
    return selectedTemplates.map((templateIndex) => HABIT_TEMPLATES[templateIndex]).filter(Boolean);
  }

  const names = new Set(GOAL_TEMPLATE_RULES[data.mainGoal] || ["Tomar agua", "Bloque de enfoque", "Planear el dia"]);
  if (data.priorityArea === "higiene-digital") {
    names.add("No usar celular al despertar");
    names.add("Limitar pantalla nocturna");
  }
  if (data.routineSize === "complete") {
    names.add("Registrar como me siento");
    names.add("Caminar al menos 15 minutos");
  }

  const limit = data.routineSize === "simple" ? 3 : data.routineSize === "complete" ? 6 : 4;
  return HABIT_TEMPLATES.filter((template) => names.has(template.name)).slice(0, limit);
}

const VIEW_RENDERERS = {
  [ROUTES.WELCOME]: (state) => renderWelcomeView(state),
  [ROUTES.ONBOARDING]: (state) => renderOnboardingSetupView(state),
  [ROUTES.TODAY]: (state) => renderTodayView(state),
  [ROUTES.HABITS]: (state) => renderHabitsView(state, { pendingDeleteHabitId }),
  [ROUTES.PROGRESS]: (state) => renderProgressView(state),
  [ROUTES.ACHIEVEMENTS]: (state) => renderAchievementsView(state),
  [ROUTES.SHOP]: (state) => renderShopView(state),
  [ROUTES.PROFILE]: (state) => renderProfileView(state, { pendingLocalReset }),
  [ROUTES.HELP]: (state) => renderHelpView(state),
  [ROUTES.NOT_FOUND]: () => renderNotFoundView(),
};

function getAppRoot() {
  const root = document.getElementById(APP_ROOT_ID);
  if (!root) throw new Error(`No se encontro el contenedor #${APP_ROOT_ID}`);
  return root;
}

function renderTopControls(state) {
  return `
    <div class="app-controls" aria-label="Preferencias de interfaz">
      <div class="segmented-control" aria-label="${t(state, "app.language")}">
        <button class="${state.language === "es" ? "active" : ""}" data-action="set-language" data-language="es" type="button">ES</button>
        <button class="${state.language === "en" ? "active" : ""}" data-action="set-language" data-language="en" type="button">EN</button>
      </div>
      <div class="credit-pill ${state.session?.bitsPulse ? "bits-pulse" : ""}">${renderIcon("spark")} <strong>${getBits(state)}</strong> ${t(state, "app.credits")}</div>
    </div>
  `;
}

function renderBottomNav(route, state) {
  return `
    <nav class="bottom-nav" aria-label="Navegación principal">
      ${NAV_ITEMS.map((item) => `
        <button class="nav-item ${item.route === route ? "active" : ""}" data-route="${item.route}" type="button">
          <span class="nav-icon">${renderIcon(item.icon)}</span>
          <span>${t(state, item.labelKey)}</span>
        </button>
      `).join("")}
    </nav>
  `;
}

function renderAppFooter(state) {
  return `
    <footer class="app-footer" aria-label="Información del proyecto">
      ${renderBrandMark(state, { compact: true })}
      <p>${t(state, "app.footerCopyright")}</p>
      <p>${t(state, "app.footerCredit")}</p>
      <nav class="footer-links" aria-label="Links internos">
        <button type="button" data-route="ayuda">${t(state, "app.about")}</button>
        <button type="button" data-route="ayuda">FAQ</button>
        <button type="button" data-route="ayuda">${t(state, "app.portfolio")}</button>
        <button type="button" data-route="perfil">${t(state, "app.localPrivacy")}</button>
      </nav>
      <small>${t(state, "app.localStorage")}</small>
    </footer>
  `;
}

export function renderApp(route = ROUTES.TODAY) {
  const root = getAppRoot();
  const state = getState();
  const normalizedRoute = normalizeRoute(route);
  const renderer = VIEW_RENDERERS[normalizedRoute] || VIEW_RENDERERS[ROUTES.NOT_FOUND];

  root.innerHTML = `
    <div class="app-shell" data-theme="${state.profile?.visualTheme || state.settings?.theme || "dark"}">
      ${renderTopControls(state)}
      ${state.session?.storageError ? `<aside class="state-banner error-state">${t(state, "app.storageError")}</aside>` : ""}
      ${renderer(state)}
      ${renderAppFooter(state)}
      ${[ROUTES.WELCOME, ROUTES.ONBOARDING, ROUTES.HELP].includes(normalizedRoute) ? "" : renderBottomNav(normalizedRoute, state)}
    </div>
  `;
  localizeVisibleText(root, state);
  document.documentElement.lang = state.language || "es";
  document.title = state.language === "en"
    ? "LifeXP - Free habits, reminders, and personal progress app"
    : "LifeXP - App gratuita de hábitos, recordatorios y progreso personal";
  const description = document.querySelector("meta[name='description']");
  if (description) {
    description.setAttribute(
      "content",
      state.language === "en"
        ? "LifeXP is a free app by Lynx Visual Division for habits, reminders, progress tracking, cycle reduction, and mobile-first consistency."
        : "LifeXP es una app gratuita creada por Lynx Visual Division para crear hábitos, recibir recordatorios, registrar avances, reducir ciclos y ver progreso diario desde una experiencia mobile-first."
    );
  }

  bindUIEvents();
  markBusyHabitButtons();
}

function bindNavigationEvents() {
  document.querySelectorAll("[data-route]").forEach((element) => {
    element.addEventListener("click", (event) => {
      event.preventDefault();
      goToRoute(element.getAttribute("data-route"));
    });
  });
}

function bindPreferenceEvents() {
  document.querySelectorAll("[data-action='set-language']").forEach((button) => {
    button.addEventListener("click", () => {
      const language = button.getAttribute("data-language") === "en" ? "en" : "es";
      setState({ ...getState(), language });
      renderApp(getCurrentRoute());
    });
  });
}

function bindHabitEvents() {
  document.querySelectorAll("[data-action='complete-habit']").forEach((button) => {
    button.addEventListener("click", () => {
      const habitId = button.getAttribute("data-habit-id");
      if (!habitId || busyHabitIds.has(habitId)) return;
      busyHabitIds.add(habitId);
      button.disabled = true;
      button.classList.add("is-saving");
      button.textContent = t(getState(), "common.saved");

      const valueInput = document.querySelector(`[data-role='habit-value'][data-habit-id='${habitId}']`);
      const value = valueInput?.value;
      const result =
        value !== undefined && value !== ""
          ? recordHabit(getState(), habitId, { value })
          : completeHabit(getState(), habitId);
      if (!result.ok) {
        busyHabitIds.delete(habitId);
        button.disabled = false;
        button.classList.remove("is-saving");
        button.textContent = t(getState(), "common.complete");
        return showToast(result.error);
      }

      setState(result.state);
      renderApp(getCurrentRoute());
      showToast(result.bitsEarned ? `+${result.bitsEarned} Bits` : t(getState(), "common.completed"));
      setTimeout(() => {
        busyHabitIds.delete(habitId);
        renderApp(getCurrentRoute());
      }, 2000);
    });
  });

  document.querySelectorAll("[data-action='toggle-habit']").forEach((button) => {
    button.addEventListener("click", () => {
      const habitId = button.getAttribute("data-habit-id");
      const active = button.getAttribute("data-active") === "true";
      const result = setHabitActive(getState(), habitId, active);
      if (!result.ok) return showToast(result.error);
      setState(result.state);
      renderApp(getCurrentRoute());
      showToast(active ? "Habito reactivado" : "Habito pausado");
    });
  });

  document.querySelectorAll("[data-action='request-delete-habit']").forEach((button) => {
    button.addEventListener("click", () => {
      pendingDeleteHabitId = button.getAttribute("data-habit-id");
      renderApp(getCurrentRoute());
    });
  });

  document.querySelectorAll("[data-action='cancel-delete-habit']").forEach((button) => {
    button.addEventListener("click", () => {
      pendingDeleteHabitId = null;
      renderApp(getCurrentRoute());
    });
  });

  document.querySelectorAll("[data-action='confirm-delete-habit']").forEach((button) => {
    button.addEventListener("click", () => {
      const habitId = button.getAttribute("data-habit-id") || pendingDeleteHabitId;
      if (!habitId) return;

      const result = deleteHabit(getState(), habitId);
      if (!result.ok) return showToast(result.error);
      pendingDeleteHabitId = null;
      setState(result.state);
      renderApp(getCurrentRoute());
      showToast("Habito eliminado");
    });
  });

  document.querySelectorAll("[data-action='use-template']").forEach((button) => {
    button.addEventListener("click", () => {
      const templateIndex = Number(button.getAttribute("data-template-index"));
      const template = HABIT_TEMPLATES[templateIndex];
      if (!template) return showToast("Plantilla no encontrada");
      const result = addHabit(getState(), template);
      if (!result.ok) return showToast(result.error);

      setState(result.state);
      renderApp(ROUTES.HABITS);
      showToast("Plantilla agregada a su rutina.");
    });
  });

  document.querySelectorAll("[data-action='set-day-mood']").forEach((button) => {
    button.addEventListener("click", () => {
      const mood = button.getAttribute("data-mood");
      const result = updateDayStatus(getState(), { mood });
      setState(result.state);
      renderApp(getCurrentRoute());
      showToast("Estado guardado");
    });
  });
}

function bindForms() {
  const habitForm = document.querySelector("[data-action='add-habit']");
  if (habitForm) {
    habitForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(habitForm).entries());
      const result = addHabit(getState(), data);
      if (!result.ok) return showToast(result.error);

      setState(result.state);
      renderApp(ROUTES.HABITS);
      showToast("Habito creado");
    });
  }

  document.querySelectorAll("[data-action='edit-habit']").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const habitId = form.getAttribute("data-habit-id");
      const data = Object.fromEntries(new FormData(form).entries());
      const result = updateHabit(getState(), habitId, data);
      if (!result.ok) return showToast(result.error);

      setState(result.state);
      renderApp(ROUTES.HABITS);
      showToast("Habito actualizado");
    });
  });

  const dayNoteForm = document.querySelector("[data-action='save-day-note']");
  if (dayNoteForm) {
    dayNoteForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(dayNoteForm).entries());
      const result = updateDayStatus(getState(), data);
      setState(result.state);
      renderApp(getCurrentRoute());
      showToast("Nota guardada");
    });
  }

  const profileForm = document.querySelector("[data-action='update-profile']");
  if (profileForm) {
    profileForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(profileForm).entries());
      const result = updateProfile(getState(), data);
      setState(result.state);
      renderApp(ROUTES.PROFILE);
      showToast("Perfil guardado");
    });
  }

  const reductionForm = document.querySelector("[data-action='create-reduction-plan']");
  if (reductionForm) {
    reductionForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(reductionForm).entries());
      const result = createReductionPlan(getState(), data);
      if (!result.ok) return showToast(result.error);

      setState(result.state);
      renderApp(ROUTES.HABITS);
      showToast("Plan de reduccion creado");
    });
  }

  const onboardingForm = document.querySelector("[data-action='finish-onboarding']");
  if (onboardingForm) {
    onboardingForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(onboardingForm);
      const data = Object.fromEntries(formData.entries());
      const selectedTemplates = formData.getAll("starterTemplates").map(Number);
      const profileResult = updateProfile(getState(), {
        ...data,
        mainGoal: data.mainGoal === "Otro objetivo" ? data.customGoal || "Organizar mi rutina" : data.mainGoal,
      });
      let nextState = {
        ...profileResult.state,
        habits: [],
        reminders: profileResult.state.reminders.filter((reminder) => reminder.type !== "habit"),
      };

      templatesForOnboarding(data, selectedTemplates).forEach((template) => {
        if (!template) return;
        const habitResult = addHabit(nextState, template);
        if (habitResult.ok) nextState = habitResult.state;
      });

      if (data.cycleFocus && data.cycleFocus !== "none") {
        const planResult = createReductionPlan(nextState, {
          type: ["redes", "pantalla", "contenido"].includes(data.cycleFocus) ? "digital" : data.cycleFocus,
          label: `Reducir ${data.cycleFocus}`,
          currentAmount: 5,
          targetAmount: 2,
          timeframe: "30 dias",
          triggers: data.focusTime || "Noche",
        });
        if (planResult.ok) nextState = planResult.state;
      }

      setState(nextState);
      goToRoute(ROUTES.TODAY);
      renderApp(ROUTES.TODAY);
      showToast("Espacio configurado");
    });
  }
}

function bindResetEvents() {
  const requestButton = document.querySelector("[data-action='request-reset-demo-state']");
  if (requestButton) {
    requestButton.addEventListener("click", () => {
      pendingLocalReset = true;
      renderApp(getCurrentRoute());
    });
  }

  const cancelButton = document.querySelector("[data-action='cancel-reset-demo-state']");
  if (cancelButton) {
    cancelButton.addEventListener("click", () => {
      pendingLocalReset = false;
      renderApp(getCurrentRoute());
    });
  }

  const resetButton = document.querySelector("[data-action='reset-demo-state']");
  if (!resetButton) return;

  resetButton.addEventListener("click", () => {
    localStorage.removeItem("lifexp_state_v1");
    localStorage.removeItem("lifexp_state_v2");
    localStorage.removeItem("lifexp_state_v3");
    localStorage.removeItem("lifexp_state_v4");
    pendingLocalReset = false;
    resetState();
    goToRoute(ROUTES.TODAY);
    renderApp(ROUTES.TODAY);
    showToast("Datos reiniciados");
  });
}

function bindShopEvents() {
  document.querySelectorAll("[data-action='buy-shop-item']").forEach((button) => {
    button.addEventListener("click", () => {
      const result = buyShopItem(getState(), button.getAttribute("data-item-id"));
      if (!result.ok) {
        button.classList.add("shake");
        setTimeout(() => button.classList.remove("shake"), 420);
        const message =
          result.error === "insufficient"
            ? t(getState(), "common.needMoreBits", { amount: result.missingBits || 0 })
            : result.error === "owned"
              ? t(getState(), "common.ownedAction")
              : result.error;
        return showToast(message);
      }
      setState(result.state);
      renderApp(ROUTES.SHOP);
      const label = t(getState(), `shopItems.${result.item.key}.name`);
      showToast(t(getState(), "common.boughtItem", { name: label }));
    });
  });

  document.querySelectorAll("[data-action='equip-shop-item']").forEach((button) => {
    button.addEventListener("click", () => {
      const result = equipShopItem(getState(), button.getAttribute("data-item-id"));
      if (!result.ok) return showToast(result.error);
      setState(result.state);
      renderApp(getCurrentRoute());
      showToast(t(getState(), "common.itemEquipped"));
    });
  });
}

function markBusyHabitButtons() {
  busyHabitIds.forEach((habitId) => {
    document.querySelectorAll(`[data-action='complete-habit'][data-habit-id='${habitId}']`).forEach((button) => {
      button.disabled = true;
      button.classList.add("is-saving");
      button.textContent = t(getState(), "common.saved");
    });
  });
}

function bindOnboardingShortcuts() {
  const skipButton = document.querySelector("[data-action='skip-onboarding']");
  if (!skipButton) return;

  skipButton.addEventListener("click", () => {
    let nextState = updateProfile(getState(), {
      name: "",
      avatarVisual: "LV",
      mainGoal: "Habitos simples. Progreso visible. Todos los dias.",
      onboardingCompleted: true,
    }).state;

    HABIT_TEMPLATES.slice(0, 3).forEach((template) => {
      const result = addHabit(nextState, template);
      if (result.ok) nextState = result.state;
    });

    setState(nextState);
    goToRoute(ROUTES.TODAY);
    renderApp(ROUTES.TODAY);
    showToast("Rutina basica creada");
  });
}

function bindExportEvents() {
  const exportButton = document.querySelector("[data-action='export-json']");
  if (!exportButton) return;

  exportButton.addEventListener("click", async () => {
    const json = exportStateAsJson(getState());
    const exportBox = document.getElementById("export-box");
    if (exportBox) exportBox.value = json;

    try {
      await navigator.clipboard.writeText(json);
      showToast("JSON exportado y copiado");
    } catch {
      showToast("JSON exportado");
    }
  });
}

function bindUIEvents() {
  bindNavigationEvents();
  bindPreferenceEvents();
  bindHabitEvents();
  bindForms();
  bindResetEvents();
  bindExportEvents();
  bindOnboardingShortcuts();
  bindShopEvents();
}

function bindRouteListener() {
  window.addEventListener("hashchange", () => renderApp(getCurrentRoute()));
}

function ensureToastContainer() {
  let toastRoot = document.getElementById("toast-root");
  if (!toastRoot) {
    toastRoot = document.createElement("div");
    toastRoot.id = "toast-root";
    toastRoot.className = "toast-root";
    document.body.appendChild(toastRoot);
  }
  return toastRoot;
}

function showToast(message) {
  const toastRoot = ensureToastContainer();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toastRoot.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("toast-visible"));
  setTimeout(() => {
    toast.classList.remove("toast-visible");
    setTimeout(() => toast.remove(), 220);
  }, 1800);
}

export function initApp() {
  initializeSession();
  bindRouteListener();

  if (!window.location.hash) {
    const state = getState();
    goToRoute(state.profile.onboardingCompleted ? ROUTES.TODAY : ROUTES.WELCOME);
  }

  renderApp(getCurrentRoute());
}


