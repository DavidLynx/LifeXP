import { AVATAR_OPTIONS } from "../data/avatar.data.js";
import { HABIT_TEMPLATES, MAIN_GOAL_OPTIONS, THEME_OPTIONS, WEEKLY_SUMMARY_OPTIONS } from "../data/habits.data.js";
import { escapeHtml, getCategory, getTypeLabel } from "./view.helpers.js";

function renderOptions(items, selected) {
  return items
    .map((item) => `<option value="${item.id}" ${item.id === selected ? "selected" : ""}>${item.name}</option>`)
    .join("");
}

function renderAvatarOption(avatar, selected) {
  return `
    <label class="avatar-option ${selected === avatar.id ? "selected" : ""}">
      <input type="radio" name="avatar" value="${avatar.id}" ${selected === avatar.id ? "checked" : ""} />
      <img src="${avatar.src}" alt="${escapeHtml(avatar.label)}" loading="lazy" />
      <span>${escapeHtml(avatar.label)}</span>
      <small>${escapeHtml(avatar.group)}</small>
    </label>
  `;
}

function renderStarterHabit(template, index) {
  return `
    <label class="starter-habit">
      <input type="checkbox" name="starterTemplates" value="${index}" />
      <span>
        <strong>${escapeHtml(template.name)}</strong>
        <small>${escapeHtml(getCategory(template.category).name)} · ${escapeHtml(getTypeLabel(template.measurementType))}</small>
      </span>
    </label>
  `;
}

export function renderOnboardingSetupView(state) {
  const profile = state.profile;
  const starterTemplates = HABIT_TEMPLATES.slice(0, 12);

  return `
    <main class="view onboarding-view">
      <section class="page-header">
        <p class="eyebrow">Onboarding</p>
        <h1>Configure su rutina inicial</h1>
        <p class="page-description">
          Responda hasta 10 preguntas cortas. LifeXP sugerira habitos, recordatorios y un primer plan simple.
        </p>
      </section>

      <section class="form-panel elevated-panel">
        <form class="profile-form onboarding-form" data-action="finish-onboarding">
          <section class="onboarding-step">
            <p class="mini-label">Pregunta 1</p>
            <h2>Nombre</h2>
            <label>
              Nombre del usuario
              <input name="name" type="text" value="${escapeHtml(profile.name)}" placeholder="Como quiere aparecer" />
            </label>
          </section>

          <section class="onboarding-step">
            <p class="mini-label">Pregunta 2</p>
            <h2>Como quiere usar LifeXP?</h2>
            <label>
              Objetivo
              <select name="mainGoal">
                ${MAIN_GOAL_OPTIONS.map((goal) => `<option value="${goal}" ${goal === profile.mainGoal ? "selected" : ""}>${goal}</option>`).join("")}
              </select>
            </label>
            <label>
              Otro objetivo
              <input name="customGoal" type="text" placeholder="Opcional" />
            </label>
          </section>

          <section class="onboarding-step">
            <p class="mini-label">Pregunta 3</p>
            <h2>Area prioritaria esta semana</h2>
            <select name="priorityArea">
              <option value="salud">Salud</option>
              <option value="movimiento">Movimiento</option>
              <option value="enfoque">Enfoque</option>
              <option value="descanso">Descanso</option>
              <option value="bienestar-mental">Bienestar mental</option>
              <option value="creatividad">Creatividad</option>
              <option value="estudio">Estudio</option>
              <option value="finanzas">Finanzas</option>
              <option value="orden">Orden</option>
              <option value="higiene-digital">Higiene digital</option>
            </select>
          </section>

          <section class="onboarding-step">
            <p class="mini-label">Pregunta 4</p>
            <h2>Que tan estructurada quiere su rutina?</h2>
            <select name="routineSize">
              <option value="simple">Muy simple, pocos habitos</option>
              <option value="medium" selected>Intermedia, algunos habitos</option>
              <option value="complete">Completa, varias areas</option>
            </select>
          </section>

          <section class="onboarding-step">
            <p class="mini-label">Pregunta 5</p>
            <h2>Momento principal del dia</h2>
            <select name="focusTime">
              <option>Manana</option>
              <option>Tarde</option>
              <option>Noche</option>
              <option>Todo el dia</option>
            </select>
          </section>

          <section class="onboarding-step">
            <p class="mini-label">Pregunta 6</p>
            <h2>Que le cuesta mas mantener?</h2>
            <select name="difficulty">
              <option>Constancia</option>
              <option>Energia</option>
              <option>Concentracion</option>
              <option>Descanso</option>
              <option>Motivacion</option>
              <option>Control de impulsos</option>
              <option>Organizacion</option>
            </select>
          </section>

          <section class="onboarding-step">
            <p class="mini-label">Pregunta 7</p>
            <h2>Recordatorios preferidos</h2>
            <select name="reminderTone">
              <option>Suaves</option>
              <option>Directos</option>
              <option>Solo cierre del dia</option>
              <option>Varios al dia</option>
              <option>No quiero recordatorios todavia</option>
            </select>
          </section>

          <section class="onboarding-step">
            <p class="mini-label">Pregunta 8</p>
            <h2>Quiere trabajar algun ciclo?</h2>
            <select name="cycleFocus">
              <option value="none">No por ahora</option>
              <option value="tabaco">Tabaco</option>
              <option value="alcohol">Alcohol</option>
              <option value="redes">Redes sociales</option>
              <option value="pantalla">Pantalla nocturna</option>
              <option value="contenido">Contenido impulsivo</option>
              <option value="finanzas">Compras impulsivas</option>
              <option value="azucar">Azucar/comida ultraprocesada</option>
              <option value="otro">Otro</option>
            </select>
          </section>

          <section class="onboarding-step">
            <p class="mini-label">Pregunta 9</p>
            <h2>Estilo visual preferido</h2>
            <select name="avatarStyle">
              <option value="minimal">Minimal</option>
              <option value="nocturno">Nocturno</option>
              <option value="urbano">Urbano</option>
              <option value="punk">Punk</option>
              <option value="alternativo">Alternativo</option>
              <option value="claro">Claro</option>
              <option value="oscuro" selected>Oscuro</option>
            </select>
          </section>

          <section class="onboarding-step">
            <p class="mini-label">Pregunta 10</p>
            <h2>Avatar personal</h2>
            <p class="muted-copy">Seleccione un avatar para personalizar su experiencia.</p>
            <div class="avatar-grid">
              ${AVATAR_OPTIONS.map((avatar) => renderAvatarOption(avatar, profile.avatar)).join("")}
            </div>
            <input type="hidden" name="avatarVisual" value="${escapeHtml(profile.avatarVisual || "LV")}" />
          </section>

          <section class="onboarding-step">
            <p class="mini-label">Confirmacion</p>
            <h2>Habitos sugeridos</h2>
            <p class="muted-copy">Seleccione algunos ahora o deje que LifeXP sugiera una rutina segun sus respuestas.</p>
            <div class="starter-grid">
              ${starterTemplates.map(renderStarterHabit).join("")}
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
            Resumen semanal
            <select name="weeklySummaryPreference">${renderOptions(WEEKLY_SUMMARY_OPTIONS, profile.weeklySummaryPreference)}</select>
          </label>

          <input type="hidden" name="onboardingCompleted" value="true" />
          <div class="habit-actions">
            <button class="btn btn-primary" type="submit">Crear mi rutina</button>
            <button class="btn btn-secondary" type="button" data-action="skip-onboarding">Saltar onboarding</button>
          </div>
        </form>
      </section>
    </main>
  `;
}
