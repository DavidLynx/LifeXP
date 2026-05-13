import {
  getBestStreak,
  getCurrentStreak,
  getDateRange,
  getDayCompletion,
  getHabitStrength,
  getWeeklySummary,
  renderIcon,
} from "./view.helpers.js";

function daysBetween(startDate) {
  const start = new Date(`${startDate}T00:00:00`);
  const now = new Date();
  return Math.max(0, Math.floor((now - start) / 86400000));
}

function firstLogDate(state, type) {
  const log = (state.logs || []).find((item) => item.type === type);
  return log?.createdAt?.slice(0, 10) || "";
}

function hasReturnedAfterDifficultDay(state) {
  const days = getDateRange(365);
  return days.some((dateKey, index) => {
    const record = state.dailyRecords?.[dateKey];
    const nextDate = days[index + 1];
    if (!record || record.mood !== "dificil" || !nextDate) return false;
    return getDayCompletion(state, nextDate).completed > 0;
  });
}

function computeAchievements(state) {
  const records = Object.values(state.dailyRecords || {});
  const totalRecords = (state.logs || []).filter((log) => log.type === "habit-recorded").length;
  const week = getWeeklySummary(state);
  const strengths = getHabitStrength(state);
  const firstFullDayKey = Object.keys(state.dailyRecords || {}).find((dateKey) => getDayCompletion(state, dateKey).isFull);
  const hasReminder = (state.reminders || []).some((reminder) => reminder.type === "habit" && reminder.active);
  const hasCheckin = (state.dailyCheckins || []).length > 0;

  return [
    { name: "Primer habito creado", difficulty: "Basico", icon: "check", description: "Crea al menos un habito propio.", unlocked: (state.logs || []).some((log) => log.type === "habit-created") || (state.habits || []).length > 0, unlockedAt: firstLogDate(state, "habit-created") },
    { name: "Primer dia registrado", difficulty: "Basico", icon: "home", description: "Registra cualquier avance diario.", unlocked: totalRecords >= 1, unlockedAt: firstLogDate(state, "habit-recorded") },
    { name: "Primer recordatorio configurado", difficulty: "Basico", icon: "rest", description: "Configura una hora de recordatorio.", unlocked: hasReminder, unlockedAt: firstLogDate(state, "habit-created") },
    { name: "Primer check-in completado", difficulty: "Basico", icon: "mind", description: "Registra como estuvo su dia.", unlocked: hasCheckin, unlockedAt: state.dailyCheckins?.[0]?.date || "" },
    { name: "3 dias de constancia", difficulty: "Constancia", icon: "chart", description: "Mantiene una racha de 3 dias completos.", unlocked: getBestStreak(state) >= 3 || getCurrentStreak(state) >= 3 },
    { name: "7 dias de constancia", difficulty: "Constancia", icon: "chart", description: "Mantiene una racha de 7 dias completos.", unlocked: getBestStreak(state) >= 7 || getCurrentStreak(state) >= 7 },
    { name: "14 dias de constancia", difficulty: "Constancia", icon: "chart", description: "Mantiene una racha de 14 dias completos.", unlocked: getBestStreak(state) >= 14 || getCurrentStreak(state) >= 14 },
    { name: "30 dias de constancia", difficulty: "Constancia", icon: "chart", description: "Mantiene una racha de 30 dias completos.", unlocked: getBestStreak(state) >= 30 || getCurrentStreak(state) >= 30 },
    { name: "Semana completa", difficulty: "Avanzado", icon: "award", description: "Completa todos los habitos de una semana.", unlocked: week.every((day) => day.isFull) },
    { name: "10 registros completados", difficulty: "Avanzado", icon: "check", description: "Suma 10 registros de habitos.", unlocked: totalRecords >= 10 },
    { name: "25 registros completados", difficulty: "Avanzado", icon: "check", description: "Suma 25 registros de habitos.", unlocked: totalRecords >= 25 },
    { name: "50 registros completados", difficulty: "Avanzado", icon: "check", description: "Suma 50 registros de habitos.", unlocked: totalRecords >= 50 },
    { name: "100 registros completados", difficulty: "Avanzado", icon: "check", description: "Suma 100 registros de habitos.", unlocked: totalRecords >= 100 },
    { name: "Volvio despues de un dia dificil", difficulty: "Especial", icon: "mind", description: "Registra un dia dificil y vuelve a avanzar.", unlocked: hasReturnedAfterDifficultDay(state) },
    { name: "Primer plan de reduccion creado", difficulty: "Especial", icon: "reduce", description: "Crea un plan guiado para reducir consumo o romper ciclos.", unlocked: (state.reductionPlans || []).length > 0, unlockedAt: firstLogDate(state, "reduction-plan-created") },
    { name: "Primera semana sin romper meta", difficulty: "Especial", icon: "reduce", description: "Mantiene un plan de reduccion en meta durante una semana.", unlocked: (state.reductionPlans || []).length > 0 && week.filter((day) => day.completed > 0).length >= 7 },
    { name: "Semana de enfoque", difficulty: "Especial", icon: "focus", description: "Mantiene un habito de enfoque con 70% o mas.", unlocked: strengths.some((item) => item.habit.category === "enfoque" && item.percent >= 70) },
    { name: "Semana de descanso", difficulty: "Especial", icon: "rest", description: "Mantiene un habito de descanso con 70% o mas.", unlocked: strengths.some((item) => item.habit.category === "descanso" && item.percent >= 70) },
    { name: "Semana creativa", difficulty: "Especial", icon: "creative", description: "Mantiene un habito creativo con 70% o mas.", unlocked: strengths.some((item) => item.habit.category === "creatividad" && item.percent >= 70) },
    { name: "30 dias usando LifeXP", difficulty: "Especial", icon: "award", description: "Llega a 30 dias desde su fecha de inicio.", unlocked: daysBetween(state.profile.startDate) >= 30 || records.length >= 30 },
  ].map((achievement) => ({
    ...achievement,
    unlockedAt: achievement.unlocked ? achievement.unlockedAt || firstFullDayKey || "" : "",
  }));
}

