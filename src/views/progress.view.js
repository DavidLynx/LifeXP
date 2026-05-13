import {
  escapeHtml,
  getBestStreak,
  getCurrentStreak,
  getDateRange,
  getDayCompletion,
  getHabitStrength,
  getWeeklySummary,
  renderIcon,
} from "./view.helpers.js";

function renderHabitList(title, items, emptyText) {
  return `
    <section class="surface-panel">
      <div class="section-head inline">
        <div>
          <p class="eyebrow">Analisis</p>
          <h2>${title}</h2>
        </div>
      </div>
      <div class="mini-list">
        ${
          items.length
            ? items
                .map(
                  ({ habit, percent, completed }) => `
                    <div class="mini-row">
                      <strong>${escapeHtml(habit.name)}</strong>
                      <span>${completed}/7 dias - ${percent}%</span>
                    </div>
                  `
                )
                .join("")
            : `<p class="empty-state">${emptyText}</p>`
        }
      </div>
    </section>
  `;
}

export function renderProgressView(state) {
  const week = getWeeklySummary(state);
  const month = getDateRange(30).map((dateKey) => getDayCompletion(state, dateKey));
  const weeklyPercent = week.length
    ? Math.round(week.reduce((sum, day) => sum + day.percent, 0) / week.length)
    : 0;
  const monthlyPercent = month.length
    ? Math.round(month.reduce((sum, day) => sum + day.percent, 0) / month.length)
    : 0;
  const completedThisWeek = week.reduce((sum, day) => sum + day.completed, 0);
  const weekCompleted = week.length > 0 && week.every((day) => day.isFull);
  const strengths = getHabitStrength(state);
  const strong = strengths.filter((item) => item.percent >= 70).slice(0, 3);
  const attention = strengths.filter((item) => item.percent < 50).slice(-3).reverse();

  return `
    <main class="view progress-view">
      <div class="dashboard-column main-column">
        <section class="page-header compact-page-header">
          <img class="brand-wordmark" src="/assets/icons/lifexp_wordmark.svg" alt="LifeXP" />
          <p class="eyebrow">Progreso</p>
          <h1>Tu semana en claro</h1>
          <p class="page-description">Rachas, cumplimiento semanal, calendario y habitos que piden atencion.</p>
        </section>

        <section class="summary-grid">
          <article class="summary-tile"><span>Racha actual</span><strong>${getCurrentStreak(state)}</strong><small>dias completos</small></article>
          <article class="summary-tile"><span>Semana</span><strong>${weeklyPercent}%</strong><small>cumplimiento</small></article>
          <article class="summary-tile"><span>Completados</span><strong>${completedThisWeek}</strong><small>esta semana</small></article>
          <article class="summary-tile"><span>Mejor racha</span><strong>${getBestStreak(state)}</strong><small>marca personal</small></article>
          <article class="summary-tile"><span>Mes</span><strong>${monthlyPercent}%</strong><small>ultimos 30 dias</small></article>
        </section>

        ${weekCompleted ? `
          <section class="state-banner success-state">
            Semana completada. Tu rutina estuvo consistente durante los ultimos 7 dias.
          </section>
        ` : ""}

        ${renderHabitList("Habitos mas fuertes", strong, "Complete sus primeros habitos para ver fortalezas.")}
        ${renderHabitList("Necesitan atencion", attention, "Nada critico por ahora.")}
      </div>

      <aside class="dashboard-column side-column">
        <section class="surface-panel">
          <div class="section-head inline">
            <div>
              <p class="eyebrow">Calendario simple</p>
              <h2>Ultimos 7 dias</h2>
            </div>
          </div>
          <div class="week-chart calendar-chart">
            ${week
              .map(
                (day) => `
                  <div class="day-bar ${day.isFull ? "complete" : ""}">
                    <div class="bar-shell"><span style="height:${Math.max(6, day.percent)}%"></span></div>
                    <small>${day.dateKey.slice(5)}</small>
                    <small>${day.completed}/${day.total}</small>
                  </div>
                `
              )
              .join("")}
          </div>
        </section>

        <section class="surface-panel">
          <div class="section-head inline">
            <div>
              <p class="eyebrow">Heatmap</p>
              <h2>Ultimos 30 dias</h2>
            </div>
          </div>
          <div class="heatmap-grid" aria-label="Calendario simple de progreso mensual">
            ${month.map((day) => `<span class="heat-cell level-${Math.ceil(day.percent / 25)}" title="${day.dateKey}: ${day.percent}%"></span>`).join("")}
          </div>
        </section>

        <section class="surface-panel">
          <div class="section-head inline">
            <div>
              <p class="eyebrow">Reduccion</p>
              <h2>Planes guiados</h2>
            </div>
          </div>
          ${
            (state.reductionPlans || []).length
              ? `<div class="mini-list">${state.reductionPlans.map((plan) => `
                  <div class="mini-row">
                    <span class="inline-icon">${renderIcon(plan.type === "digital" ? "digital" : "reduce")}</span>
                    <strong>${escapeHtml(plan.label)}</strong>
                    <span>Meta diaria ${plan.dailyTarget}</span>
                  </div>
                `).join("")}</div>`
              : `<p class="empty-state">Cree un plan de reduccion para ver su evolucion aqui.</p>`
          }
        </section>

        <section class="surface-panel">
          <div class="section-head inline">
            <div>
              <p class="eyebrow">Check-ins</p>
              <h2>Registros emocionales</h2>
            </div>
          </div>
          ${
            (state.dailyCheckins || []).length
              ? `<div class="mini-list">${state.dailyCheckins.slice(0, 5).map((checkin) => `
                  <div class="mini-row">
                    <strong>${escapeHtml(checkin.date)}</strong>
                    <span>${escapeHtml(checkin.mood || "sin estado")}</span>
                  </div>
                `).join("")}</div>`
              : `<p class="empty-state">Use el check-in de Hoy para ver sus registros aqui.</p>`
          }
        </section>
      </aside>
    </main>
  `;
}
