import { getAvatarById } from "../data/avatar.data.js";
import { getDayRecord, getHabitProgress } from "../state/state.manager.js";
import { escapeHtml, formatDate, getTodaySummary, renderHabitCard, renderIcon } from "./view.helpers.js";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos dias";
  if (hour < 18) return "Buenas tardes";
  return "Buenas noches";
}

function moodButton(value, label, icon, current) {
  return `
    <button class="mood-btn ${current === value ? "active" : ""}" data-action="set-day-mood" data-mood="${value}" type="button">
      ${renderIcon(icon)}
      <span>${label}</span>
    </button>
  `;
}

function renderAvatar(profile) {
  const avatar = getAvatarById(profile.avatar);
  if (avatar) {
    return `<img class="today-avatar" src="${avatar.src}" alt="${escapeHtml(avatar.label)}" />`;
  }
  return `<div class="today-avatar fallback">${escapeHtml(profile.avatarVisual || "LV")}</div>`;
}

function renderReminderList(state, todayHabits) {
  const upcoming = todayHabits
    .filter((habit) => habit.reminderTime)
    .sort((a, b) => a.reminderTime.localeCompare(b.reminderTime))
    .slice(0, 4);

  if (!upcoming.length) {
    return `<p class="empty-state">No hay recordatorios proximos para hoy.</p>`;
  }

  return `
    <div class="mini-list">
      ${upcoming
        .map(
          (habit) => `
            <div class="mini-row">
              <span class="inline-icon">${renderIcon("rest")}</span>
              <strong>${escapeHtml(habit.reminderTime)}</strong>
              <span>${escapeHtml(habit.name)}</span>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderActivePlanSummary(state) {
  const plans = (state.reductionPlans || []).filter((plan) => plan.active);
  if (!plans.length) {
    return `
      <p class="empty-state">Si quiere reducir distracciones o consumo, puede crear un plan guiado desde Habitos.</p>
      <button class="btn btn-secondary" data-route="habitos">Crear plan</button>
    `;
  }

  return `
    <div class="mini-list">
      ${plans.slice(0, 2).map((plan) => `
        <div class="mini-row">
          <span class="inline-icon">${renderIcon(plan.type === "digital" ? "digital" : "reduce")}</span>
          <strong>${escapeHtml(plan.label)}</strong>
          <span>Meta ${plan.dailyTarget}</span>
        </div>
      `).join("")}
    </div>
  `;
}

export function renderTodayView(state) {
  const summary = getTodaySummary(state);
  const dayRecord = getDayRecord(state, summary.today);
  const name = state.profile.name || "su dia";
  const pendingHabits = summary.habits.filter((habit) => !getHabitProgress(state, habit.id, summary.today).complete);
  const completedHabits = summary.habits.filter((habit) => getHabitProgress(state, habit.id, summary.today).complete);
  const dayCompleted = summary.totalCount > 0 && summary.completedCount === summary.totalCount;
  const difficultDay = dayRecord.mood === "dificil";

  const pendingList = pendingHabits.length
    ? pendingHabits.map((habit) => renderHabitCard(habit, state)).join("")
    : summary.habits.length
      ? `<article class="empty-card"><span class="empty-illustration">${renderIcon("check")}</span><h3>Sin pendientes</h3><p>Todo lo de hoy esta registrado.</p></article>`
      : `<article class="empty-card"><span class="empty-illustration">${renderIcon("home")}</span><h3>Sin habitos para hoy</h3><p>Empiece con un habito pequeno. La constancia se construye con acciones simples.</p><button class="btn btn-primary" data-route="habitos">Crear habito</button></article>`;

  return `
    <main class="view today-view">
      <div class="dashboard-column main-column">
        <section class="hero-band today-hero">
          <div>
            <img class="brand-wordmark" src="/assets/icons/lifexp_wordmark.svg" alt="LifeXP" />
            <p class="eyebrow">${formatDate(summary.today)}</p>
            <h1>${greeting()}</h1>
            <p>Este es su avance de hoy, ${escapeHtml(name)}.</p>
            <strong class="today-compact-summary">${summary.completedCount} de ${summary.totalCount} habitos completados - ${summary.percent}% de constancia diaria</strong>
          </div>
          ${renderAvatar(state.profile)}
        </section>

        <section class="summary-grid">
          <article class="summary-tile">
            <span>Hoy</span>
            <strong>${summary.completedCount}/${summary.totalCount}</strong>
            <small>habitos completos</small>
          </article>
          <article class="summary-tile">
            <span>Constancia</span>
            <strong>${summary.percent}%</strong>
            <small>avance diario</small>
          </article>
          <article class="summary-tile">
            <span>Pendientes</span>
            <strong>${pendingHabits.length}</strong>
            <small>acciones restantes</small>
          </article>
          <article class="summary-tile">
            <span>Estado</span>
            <strong>${dayRecord.mood || "--"}</strong>
            <small>check-in</small>
          </article>
        </section>

        <section class="section-head compact-head">
          <div>
            <p class="eyebrow">Rutina diaria</p>
            <h2>Habitos de hoy</h2>
            <p>Active, complete o edite sus habitos diarios.</p>
          </div>
          <button class="btn btn-secondary" data-route="habitos">Crear</button>
        </section>

        <section class="habit-list">${pendingList}</section>

        <section class="section-head compact-head">
          <div>
            <p class="eyebrow">Completados</p>
            <h2>${completedHabits.length} registrados</h2>
          </div>
        </section>
        <section class="habit-list">
          ${completedHabits.map((habit) => renderHabitCard(habit, state)).join("") || `<p class="empty-state">Complete su primer habito para ver esta lista.</p>`}
        </section>
      </div>

      <aside class="dashboard-column side-column">
        ${dayCompleted ? `<section class="state-banner success-state">Dia completado. Su lista de hoy ya esta cerrada.</section>` : ""}
        ${difficultDay ? `<section class="state-banner care-state">Dia dificil registrado. Mantener una sola accion pequena tambien cuenta.</section>` : ""}

        <section class="surface-panel">
          <div class="section-head inline">
            <div>
              <p class="eyebrow">Estado del dia</p>
              <h2>Check-in rapido</h2>
            </div>
          </div>
          <div class="mood-row">
            ${moodButton("bien", "Bien", "check", dayRecord.mood)}
            ${moodButton("regular", "Regular", "focus", dayRecord.mood)}
            ${moodButton("dificil", "Dificil", "mind", dayRecord.mood)}
          </div>
          <form class="day-note-form" data-action="save-day-note">
            <label>
              Nota del dia
              <textarea name="note" rows="3" placeholder="Algo que quiera recordar">${escapeHtml(dayRecord.note)}</textarea>
            </label>
            <button class="btn btn-secondary" type="submit">Agregar nota del dia</button>
          </form>
        </section>

        <section class="surface-panel">
          <div class="section-head inline">
            <div>
              <p class="eyebrow">Recordatorios</p>
              <h2>Proximos de hoy</h2>
            </div>
          </div>
          ${renderReminderList(state, summary.habits)}
        </section>

        <section class="surface-panel">
          <div class="section-head inline">
            <div>
              <p class="eyebrow">Ciclos</p>
              <h2>Plan activo</h2>
            </div>
          </div>
          ${renderActivePlanSummary(state)}
        </section>
      </aside>
    </main>
  `;
}
