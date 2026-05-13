import {
  FREQUENCIES,
  HABIT_CATEGORIES,
  HABIT_TEMPLATES,
  MEASUREMENT_TYPES,
  PROFESSIONAL_ICONS,
  REDUCTION_PLAN_TYPES,
} from "../data/habits.data.js";
import { escapeHtml, getActiveHabits, getCategory, getFrequencyLabel, getTypeLabel, renderIcon } from "./view.helpers.js";

function renderOptions(items, selected = "", valueKey = "id", labelKey = "name") {
  return items
    .map((item) => {
      const value = item[valueKey];
      return `<option value="${value}" ${value === selected ? "selected" : ""}>${item[labelKey]}</option>`;
    })
    .join("");
}

function renderEnumOptions(map, selected = "") {
  return Object.entries(map)
    .map(([value, label]) => `<option value="${value}" ${value === selected ? "selected" : ""}>${label}</option>`)
    .join("");
}

function renderHabitForm(habit = null) {
  const action = habit ? "edit-habit" : "add-habit";
  const title = habit ? "Editar habito" : "Crear nuevo habito";

  return `
    <details ${habit ? "" : 'id="crear-habito"'} class="form-panel habit-editor" ${habit ? "open" : ""}>
      <summary>${title}</summary>
      <form class="habit-form" data-action="${action}" ${habit ? `data-habit-id="${habit.id}"` : ""}>
        <label>
          Nombre
          <input name="name" type="text" value="${escapeHtml(habit?.name || "")}" placeholder="Ej. Caminar 20 minutos" required />
        </label>

        <div class="form-row">
          <label>
            Categoria
            <select name="category">${renderOptions(HABIT_CATEGORIES, habit?.category)}</select>
          </label>
          <label>
            Tipo de medicion
            <select name="measurementType">${renderEnumOptions(MEASUREMENT_TYPES, habit?.measurementType)}</select>
          </label>
        </div>

        <div class="form-row">
          <label>
            Frecuencia
            <select name="frequency">${renderEnumOptions(FREQUENCIES, habit?.frequency || "daily")}</select>
          </label>
          <label>
            Hora de recordatorio
            <input name="reminderTime" type="time" value="${escapeHtml(habit?.reminderTime || "")}" />
          </label>
        </div>

        <div class="form-row">
          <label>
            Meta
            <input name="target" type="number" min="0" value="${habit?.target ?? 1}" />
          </label>
          <label>
            Unidad
            <input name="unit" type="text" value="${escapeHtml(habit?.unit || "vez")}" />
          </label>
        </div>

        <div class="form-row">
          <label>
            Icono visual
            <select name="icon">${PROFESSIONAL_ICONS.map((icon) => `<option value="${icon}" ${icon === habit?.icon ? "selected" : ""}>${icon}</option>`).join("")}</select>
          </label>
          <label>
            Color
            <input name="color" type="color" value="${habit?.color || "#0f766e"}" />
          </label>
        </div>

        <label>
          Nota
          <input name="note" type="text" value="${escapeHtml(habit?.note || "")}" placeholder="Por que importa" />
        </label>

        <button class="btn btn-primary" type="submit">${habit ? "Guardar cambios" : "Agregar habito"}</button>
      </form>
    </details>
  `;
}

function renderDeleteConfirmation(habit, isPending) {
  if (!isPending) return "";

  return `
    <div class="confirm-panel">
      <strong>Eliminar "${escapeHtml(habit.name)}"?</strong>
      <p>Tambien se quitaran sus registros locales. Esta accion no se puede deshacer.</p>
      <div class="habit-actions">
        <button class="btn btn-danger" data-action="confirm-delete-habit" data-habit-id="${habit.id}">Si, eliminar</button>
        <button class="btn btn-secondary" data-action="cancel-delete-habit">Cancelar</button>
      </div>
    </div>
  `;
}

