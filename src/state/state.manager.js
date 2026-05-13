import { HABIT_CATEGORIES } from "../data/habits.data.js";

const STORAGE_KEY = "lifexp_state_v3";
const PREVIOUS_STORAGE_KEYS = ["lifexp_state_v2", "lifexp_state_v1"];

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function createInitialState() {
  const now = new Date().toISOString();

  return {
    profile: {
      name: "",
      avatarVisual: "LV",
      avatar: "",
      avatarStyle: "",
      mainGoal: "Habitos simples. Progreso visible. Todos los dias.",
      startDate: todayKey(),
      visualTheme: "dark",
      weeklySummaryPreference: "balanced",
      onboardingCompleted: false,
      createdAt: now,
    },
    user: {
      name: "",
      avatar: "",
      avatarStyle: "",
      mainGoal: "Habitos simples. Progreso visible. Todos los dias.",
      createdAt: now,
      theme: "dark",
    },
    habits: [],
    habitLogs: [],
    reductionPlans: [],
    reductionLogs: [],
    dailyCheckins: [],
    achievements: [],
    reminders: [
      { id: "reminder-day-close", type: "daily-close", label: "Cierre del dia", time: "21:30", active: true },
      { id: "reminder-weekly-review", type: "weekly-review", label: "Resumen semanal", time: "18:00", active: true },
    ],
    dailyRecords: {},
    notes: [],
    settings: {
      theme: "dark",
      notifications: false,
      weeklyReview: true,
      dailyCloseReminder: true,
      remindersEnabled: true,
      weekStartsOn: "monday",
    },
    portfolio: {
      projects: [],
    },
    logs: [],
    session: {
      lastLoginAt: null,
      currentView: "hoy",
      storageError: "",
    },
  };
}

function categoryFallback(category) {
  return HABIT_CATEGORIES.find((item) => item.id === category) || HABIT_CATEGORIES[0];
}

function normalizeHabit(habit) {
  const category = habit.category || habit.area || "salud";
  const categoryMeta = categoryFallback(category);

  return {
    id: habit.id || `habit-${Date.now()}`,
    name: habit.name || "Nuevo habito",
    category,
    measurementType: habit.measurementType || habit.type || "boolean",
    frequency: habit.frequency || "daily",
    target:
      (habit.measurementType || habit.type) === "reduce"
        ? Math.max(0, Number(habit.target ?? 0))
        : Math.max(1, Number(habit.target || 1)),
    unit: habit.unit || "vez",
    reminderTime: habit.reminderTime || habit.reminder || "",
    icon: habit.icon || categoryMeta.icon,
    color: habit.color || categoryMeta.color,
    active: habit.active ?? !habit.archived,
    note: habit.note || "",
    createdAt: habit.createdAt || new Date().toISOString(),
  };
}

function normalizeDayRecord(record) {
  return {
    mood: record?.mood || "",
    note: record?.note || "",
    habits: record?.habits || {},
    updatedAt: record?.updatedAt || "",
  };
}

function migrateCompletionsToDailyRecords(rawState) {
  const dailyRecords = rawState.dailyRecords || {};

  for (const [dateKey, completions] of Object.entries(rawState.completions || {})) {
    if (!dailyRecords[dateKey]) dailyRecords[dateKey] = normalizeDayRecord({});

    for (const [habitId, value] of Object.entries(completions || {})) {
      dailyRecords[dateKey].habits[habitId] = {
        completed: Number(value || 0) > 0,
        value: Number(value || 0),
        note: "",
        updatedAt: new Date().toISOString(),
      };
    }
  }

  return dailyRecords;
}

