import { FREQUENCIES, HABIT_CATEGORIES, MEASUREMENT_TYPES } from "../data/habits.data.js";
import { getDayRecord, getHabitProgress, getTodayKey } from "../state/state.manager.js";
import { activeHabits } from "../systems/habits.system.js";

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function getCategory(categoryId) {
  return HABIT_CATEGORIES.find((category) => category.id === categoryId) || HABIT_CATEGORIES[0];
}

export function getArea(areaId) {
  return getCategory(areaId);
}

export function getTypeLabel(type) {
  return MEASUREMENT_TYPES[type] || type || "Habito";
}

export function getFrequencyLabel(frequency) {
  return FREQUENCIES[frequency] || frequency || "Diario";
}

const ICON_PATHS = {
  home: '<path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-9.5Z"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  chart: '<path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 16v-5"/><path d="M12 16V8"/><path d="M16 16v-8"/>',
  award: '<path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"/><path d="m9 14-1 7 4-2 4 2-1-7"/>',
  user: '<path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  health: '<path d="M20 8.5c0 5-8 10.5-8 10.5S4 13.5 4 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8 2.5Z"/>',
  movement: '<path d="M13 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/><path d="m9 21 2-6-3-3 3-3 3 3 3 1"/><path d="m14 15 3 6"/>',
  focus: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
  rest: '<path d="M4 14a7 7 0 0 0 10 6 8 8 0 0 1-7-13 7 7 0 0 0-3 7Z"/><path d="M17 4h4l-4 5h4"/>',
  food: '<path d="M6 3v8"/><path d="M10 3v8"/><path d="M8 3v18"/><path d="M17 3v18"/><path d="M14 7a3 4 0 0 0 6 0c0-2-1.3-4-3-4s-3 2-3 4Z"/>',
  mind: '<path d="M12 21a7 7 0 0 0 7-7v-2a7 7 0 1 0-14 0v2a7 7 0 0 0 7 7Z"/><path d="M9 10h.01M15 10h.01M9 15c1.5 1 4.5 1 6 0"/>',
  study: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15Z"/>',
  creative: '<path d="M12 3v18"/><path d="M5 8h14"/><path d="M7 16h10"/><path d="m5 8 7-5 7 5"/><path d="m7 16 5 5 5-5"/>',
  finance: '<path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6"/>',
  order: '<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/>',
  reduce: '<path d="M5 12h14"/><path d="M12 5v14"/><path d="m7 17 10-10"/>',
  digital: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M10 18h4"/><path d="M9 7h6"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4.1 1.9c-.9.6-1.6 1.1-1.6 2.1"/><path d="M12 17h.01"/>',
};

export function renderIcon(name, className = "svg-icon") {
  const path = ICON_PATHS[name] || ICON_PATHS.check;
  return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
}

export function getActiveHabits(state) {
  return activeHabits(state);
}

export function isHabitDueOn(habit, dateKey) {
  const date = new Date(`${dateKey}T00:00:00`);
  const day = date.getDay();

  if (habit.frequency === "weekdays") return day >= 1 && day <= 5;
  if (habit.frequency === "weekends") return day === 0 || day === 6;
  if (habit.frequency === "weekly") {
    const created = new Date(`${habit.createdAt.slice(0, 10)}T00:00:00`);
    return created.getDay() === day;
  }

  return true;
}

export function getDueHabits(state, dateKey = getTodayKey()) {
  return getActiveHabits(state).filter((habit) => isHabitDueOn(habit, dateKey));
}

export function formatDate(dateKey) {
  const [year, month, day] = dateKey.split("-");
  return `${day}/${month}/${year}`;
}

export function getTodaySummary(state) {
  const today = getTodayKey();
  const habits = getDueHabits(state, today);
  const completed = habits.filter((habit) => getHabitProgress(state, habit.id, today).complete);

  return {
    today,
    habits,
    completedCount: completed.length,
    totalCount: habits.length,
    percent: habits.length ? Math.round((completed.length / habits.length) * 100) : 0,
    dayRecord: getDayRecord(state, today),
  };
}

