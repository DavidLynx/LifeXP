import { escapeHtml, getTodaySummary } from "./view.helpers.js";

export function renderWelcomeView(state) {
  const summary = getTodaySummary(state);

  return `
    <main class="view welcome-view">
      <section class="welcome-hero">
        <img class="brand-logo hero-logo" src="/assets/icons/lifexp_primary_logo.svg" alt="LifeXP" />
        <h1>Habitos simples. Progreso visible. Todos los dias.</h1>
        <p>
          Una app gratuita para crear habitos, recibir recordatorios, registrar avances y mantener constancia.
        </p>
        <div class="hero-actions">
          <button class="btn btn-primary" data-route="onboarding">
            Crear mi rutina
          </button>
          <button class="btn btn-secondary" data-route="${state.profile.onboardingCompleted ? "hoy" : "hoy"}">Continuar</button>
        </div>
      </section>

      <section class="preview-stack">
        <article class="preview-card primary-preview">
          <div>
            <span class="mini-label">Hoy</span>
            <h2>${summary.percent}%</h2>
            <p>${summary.completedCount}/${summary.totalCount} habitos listos</p>
          </div>
          <div class="mini-calendar">
            <span></span><span></span><span class="active"></span><span></span>
          </div>
        </article>
        <article class="preview-card">
          <span class="avatar-bubble">${escapeHtml(state.profile.avatarVisual || "LV")}</span>
          <div>
            <h3>${escapeHtml(state.profile.name || "Tu perfil")}</h3>
            <p>${escapeHtml(state.profile.mainGoal)}</p>
          </div>
        </article>
      </section>
    </main>
  `;
}
