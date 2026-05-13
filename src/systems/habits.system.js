import { HABIT_CATEGORIES } from "../data/habits.data.js";
import { getHabitEntry, getTodayKey } from "../state/state.manager.js";
import { addBits } from "./shop.system.js";

export function activeHabits(state) {
  return (state.habits || []).filter((habit) => habit.active);
}

export function findHabit(state, habitId) {
  return (state.habits || []).find((habit) => habit.id === habitId) || null;
}

function categoryMeta(category) {
  return HABIT_CATEGORIES.find((item) => item.id === category) || HABIT_CATEGORIES[0];
}

function normalizeHabitPayload(data, existing = {}) {
  const category = data.category || existing.category || "salud";
  const meta = categoryMeta(category);

  return {
    name: String(data.name || existing.name || "").trim(),
    category,
    measurementType: data.measurementType || existing.measurementType || "boolean",
    frequency: data.frequency || existing.frequency || "daily",
    target:
      (data.measurementType || existing.measurementType) === "reduce"
        ? Math.max(0, Number(data.target ?? existing.target ?? 0))
        : Math.max(1, Number(data.target || existing.target || 1)),
    unit: String(data.unit || existing.unit || "vez").trim() || "vez",
    reminderTime: data.reminderTime || existing.reminderTime || "",
    icon: String(data.icon || existing.icon || meta.icon).trim() || meta.icon,
    color: data.color || existing.color || meta.color,
    note: String(data.note || existing.note || "").trim(),
  };
}

