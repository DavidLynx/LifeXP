import { getAvatarById } from "../data/avatar.data.js";
import { t } from "../i18n.js";
import { getDayRecord, getHabitProgress } from "../state/state.manager.js";
import { getLocalizedShopItem, getOwnedShopItems } from "../systems/shop.system.js";
import { escapeHtml, formatDate, getTodaySummary, renderHabitCard, renderIcon } from "./view.helpers.js";

function greeting(state) {
  const hour = new Date().getHours();
  if (hour < 12) return t(state, "today.morning");
  if (hour < 18) return t(state, "today.afternoon");
  return t(state, "today.evening");
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
    return `<p class="empty-state">${t(state, "today.noReminders")}</p>`;
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
      <p class="empty-state">${t(state, "today.reductionPrompt")}</p>
      <button class="btn btn-secondary" data-route="habitos">${t(state, "today.createPlan")}</button>
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

function renderUnlockedItemsSummary(state) {
  const items = getOwnedShopItems(state);
  if (!items.length) return "";

  return `
    <section class="surface-panel compact-inventory-summary">
      <div class="section-head inline">
        <div>
          <p class="eyebrow">${t(state, "profile.inventoryTitle")}</p>
          <h2>${t(state, "today.unlockedItems", { count: items.length })}</h2>
        </div>
        <button class="btn btn-secondary compact-btn" data-route="perfil" type="button">${t(state, "nav.profile")}</button>
      </div>
      <div class="mini-item-row">
        ${items.slice(0, 3).map((item) => {
          const label = getLocalizedShopItem(
            {
              ...item,
              name: { es: t({ language: "es" }, `shopItems.${item.key}.name`), en: t({ language: "en" }, `shopItems.${item.key}.name`) },
            },
            state.language
          );
          return `<img src="${item.image}" alt="${escapeHtml(label.name)}" loading="lazy" />`;
        }).join("")}
      </div>
    </section>
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
      ? `<article class="empty-card"><span class="empty-illustration">${renderIcon("check")}</span><h3>${t(state, "today.noPending")}</h3><p>${t(state, "today.allDone")}</p></article>`
      : `<article class="empty-card"><span class="empty-illustration">${renderIcon("home")}</span><h3>${t(state, "today.noHabits")}</h3><p>${t(state, "today.startSmall")}</p><button class="btn btn-primary" data-route="habitos">${t(state, "today.createHabit")}</button></article>`;

  return `
    <main class="view today-view">
      <div class="dashboard-column main-column">
        <section class="hero-band today-hero">
          <div>
            <img class="brand-wordmark" src="/assets/icons/lifexp_wordmark.svg" alt="LifeXP" />
            <p class="eyebrow">${formatDate(summary.today)}</p>
            <h1>${greeting(state)}</h1>
            <p>${t(state, "today.progress", { name: escapeHtml(name) })}</p>
            <strong class="today-compact-summary">${t(state, "today.compact", { done: summary.completedCount, total: summary.totalCount, percent: summary.percent })}</strong>
          </div>
          ${renderAvatar(state.profile)}
        </section>

        <section class="summary-grid">
          <article class="summary-tile">
            <span>${t(state, "nav.today")}</span>
            <strong>${summary.completedCount}/${summary.totalCount}</strong>
            <small>${t(state, "today.habitsDone")}</small>
          </article>
          <article class="summary-tile">
            <span>Constancia</span>
            <strong>${summary.percent}%</strong>
            <small>${t(state, "today.dailyProgress")}</small>
          </article>
          <article class="summary-tile">
            <span>${t(state, "today.pending")}</span>
            <strong>${pendingHabits.length}</strong>
            <small>${t(state, "today.remaining")}</small>
          </article>
          <article class="summary-tile">
            <span>${t(state, "today.status")}</span>
            <strong>${dayRecord.mood || "--"}</strong>
            <small>${t(state, "today.checkin")}</small>
          </article>
        </section>

        <section class="section-head compact-head">
          <div>
            <p class="eyebrow">${t(state, "today.dailyRoutine")}</p>
            <h2>${t(state, "today.todayHabits")}</h2>
            <p>${t(state, "today.manageDaily")}</p>
          </div>
          <button class="btn btn-secondary" data-route="habitos">${t(state, "common.create")}</button>
        </section>

        <section class="habit-list">${pendingList}</section>

        <section class="section-head compact-head">
          <div>
            <p class="eyebrow">${t(state, "today.completed")}</p>
            <h2>${t(state, "today.registered", { count: completedHabits.length })}</h2>
          </div>
        </section>
        <section class="habit-list">
          ${completedHabits.map((habit) => renderHabitCard(habit, state)).join("") || `<p class="empty-state">${t(state, "today.firstHabit")}</p>`}
        </section>
      </div>

      <aside class="dashboard-column side-column">
        ${dayCompleted ? `<section class="state-banner success-state">${t(state, "today.dayCompleted")}</section>` : ""}
        ${difficultDay ? `<section class="state-banner care-state">${t(state, "today.difficultDay")}</section>` : ""}
        ${renderUnlockedItemsSummary(state)}

        <section class="surface-panel">
          <div class="section-head inline">
            <div>
              <p class="eyebrow">${t(state, "today.dayMood")}</p>
              <h2>${t(state, "today.quickCheckin")}</h2>
            </div>
          </div>
          <div class="mood-row">
            ${moodButton("bien", t(state, "today.good"), "check", dayRecord.mood)}
            ${moodButton("regular", t(state, "today.regular"), "focus", dayRecord.mood)}
            ${moodButton("dificil", t(state, "today.hard"), "mind", dayRecord.mood)}
          </div>
          <form class="day-note-form" data-action="save-day-note">
            <label>
              ${t(state, "today.dayNote")}
              <textarea name="note" rows="3" placeholder="${t(state, "today.notePlaceholder")}">${escapeHtml(dayRecord.note)}</textarea>
            </label>
            <button class="btn btn-secondary" type="submit">${t(state, "today.addNote")}</button>
          </form>
        </section>

        <section class="surface-panel">
          <div class="section-head inline">
            <div>
              <p class="eyebrow">${t(state, "today.reminders")}</p>
              <h2>${t(state, "today.upcoming")}</h2>
            </div>
          </div>
          ${renderReminderList(state, summary.habits)}
        </section>

        <section class="surface-panel">
          <div class="section-head inline">
            <div>
              <p class="eyebrow">${t(state, "today.cycles")}</p>
              <h2>${t(state, "today.activePlan")}</h2>
            </div>
          </div>
          ${renderActivePlanSummary(state)}
        </section>
      </aside>
    </main>
  `;
}
