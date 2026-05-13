import { t } from "../i18n.js";
import { escapeHtml, getTodaySummary, renderBrandMark } from "./view.helpers.js";

export function renderWelcomeView(state) {
  const summary = getTodaySummary(state);

  return `
    <main class="view welcome-view">
      <section class="welcome-hero">
        ${renderBrandMark(state, { variant: "primary_logo", className: "brand-logo hero-logo" })}
        <h1>${t(state, "welcome.title")}</h1>
        <p>
          ${t(state, "welcome.description")}
        </p>
        <div class="hero-actions">
          <button class="btn btn-primary" data-route="onboarding">
            ${t(state, "welcome.createRoutine")}
          </button>
          <button class="btn btn-secondary" data-route="${state.profile.onboardingCompleted ? "hoy" : "hoy"}">${t(state, "welcome.continue")}</button>
        </div>
      </section>

      <section class="preview-stack">
        <article class="preview-card primary-preview">
          <div>
            <span class="mini-label">${t(state, "nav.today")}</span>
            <h2>${summary.percent}%</h2>
            <p>${t(state, "welcome.habitsReady", { done: summary.completedCount, total: summary.totalCount })}</p>
          </div>
          <div class="mini-calendar">
            <span></span><span></span><span class="active"></span><span></span>
          </div>
        </article>
        <article class="preview-card">
          <span class="avatar-bubble">${escapeHtml(state.profile.avatarVisual || "LV")}</span>
          <div>
            <h3>${escapeHtml(state.profile.name || t(state, "welcome.profileFallback"))}</h3>
            <p>${escapeHtml(state.profile.mainGoal)}</p>
          </div>
        </article>
      </section>
    </main>
  `;
}