function createHabitId() {
  if (globalThis.crypto?.randomUUID) return `habit-${globalThis.crypto.randomUUID()}`;
  return `habit-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function addHabit(state, data) {
  const payload = normalizeHabitPayload(data);
  if (!payload.name) {
    return { ok: false, error: "Escribe un nombre para el habito.", state };
  }

  const habit = {
    id: createHabitId(),
    ...payload,
    active: true,
    createdAt: new Date().toISOString(),
  };

  const nextState = structuredClone(state);
  nextState.habits.unshift(habit);
  nextState.reminders.unshift({
    id: `reminder-${habit.id}`,
    type: "habit",
    habitId: habit.id,
    label: habit.name,
    time: habit.reminderTime,
    active: Boolean(habit.reminderTime),
  });
  nextState.logs.unshift({
    id: `log-${Date.now()}`,
    type: "habit-created",
    habitId: habit.id,
    habitName: habit.name,
    createdAt: new Date().toISOString(),
  });
  nextState.habitLogs.unshift({
    id: `habitlog-${Date.now()}-${habit.id}`,
    habitId: habit.id,
    date: new Date().toISOString().slice(0, 10),
    value: 0,
    completed: false,
    mood: "",
    note: "Habito creado",
  });

  return { ok: true, habit, state: nextState };
}

export function updateHabit(state, habitId, data) {
  const nextState = structuredClone(state);
  const habit = findHabit(nextState, habitId);
  if (!habit) return { ok: false, error: "Habito no encontrado.", state };

  const payload = normalizeHabitPayload(data, habit);
  if (!payload.name) return { ok: false, error: "Escribe un nombre para el habito.", state };

  Object.assign(habit, payload);
  const reminder = nextState.reminders.find((item) => item.habitId === habitId);
  if (reminder) {
    reminder.label = habit.name;
    reminder.time = habit.reminderTime;
    reminder.active = Boolean(habit.reminderTime);
  }
  nextState.logs.unshift({
    id: `log-${Date.now()}-${habitId}`,
    type: "habit-updated",
    habitId,
    habitName: habit.name,
    createdAt: new Date().toISOString(),
  });

  return { ok: true, habit, state: nextState };
}

export function setHabitActive(state, habitId, active) {
  const nextState = structuredClone(state);
  const habit = findHabit(nextState, habitId);
  if (!habit) return { ok: false, error: "Habito no encontrado.", state };

  habit.active = Boolean(active);
  nextState.logs.unshift({
    id: `log-${Date.now()}-${habitId}`,
    type: habit.active ? "habit-resumed" : "habit-paused",
    habitId,
    habitName: habit.name,
    createdAt: new Date().toISOString(),
  });

  return { ok: true, habit, state: nextState };
}

export function deleteHabit(state, habitId) {
  const nextState = structuredClone(state);
  const habit = findHabit(nextState, habitId);
  if (!habit) return { ok: false, error: "Habito no encontrado.", state };

  nextState.habits = nextState.habits.filter((item) => item.id !== habitId);
  nextState.reminders = (nextState.reminders || []).filter((item) => item.habitId !== habitId);

  for (const record of Object.values(nextState.dailyRecords || {})) {
    if (record.habits) delete record.habits[habitId];
  }

  nextState.logs.unshift({
    id: `log-${Date.now()}-${habitId}`,
    type: "habit-deleted",
    habitId,
    habitName: habit.name,
    createdAt: new Date().toISOString(),
  });

  return { ok: true, habit, state: nextState };
}

export function recordHabit(state, habitId, data = {}, dateKey = getTodayKey()) {
  const habit = findHabit(state, habitId);
  if (!habit) return { ok: false, error: "Habito no encontrado.", state };

  const nextState = structuredClone(state);
  if (!nextState.dailyRecords[dateKey]) {
    nextState.dailyRecords[dateKey] = { mood: "", note: "", habits: {}, updatedAt: "" };
  }

  const previous = getHabitEntry(nextState, habitId, dateKey);
  const wasCompleted = Boolean(previous.completed);
  const rawValue =
    data.value !== undefined && data.value !== ""
      ? Number(data.value)
      : habit.measurementType === "boolean"
        ? 1
        : Number(previous.value || 0) + 1;
  const value = Math.max(0, Number.isFinite(rawValue) ? rawValue : 1);
  const completed =
    data.completed !== undefined
      ? Boolean(data.completed)
      : habit.measurementType === "reduce"
        ? value <= habit.target
        : value >= habit.target;

  nextState.dailyRecords[dateKey].habits[habitId] = {
    habitId,
    date: dateKey,
    completed,
    value,
    note: String(data.note ?? previous.note ?? "").trim(),
    updatedAt: new Date().toISOString(),
  };
  nextState.dailyRecords[dateKey].updatedAt = new Date().toISOString();

  nextState.logs.unshift({
    id: `log-${Date.now()}-${habitId}`,
    type: "habit-recorded",
    habitId,
    habitName: habit.name,
    value,
    completed,
    dateKey,
    createdAt: new Date().toISOString(),
  });
  nextState.habitLogs.unshift({
    id: `habitlog-${Date.now()}-${habitId}`,
    habitId,
    date: dateKey,
    value,
    completed,
    mood: nextState.dailyRecords[dateKey].mood || "",
    note: String(data.note ?? previous.note ?? "").trim(),
  });
  if (habit.measurementType === "reduce") {
    nextState.reductionLogs.unshift({
      id: `reductionlog-${Date.now()}-${habitId}`,
      habitId,
      date: dateKey,
      value,
      inTarget: completed,
      note: String(data.note ?? previous.note ?? "").trim(),
    });
  }

  let rewardState = nextState;
  let bitsEarned = 0;
  if (completed && !wasCompleted) {
    const reward = addBits(rewardState, 10, { reason: "habit-completed", dateKey, habitId });
    rewardState = reward.state;
    bitsEarned += reward.awarded;
  }

  const active = activeHabits(rewardState);
  const dayEntries = rewardState.dailyRecords[dateKey]?.habits || {};
  const isFullDay = active.length > 0 && active.every((item) => dayEntries[item.id]?.completed);
  const alreadyRewardedFullDay = (rewardState.logs || []).some(
    (reward) => reward.reason === "daily-streak" && reward.date === dateKey
  );
  if (isFullDay && !alreadyRewardedFullDay) {
    const reward = addBits(rewardState, 15, { reason: "daily-streak", dateKey });
    rewardState = reward.state;
    bitsEarned += reward.awarded;
  }

  return { ok: true, habit, entry: rewardState.dailyRecords[dateKey].habits[habitId], bitsEarned, creditsEarned: bitsEarned, state: rewardState };
}

export function completeHabit(state, habitId, dateKey = getTodayKey()) {
  const habit = findHabit(state, habitId);
  if (!habit) return { ok: false, error: "Habito no encontrado.", state };

  const current = getHabitEntry(state, habitId, dateKey);
  const nextValue =
    habit.measurementType === "boolean"
      ? habit.target
      : Math.max(Number(current.value || 0) + 1, habit.measurementType === "reduce" ? habit.target : 1);

  return recordHabit(state, habitId, { value: nextValue, completed: true }, dateKey);
}

export function updateDayStatus(state, data, dateKey = getTodayKey()) {
  const nextState = structuredClone(state);
  if (!nextState.dailyRecords[dateKey]) {
    nextState.dailyRecords[dateKey] = { mood: "", note: "", habits: {}, updatedAt: "" };
  }

  if (data.mood !== undefined) nextState.dailyRecords[dateKey].mood = data.mood;
  if (data.note !== undefined) nextState.dailyRecords[dateKey].note = String(data.note || "").trim();
  nextState.dailyRecords[dateKey].updatedAt = new Date().toISOString();

  nextState.logs.unshift({
    id: `log-${Date.now()}-day`,
    type: "day-updated",
    mood: nextState.dailyRecords[dateKey].mood,
    dateKey,
    createdAt: new Date().toISOString(),
  });
  const existingCheckinIndex = nextState.dailyCheckins.findIndex((item) => item.date === dateKey);
  const checkin = {
    id: existingCheckinIndex >= 0 ? nextState.dailyCheckins[existingCheckinIndex].id : `checkin-${Date.now()}`,
    date: dateKey,
    mood: nextState.dailyRecords[dateKey].mood,
    energy: data.energy || "",
    stress: data.stress || "",
    note: nextState.dailyRecords[dateKey].note,
  };
  if (existingCheckinIndex >= 0) {
    nextState.dailyCheckins[existingCheckinIndex] = checkin;
  } else {
    nextState.dailyCheckins.unshift(checkin);
  }

  let rewardState = nextState;
  if (existingCheckinIndex < 0) {
    rewardState = addBits(rewardState, 8, { reason: "daily-checkin", dateKey }).state;
  }

  return { ok: true, state: rewardState };
}

export function updateProfile(state, data) {
  const nextState = structuredClone(state);
  nextState.profile.name = String(data.name || "").trim();
  nextState.profile.avatarVisual = String(data.avatarVisual || "LV").trim().slice(0, 3) || "LV";
  nextState.profile.avatar = data.avatar || nextState.profile.avatar || "";
  nextState.profile.avatarStyle = data.avatarStyle || nextState.profile.avatarStyle || "";
  nextState.profile.mainGoal =
    String(data.mainGoal || "").trim() ||
    "Habitos simples. Progreso visible. Todos los dias.";
  nextState.profile.startDate = data.startDate || nextState.profile.startDate;
  nextState.profile.visualTheme = data.visualTheme || nextState.profile.visualTheme || "dark";
  nextState.profile.weeklySummaryPreference = data.weeklySummaryPreference || "balanced";
  nextState.profile.onboardingCompleted =
    data.onboardingCompleted !== undefined ? Boolean(data.onboardingCompleted) : nextState.profile.onboardingCompleted;
  nextState.user = {
    ...(nextState.user || {}),
    name: nextState.profile.name,
    avatar: nextState.profile.avatar,
    avatarStyle: nextState.profile.avatarStyle,
    mainGoal: nextState.profile.mainGoal,
    createdAt: nextState.profile.createdAt,
    theme: nextState.profile.visualTheme,
  };
  nextState.settings.theme = nextState.profile.visualTheme;
  if (data.language === "es" || data.language === "en") nextState.language = data.language;
  if ("notifications" in data) {
    nextState.settings.notifications = data.notifications === "on" || data.notifications === true;
  }
  if ("weeklyReview" in data) {
    nextState.settings.weeklyReview = data.weeklyReview === "on" || data.weeklyReview === true;
  }
  return { ok: true, state: nextState };
}

export function createReductionPlan(state, data) {
  const label = data.label || data.type || "Reducir consumo";
  const currentAmount = Math.max(0, Number(data.currentAmount || 0));
  const targetAmount = Math.max(0, Number(data.targetAmount || 0));
  const timeframe = data.timeframe || "30 dias";
  const triggers = Array.isArray(data.triggers)
    ? data.triggers
    : String(data.triggers || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
  const days = Math.max(1, Number.parseInt(timeframe, 10) || 30);
  const dailyTarget = Math.max(targetAmount, Math.round((currentAmount - (currentAmount - targetAmount) / days) * 10) / 10);

  const plan = {
    id: `plan-${Date.now()}`,
    type: data.type || "digital",
    label,
    currentAmount,
    targetAmount,
    timeframe,
    triggers,
    dailyTarget,
    createdAt: new Date().toISOString(),
    active: true,
  };

  const nextState = structuredClone(state);
  nextState.reductionPlans.unshift(plan);
  nextState.logs.unshift({
    id: `log-${Date.now()}-${plan.id}`,
    type: "reduction-plan-created",
    planId: plan.id,
    label: plan.label,
    createdAt: plan.createdAt,
  });

  const habitResult = addHabit(nextState, {
    name: plan.label,
    category: plan.type === "digital" ? "higiene-digital" : "reducir-consumo",
    measurementType: "reduce",
    frequency: "daily",
    target: plan.dailyTarget,
    unit: plan.type === "tabaco" ? "cigarrillos" : plan.type === "alcohol" ? "bebidas" : "impulsos",
    reminderTime: "20:30",
    icon: plan.type === "digital" ? "digital" : "reduce",
    color: plan.type === "digital" ? "#a5b4fc" : "#fda4af",
    note: `Plan guiado: ${plan.timeframe}. Detonantes: ${plan.triggers.join(", ") || "por definir"}.`,
  });

  return {
    ok: true,
    plan,
    state: habitResult.ok ? habitResult.state : nextState,
  };
}

export function exportStateAsJson(state) {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      app: "LifeXP",
      version: 4,
      data: state,
    },
    null,
    2
  );
}

export const archiveHabit = (state, habitId) => setHabitActive(state, habitId, false);
