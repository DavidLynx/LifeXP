import { AVATAR_OPTIONS, getAvatarById } from "../data/avatar.data.js";
import { THEME_OPTIONS, WEEKLY_SUMMARY_OPTIONS } from "../data/habits.data.js";
import { escapeHtml, getActiveHabits, getTodaySummary } from "./view.helpers.js";

function renderOptions(items, selected) {
  return items
    .map((item) => `<option value="${item.id}" ${item.id === selected ? "selected" : ""}>${item.name}</option>`)
    .join("");
}

function renderAvatarChoice(avatar, selected) {
  return `
    <label class="avatar-option compact ${selected === avatar.id ? "selected" : ""}">
      <input type="radio" name="avatar" value="${avatar.id}" ${selected === avatar.id ? "checked" : ""} />
      <img src="${avatar.src}" alt="${escapeHtml(avatar.label)}" loading="lazy" />
      <span>${escapeHtml(avatar.label)}</span>
    </label>
  `;
}

function renderAvatar(profile) {
  const avatar = getAvatarById(profile.avatar);
  if (avatar) {
    return `<img class="profile-avatar image-avatar" src="${avatar.src}" alt="${escapeHtml(avatar.label)}" />`;
  }

  return `<div class="profile-avatar">${escapeHtml(profile.avatarVisual || "LV")}</div>`;
}