function renderHabitManageCard(habit, state, options = {}) {
  const category = getCategory(habit.category);
  const isPendingDelete = options.pendingDeleteHabitId === habit.id;

  return `
    <article class="habit-card manage-card">
      <div class="habit-card-main">
        <span class="habit-icon" style="--area-color:${habit.color || category.color}">${renderIcon(habit.icon || category.icon)}</span>
        <div>
          <p class="mini-label">${escapeHtml(category.name)} - ${escapeHtml(getTypeLabel(habit.measurementType))}</p>
          <h3>${escapeHtml(habit.name)}</h3>
          <p>${escapeHtml(getFrequencyLabel(habit.frequency))} - meta ${habit.target} ${escapeHtml(habit.unit)} - ${habit.reminderTime || "sin hora"}</p>
        </div>
      </div>

      ${renderHabitForm(habit)}

      <div class="habit-actions">
        <button class="btn btn-secondary" data-action="toggle-habit" data-habit-id="${habit.id}" data-active="${habit.active ? "false" : "true"}">
          ${habit.active ? "Pausar" : "Reactivar"}
        </button>
        <button class="btn btn-danger" data-action="request-delete-habit" data-habit-id="${habit.id}">Eliminar</button>
      </div>
      ${renderDeleteConfirmation(habit, isPendingDelete)}
    </article>
  `;
}

function renderTemplate(template, index) {
  const category = getCategory(template.category);
  return `
    <button class="template-card" data-action="use-template" data-template-index="${index}" type="button">
      <span class="habit-icon template-icon" style="--area-color:${template.color || category.color}">${renderIcon(template.icon || category.icon)}</span>
      <strong>${escapeHtml(template.name)}</strong>
      <span>${escapeHtml(category.name)} - ${escapeHtml(getTypeLabel(template.measurementType))}</span>
      <small>Meta sugerida: ${template.target} ${escapeHtml(template.unit)} - ${escapeHtml(getFrequencyLabel(template.frequency))}</small>
      <span class="template-action">Agregar a mi rutina</span>
    </button>
  `;
}

function renderUsagePaths() {
  return `
    <section class="choice-grid" aria-label="Tipos de seguimiento">
      <article class="flow-card">
        <span class="inline-icon">${renderIcon("check")}</span>
        <div>
          <p class="eyebrow">Crear habitos</p>
          <h2>Acciones que quiere repetir</h2>
          <p>Un habito es una accion que quiere sostener: tomar agua, leer, entrenar, dormir mejor o estudiar.</p>
        </div>
        <a class="btn btn-primary" href="#crear-habito">Crear habito</a>
      </article>
      <article class="flow-card calm-card">
        <span class="inline-icon">${renderIcon("reduce")}</span>
        <div>
          <p class="eyebrow">Romper ciclos</p>
          <h2>Patrones que quiere reducir</h2>
          <p>Un ciclo es un patron que quiere observar y controlar: consumo, distracciones digitales, pantalla o impulsos repetitivos.</p>
        </div>
        <a class="btn btn-secondary" href="#crear-plan-reduccion">Crear plan de reduccion</a>
      </article>
    </section>
  `;
}

function renderReductionPlanForm() {
  return `
    <section id="crear-plan-reduccion" class="surface-panel reduction-panel">
      <div class="section-head inline">
        <div>
          <p class="eyebrow">Romper ciclos</p>
          <h2>Crear plan de reduccion</h2>
        </div>
      </div>
      <p class="muted-copy">
        LifeXP es una herramienta de organizacion, seguimiento y motivacion personal. No reemplaza terapia, diagnostico ni tratamiento profesional.
      </p>
      <form class="habit-form" data-action="create-reduction-plan">
        <div class="form-row">
          <label>
            Tipo de plan
            <select name="type">
              ${REDUCTION_PLAN_TYPES.map((plan) => `<option value="${plan.id}">${plan.label}</option>`).join("")}
            </select>
          </label>
          <label>
            Nombre visible
            <input name="label" type="text" placeholder="Ej. Reducir pantalla nocturna" />
          </label>
        </div>
        <div class="form-row">
          <label>
            Cantidad actual
            <input name="currentAmount" type="number" min="0" step="1" value="5" />
          </label>
          <label>
            Meta
            <input name="targetAmount" type="number" min="0" step="1" value="2" />
          </label>
        </div>
        <div class="form-row">
          <label>
            Tiempo
            <select name="timeframe">
              <option value="7 dias">7 dias</option>
              <option value="14 dias">14 dias</option>
              <option value="30 dias" selected>30 dias</option>
              <option value="personalizado">Personalizado</option>
            </select>
          </label>
          <label>
            Momentos o detonantes
            <input name="triggers" type="text" placeholder="Noche, estres, aburrimiento" />
          </label>
        </div>
        <button class="btn btn-primary" type="submit">Crear plan guiado</button>
      </form>
    </section>
  `;
}