export function renderAchievementsView(state) {
  const achievements = computeAchievements(state);
  const unlocked = achievements.filter((item) => item.unlocked).length;
  const groups = [
    ["Basico", "Basicos"],
    ["Constancia", "Constancia"],
    ["Avanzado", "Avanzados"],
    ["Especial", "Especiales"],
  ];

  return `
    <main class="view achievements-view">
      <section class="page-header">
        <p class="eyebrow">Logros</p>
        <h1>Reconoce tu constancia</h1>
        <p class="page-description">Senales sobrias de avance, bienestar y productividad.</p>
      </section>

      <section class="summary-grid">
        <article class="summary-tile"><span>Desbloqueados</span><strong>${unlocked}/${achievements.length}</strong><small>logros personales</small></article>
      </section>

      ${groups.map(([difficulty, title]) => {
        const items = achievements.filter((achievement) => achievement.difficulty === difficulty);
        return `
          <section class="achievement-group">
            <div class="section-head compact-head">
              <div>
                <p class="eyebrow">${title}</p>
                <h2>${items.filter((item) => item.unlocked).length}/${items.length}</h2>
              </div>
            </div>
            <div class="achievement-grid compact-achievement-grid">
              ${items
                .map(
                  (achievement) => `
                    <article class="achievement-card ${achievement.unlocked ? "unlocked" : ""}">
                      <span class="achievement-mark">${renderIcon(achievement.icon)} ${achievement.difficulty}</span>
                      <h3>${achievement.name}</h3>
                      <p>${achievement.description}</p>
                      <small>${achievement.unlocked ? `Desbloqueado ${achievement.unlockedAt || "recientemente"}` : "Bloqueado"}</small>
                    </article>
                  `
                )
                .join("")}
            </div>
          </section>
        `;
      }).join("")}
    </main>
  `;
}