export function renderProfileView(state, options = {}) {
  const summary = getTodaySummary(state);
  const habits = getActiveHabits(state);
  const profile = state.profile;

  return `
    <main class="view profile-view">
      <div class="dashboard-column main-column">
        <section class="page-header profile-header">
          <div class="profile-avatar-frame">${renderAvatar(profile)}</div>
          <div>
            <img class="brand-wordmark" src="/assets/icons/lifexp_wordmark.svg" alt="LifeXP" />
            <p class="eyebrow">Perfil</p>
            <h1>${escapeHtml(profile.name || "Tu espacio personal")}</h1>
            <p class="page-description">${escapeHtml(profile.mainGoal)}</p>
            <p class="muted-copy">Inicio: ${escapeHtml(profile.startDate)} - ${habits.length} habitos activos</p>
          </div>
        </section>

        <section class="summary-grid">
          <article class="summary-tile"><span>Habitos</span><strong>${habits.length}</strong><small>activos</small></article>
          <article class="summary-tile"><span>Hoy</span><strong>${summary.percent}%</strong><small>avance diario</small></article>
          <article class="summary-tile"><span>Inicio</span><strong>${escapeHtml(profile.startDate.slice(5))}</strong><small>fecha local</small></article>
          <article class="summary-tile"><span>Resumen</span><strong>${escapeHtml(profile.weeklySummaryPreference)}</strong><small>preferencia</small></article>
        </section>

        <section class="form-panel">
        <form class="profile-form" data-action="update-profile">
          <div class="form-row">
            <label>
              Nombre
              <input name="name" type="text" value="${escapeHtml(profile.name)}" placeholder="Tu nombre" />
            </label>
            <label>
              Iniciales fallback
              <input name="avatarVisual" type="text" maxlength="3" value="${escapeHtml(profile.avatarVisual)}" />
            </label>
          </div>

          <label>
            Objetivo principal
            <textarea name="mainGoal" rows="3">${escapeHtml(profile.mainGoal)}</textarea>
          </label>

          <section class="avatar-section">
            <p class="mini-label">Avatar personal</p>
            <p class="muted-copy">Seleccione un avatar para personalizar su experiencia.</p>
            <div class="avatar-grid compact-grid">
              ${AVATAR_OPTIONS.map((avatar) => renderAvatarChoice(avatar, profile.avatar)).join("")}
            </div>
          </section>

          <div class="form-row">
            <label>
              Fecha de inicio
              <input name="startDate" type="date" value="${escapeHtml(profile.startDate)}" />
            </label>
            <label>
              Tema visual
              <select name="visualTheme">${renderOptions(THEME_OPTIONS, profile.visualTheme)}</select>
            </label>
          </div>

          <label>
            Preferencia de resumen semanal
            <select name="weeklySummaryPreference">${renderOptions(WEEKLY_SUMMARY_OPTIONS, profile.weeklySummaryPreference)}</select>
          </label>

          <div class="toggle-row">
            <label><input name="notifications" type="checkbox" ${state.settings.notifications ? "checked" : ""} /> Recordatorios del navegador cuando esten disponibles</label>
            <label><input name="weeklyReview" type="checkbox" ${state.settings.weeklyReview ? "checked" : ""} /> Recordatorio semanal</label>
          </div>

          <button class="btn btn-primary" type="submit">Guardar perfil</button>
        </form>
        </section>
      </div>

      <aside class="dashboard-column side-column">
        <section class="surface-panel">
        <p class="eyebrow">Recordatorios y permisos</p>
        <h2>Ajustes futuros</h2>
        <div class="mini-list">
          <div class="mini-row"><strong>Recordatorios internos</strong><span>${(state.reminders || []).filter((item) => item.active).length} activos</span></div>
          <div class="mini-row"><strong>Cierre del dia</strong><span>${state.settings.dailyCloseReminder ? "Activo" : "Sugerido"}</span></div>
          <div class="mini-row"><strong>Resumen semanal</strong><span>${state.settings.weeklyReview ? "Activo" : "Inactivo"}</span></div>
          <div class="mini-row disabled-row"><strong>Integracion con salud / pasos</strong><span>Proximamente</span></div>
          <div class="mini-row disabled-row"><strong>GPS para habitos por ubicacion</strong><span>Proximamente</span></div>
          <div class="mini-row disabled-row"><strong>Calendario externo</strong><span>Proximamente</span></div>
          <div class="mini-row disabled-row"><strong>Modo enfoque avanzado</strong><span>Proximamente</span></div>
        </div>
        <p class="muted-copy">Las integraciones desactivadas estaran disponibles en una proxima version. No se simulan permisos que aun no funcionan.</p>
        </section>

        <section class="surface-panel">
        <p class="eyebrow">Links Visual Division</p>
        <h2>LifeXP y portafolio</h2>
        <img class="brand-logo panel-logo" src="/assets/icons/lifexp_primary_logo.svg" alt="LifeXP" />
        <p class="muted-copy">LifeXP es un prototipo viable de web app creado por Links Visual Division. Diseño y desarrollo: Juan David.</p>
        <div class="project-grid">
          <button class="project-card" data-route="ayuda" type="button">
            <strong>Ayuda y FAQ</strong>
            <span>Respuestas sobre datos, rachas, ciclos y exportacion.</span>
            <small>Ver guia</small>
          </button>
          <button class="project-card" data-route="ayuda" type="button">
            <strong>Acerca de LifeXP</strong>
            <span>Aplicacion gratuita creada por Links Visual Division.</span>
            <small>Ver seccion</small>
          </button>
          <button class="project-card" data-route="ayuda" type="button">
            <strong>Otros proyectos de Links Visual Division</strong>
            <span>Dark Wallet, Neon Dice, Nido Canino, Generador QR y mas.</span>
            <small>Ver portafolio</small>
          </button>
        </div>
        </section>

        <section class="surface-panel">
        <h2>Datos locales</h2>
        <p>LifeXP guarda su informacion en localStorage. No hay backend, login ni sincronizacion externa en esta etapa.</p>
        <div class="habit-actions">
          <button class="btn btn-secondary" data-action="export-json">Exportar JSON</button>
          <button class="btn btn-secondary" data-route="ayuda">Ayuda / FAQ</button>
          <button class="btn btn-danger" data-action="request-reset-demo-state">Borrar datos locales</button>
        </div>
        ${
          options.pendingLocalReset
            ? `
              <div class="confirm-panel">
                <strong>Confirmacion de borrado</strong>
                <p>Esto eliminara perfil, habitos y registros guardados en este navegador.</p>
                <div class="habit-actions">
                  <button class="btn btn-danger" data-action="reset-demo-state">Si, borrar todo</button>
                  <button class="btn btn-secondary" data-action="cancel-reset-demo-state">Cancelar</button>
                </div>
              </div>
            `
            : ""
        }
        <textarea class="export-box" id="export-box" rows="8" readonly placeholder="Tu exportacion aparecera aqui."></textarea>
        </section>
      </aside>
    </main>
  `;
}