export function getDateRange(days) {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - index));
    return date.toISOString().slice(0, 10);
  });
}

export function getLastSevenDays() {
  return getDateRange(7);
}

export function getDayCompletion(state, dateKey) {
  const habits = getDueHabits(state, dateKey);
  const completed = habits.filter((habit) => getHabitProgress(state, habit.id, dateKey).complete);

  return {
    dateKey,
    completed: completed.length,
    total: habits.length,
    percent: habits.length ? Math.round((completed.length / habits.length) * 100) : 0,
    isFull: habits.length > 0 && completed.length === habits.length,
  };
}

export function getWeeklySummary(state) {
  return getLastSevenDays().map((dateKey) => getDayCompletion(state, dateKey));
}

export function getCurrentStreak(state) {
  let streak = 0;
  const days = getDateRange(365).reverse();

  for (const dateKey of days) {
    const day = getDayCompletion(state, dateKey);
    if (!day.isFull) break;
    streak += 1;
  }

  return streak;
}

export function getBestStreak(state) {
  let best = 0;
  let current = 0;

  for (const dateKey of getDateRange(365)) {
    if (getDayCompletion(state, dateKey).isFull) {
      current += 1;
      best = Math.max(best, current);
    } else {
      current = 0;
    }
  }

  return best;
}

export function getHabitStrength(state) {
  const days = getLastSevenDays();

  return getActiveHabits(state)
    .map((habit) => {
      const dueDays = days.filter((dateKey) => isHabitDueOn(habit, dateKey));
      const completed = dueDays.filter((dateKey) => getHabitProgress(state, habit.id, dateKey).complete).length;
      return {
        habit,
        completed,
        percent: dueDays.length ? Math.round((completed / dueDays.length) * 100) : 0,
      };
    })
    .sort((a, b) => b.percent - a.percent);
}

function valueInput(habit) {
  if (habit.measurementType === "boolean") return "";

  return `
    <label class="quick-value">
      Valor
      <input data-role="habit-value" data-habit-id="${habit.id}" type="number" min="0" step="1" placeholder="${habit.target}" />
    </label>
  `;
}

export function renderHabitCard(habit, state, options = {}) {
  const dateKey = options.dateKey || getTodayKey();
  const progress = getHabitProgress(state, habit.id, dateKey);
  const category = getCategory(habit.category);
  const isComplete = progress.complete;

  return `
    <article class="habit-card ${isComplete ? "is-complete" : ""}">
      <div class="habit-card-main">
        <span class="habit-icon" style="--area-color:${habit.color || category.color}">${renderIcon(habit.icon || category.icon)}</span>
        <div>
          <p class="mini-label">${escapeHtml(category.name)} - ${escapeHtml(getTypeLabel(habit.measurementType))}</p>
          <h3>${escapeHtml(habit.name)}</h3>
          <p>${escapeHtml(habit.note || "Sin nota")}</p>
        </div>
      </div>

      <div class="habit-progress-row">
        <div class="progress-track"><span style="width:${progress.percent}%"></span></div>
        <strong>${progress.count}/${progress.target} ${escapeHtml(habit.unit)}</strong>
      </div>

      <div class="habit-actions">
        <span class="chip">${escapeHtml(getFrequencyLabel(habit.frequency))}</span>
        ${habit.reminderTime ? `<span class="chip muted-chip">${escapeHtml(habit.reminderTime)}</span>` : `<span class="chip muted-chip">Sin hora</span>`}
      </div>

      <div class="habit-actions action-row">
        ${valueInput(habit)}
        <button class="btn btn-primary" data-action="complete-habit" data-habit-id="${habit.id}">Completar</button>
        <button class="btn btn-secondary" data-route="habitos">Editar</button>
      </div>
    </article>
  `;
}