function renderReductionPlans(state) {
  const plans = state.reductionPlans || [];
  if (!plans.length) return "";

  return `
    <section class="surface-panel">
      <div class="section-head inline">
        <div>
          <p class="eyebrow">Planes activos</p>
          <h2>Reduccion y control de impulsos</h2>
        </div>
      </div>
      <div class="mini-list">
        ${plans.map((plan) => `
          <div class="mini-row">
            <span class="inline-icon">${renderIcon(plan.type === "digital" ? "digital" : "reduce")}</span>
            <strong>${escapeHtml(plan.label)}</strong>
            <span>Meta diaria: ${plan.dailyTarget}</span>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

export function renderHabitsView(state, options = {}) {
  const active = getActiveHabits(state);
  const paused = (state.habits || []).filter((habit) => !habit.active);
  const hasEverCreated = (state.logs || []).some((log) => log.type === "habit-created");
  const recommendedTemplates = HABIT_TEMPLATES.slice(0, 12);
  const quickTemplates = HABIT_TEMPLATES.slice(12);

  return `
    <main class="view habits-view">
      <div class="dashboard-column main-column">
        <section class="page-header compact-page-header">
          <img class="brand-wordmark" src="/assets/icons/lifexp_wordmark.svg" alt="LifeXP" />
          <p class="eyebrow">Habitos</p>
          <h1>Mi rutina actual</h1>
          <p class="page-description">Estos son los habitos que forman parte de su seguimiento diario.</p>
        </section>

        ${hasEverCreated ? `
          <section class="state-banner success-state">
            Plantilla agregada a su rutina. Puede editarla, pausarla o cambiar su recordatorio.
          </section>
        ` : ""}

        <section class="section-head compact-head">
          <div>
            <p class="eyebrow">Activos</p>
            <h2>${active.length} habitos</h2>
          </div>
        </section>

        <section class="habit-list routine-list">
          ${
            active.length
              ? HABIT_CATEGORIES.map((category) => {
                  const byCategory = active.filter((habit) => habit.category === category.id);
                  if (!byCategory.length) return "";
                  return `
                    <section class="category-group">
                      <h3>${escapeHtml(category.name)}</h3>
                      ${byCategory.map((habit) => renderHabitManageCard(habit, state, options)).join("")}
                    </section>
                  `;
                }).join("")
              : `
            <article class="empty-card strong-empty">
              <span class="empty-illustration">${renderIcon("check")}</span>
              <h3>Todavia no tiene habitos activos.</h3>
              <p>Empiece con una plantilla o cree un habito personalizado. Puede editarlo despues.</p>
              <div class="habit-actions">
                <a class="btn btn-primary" href="#plantillas-recomendadas">Agregar desde plantilla</a>
                <a class="btn btn-secondary" href="#crear-habito">Crear habito personalizado</a>
                <a class="btn btn-secondary" href="#crear-plan-reduccion">Crear plan de reduccion</a>
              </div>
            </article>
          `}
        </section>

        <section class="section-head compact-head">
          <div>
            <p class="eyebrow">Pausados</p>
            <h2>${paused.length} habitos</h2>
          </div>
        </section>

        <section class="habit-list">
          ${paused.map((habit) => renderHabitManageCard(habit, state, options)).join("") || `<p class="empty-state">No hay habitos pausados.</p>`}
        </section>
      </div>

      <aside class="dashboard-column side-column">
        <section class="surface-panel">
          <div class="section-head inline">
            <div>
              <p class="eyebrow">Crear nuevo</p>
              <h2>Habito o ciclo</h2>
            </div>
          </div>
          ${renderUsagePaths()}
        </section>

        ${renderHabitForm()}
        ${renderReductionPlanForm()}
        ${renderReductionPlans(state)}

        <section id="plantillas-recomendadas" class="surface-panel">
          <div class="section-head inline">
            <div>
              <p class="eyebrow">Plantillas</p>
              <h2>Plantillas recomendadas</h2>
              <p>Agregue una plantilla a su rutina y editela cuando quiera.</p>
            </div>
          </div>
          <div class="template-grid">
            ${recommendedTemplates.map(renderTemplate).join("")}
          </div>
        </section>

        <section class="surface-panel">
          <div class="section-head inline">
            <div>
              <p class="eyebrow">Ideas</p>
              <h2>Sugerencias rapidas</h2>
              <p>Ideas simples para empezar si no sabe que agregar.</p>
            </div>
          </div>
          <div class="template-grid compact-template-grid">
            ${quickTemplates.map((template, index) => renderTemplate(template, index + recommendedTemplates.length)).join("")}
          </div>
        </section>
      </aside>
    </main>
  `;
}