function normalizeLoadedState(rawState) {
  const initial = createInitialState();
  const safe = structuredClone(rawState || initial);
  const focus = safe.profile?.focus;

  const normalized = {
    profile: {
      ...initial.profile,
      ...(safe.profile || {}),
      avatarVisual: safe.profile?.avatarVisual || safe.profile?.avatarStyle || initial.profile.avatarVisual,
      avatar: safe.profile?.avatar || safe.user?.avatar || "",
      avatarStyle: safe.profile?.avatarStyle || safe.user?.avatarStyle || "",
      mainGoal: safe.profile?.mainGoal || focus || initial.profile.mainGoal,
      startDate: safe.profile?.startDate || safe.profile?.createdAt?.slice(0, 10) || initial.profile.startDate,
      visualTheme: safe.profile?.visualTheme || safe.settings?.theme || initial.profile.visualTheme,
      weeklySummaryPreference:
        safe.profile?.weeklySummaryPreference || initial.profile.weeklySummaryPreference,
    },
    user: {
      ...initial.user,
      ...(safe.user || {}),
      name: safe.user?.name || safe.profile?.name || "",
      avatar: safe.user?.avatar || safe.profile?.avatar || "",
      avatarStyle: safe.user?.avatarStyle || safe.profile?.avatarStyle || "",
      mainGoal: safe.user?.mainGoal || safe.profile?.mainGoal || focus || initial.user.mainGoal,
      theme: safe.user?.theme || safe.settings?.theme || initial.user.theme,
    },
    habits: Array.isArray(safe.habits) ? safe.habits.map(normalizeHabit) : initial.habits,
    habitLogs: Array.isArray(safe.habitLogs) ? safe.habitLogs : [],
    reductionPlans: Array.isArray(safe.reductionPlans) ? safe.reductionPlans : [],
    reductionLogs: Array.isArray(safe.reductionLogs) ? safe.reductionLogs : [],
    dailyCheckins: Array.isArray(safe.dailyCheckins) ? safe.dailyCheckins : [],
    achievements: Array.isArray(safe.achievements) ? safe.achievements : [],
    reminders: Array.isArray(safe.reminders) ? safe.reminders : initial.reminders,
    portfolio: {
      ...initial.portfolio,
      ...(safe.portfolio || {}),
    },
    dailyRecords: {},
    notes: Array.isArray(safe.notes) ? safe.notes : [],
    settings: {
      ...initial.settings,
      ...(safe.settings || {}),
    },
    logs: Array.isArray(safe.logs) ? safe.logs : [],
    session: {
      ...initial.session,
      ...(safe.session || {}),
    },
  };

  const sourceRecords = migrateCompletionsToDailyRecords(safe);
  for (const [dateKey, record] of Object.entries(sourceRecords || {})) {
    normalized.dailyRecords[dateKey] = normalizeDayRecord(record);
  }

  normalized.profile.name = normalized.profile.name || normalized.user.name;
  normalized.profile.avatar = normalized.profile.avatar || normalized.user.avatar;
  normalized.profile.avatarStyle = normalized.profile.avatarStyle || normalized.user.avatarStyle;

  return normalized;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return normalizeLoadedState(JSON.parse(raw));

    for (const key of PREVIOUS_STORAGE_KEYS) {
      const previous = localStorage.getItem(key);
      if (previous) return normalizeLoadedState(JSON.parse(previous));
    }

    return null;
  } catch (error) {
    console.error("Error loading state:", error);
    return null;
  }
}

function saveState(nextState = state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    if (nextState.session) nextState.session.storageError = "";
  } catch (error) {
    console.error("Error saving state:", error);
    if (nextState.session) {
      nextState.session.storageError = "No se pudo guardar en localStorage.";
    }
  }
}

let state = loadState() || createInitialState();
saveState(state);

export function getTodayKey() {
  return todayKey();
}

export function getState() {
  return structuredClone(state);
}

export function setState(nextState) {
  state = normalizeLoadedState(nextState);
  saveState();
  return getState();
}

export function updateState(updater) {
  const draft = structuredClone(state);
  const updated = updater(draft) || draft;
  return setState(updated);
}

export function resetState() {
  state = createInitialState();
  saveState();
  return getState();
}

export function initializeSession() {
  return updateState((draft) => {
    draft.session.lastLoginAt = new Date().toISOString();
  });
}

export function getDayRecord(stateValue, dateKey = todayKey()) {
  return normalizeDayRecord(stateValue.dailyRecords?.[dateKey]);
}

export function getHabitEntry(stateValue, habitId, dateKey = todayKey()) {
  return getDayRecord(stateValue, dateKey).habits[habitId] || {
    completed: false,
    value: 0,
    note: "",
    updatedAt: "",
  };
}

export function getHabitCompletion(stateValue, habitId, dateKey = todayKey()) {
  return Number(getHabitEntry(stateValue, habitId, dateKey).value || 0);
}

export function getHabitProgress(stateValue, habitId, dateKey = todayKey()) {
  const habit = stateValue.habits.find((item) => item.id === habitId);
  if (!habit) return { count: 0, target: 1, complete: false, percent: 0 };

  const entry = getHabitEntry(stateValue, habitId, dateKey);
  const count = Number(entry.value || 0);
  const target = Math.max(1, Number(habit.target || 1));
  const complete =
    habit.measurementType === "reduce"
      ? entry.completed || (count > 0 && count <= target)
      : entry.completed || count >= target;

  return {
    count,
    target,
    complete,
    percent: complete ? 100 : Math.min(100, Math.round((count / target) * 100)),
  };
}
