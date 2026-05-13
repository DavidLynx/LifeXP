import { t } from "../i18n.js";
import { escapeHtml, renderBrandMark } from "./view.helpers.js";

const FAQ_ITEMS = [
  ["¿Qué es LifeXP?", "LifeXP es una app gratuita para crear hábitos, recibir recordatorios visuales, registrar avances y revisar progreso personal desde una experiencia mobile-first."],
  ["¿LifeXP es gratis?", "Sí. Esta versión está pensada como una app gratuita y local."],
  ["¿Necesito crear cuenta?", "No. No hay login real en esta versión."],
  ["¿Dónde se guardan mis datos?", "Los datos se guardan en localStorage, dentro del navegador que estás usando."],
  ["¿Puedo exportar mis datos?", "Sí. Desde Perfil puedes exportar tus datos como JSON."],
];

export const portfolioProjects = [
  {
    name: "Neon Dice RPG",
    description: "RPG visual con dados, estética neón y experiencia mobile-first.",
    type: "Game / RPG prototype",
    url: "https://neon-dice-rpg.vercel.app/",
  },
  {
    name: "DarkWallet",
    description: "Prototipo financiero oscuro con interfaz digital y progresión visual.",
    type: "Web app prototype",
    url: "https://darkwallet.vercel.app/",
  },
  {
    name: "QR Studio Generator",
    description: "Herramienta web para generar códigos QR personalizados.",
    type: "Utility web app",
    url: "https://qrstudio-generator.vercel.app/",
  },
  {
    name: "Social Comment Generator",
    description: "Generador de comentarios sociales para flujos creativos rápidos.",
    type: "AI / content utility",
    url: "https://social-comment-generator.vercel.app/",
  },
  {
    name: "My Astrology App",
    description: "Experiencia astrológica web con lectura clara y visual.",
    type: "Lifestyle web app",
    url: "https://my-astrology-app.vercel.app/",
  },
  {
    name: "Radar Ventas Digital",
    description: "Panel simple para lectura y seguimiento comercial digital.",
    type: "Sales dashboard",
    url: "https://radar-ventas-digital.vercel.app/",
  },
  {
    name: "Próximo proyecto",
    description: "Placeholder claro para reemplazar cuando exista un enlace público.",
    type: "Placeholder",
    url: "",
  },
];

export function renderHelpView(state = {}) {
  return `
    <main class="view help-view">
      <section class="page-header compact-page-header">
        ${renderBrandMark(state, { variant: "primary_logo", className: "brand-logo help-logo" })}
        <p class="eyebrow">${t(state, "help.eyebrow")}</p>
        <h1>${t(state, "help.title")}</h1>
        <p class="page-description">${t(state, "help.description")}</p>
      </section>

      <section class="surface-panel faq-list">
        <h2>FAQ</h2>
        ${FAQ_ITEMS.map(([question, answer]) => `
          <details class="faq-item">
            <summary>${escapeHtml(question)}</summary>
            <p>${escapeHtml(answer)}</p>
          </details>
        `).join("")}
      </section>

      <section class="surface-panel brand-panel">
        <p class="eyebrow">${t(state, "app.about")}</p>
        <h2>${t(state, "help.aboutTitle")}</h2>
        <p>${t(state, "help.aboutCopy")}</p>
        <p>${t(state, "help.pwa")}</p>
        <p><strong>${t(state, "app.footerCredit")}</strong></p>
        <button class="btn btn-secondary" data-route="hoy">${t(state, "help.back")}</button>
      </section>

      <section class="surface-panel">
        <p class="eyebrow">${t(state, "help.portfolioEyebrow")}</p>
        <h2>${t(state, "help.portfolioTitle")}</h2>
        <div class="project-grid portfolio-grid">
          ${portfolioProjects.map((project) => `
            <article class="project-card portfolio-card">
              <strong>${escapeHtml(project.name)}</strong>
              <span>${escapeHtml(project.description)}</span>
              <small>${escapeHtml(project.type)}</small>
              ${
                project.url
                  ? `<a class="btn btn-secondary project-link" href="${project.url}" target="_blank" rel="noopener noreferrer">${t(state, "common.openProject")}</a>`
                  : `<button class="btn btn-secondary project-link" type="button" disabled>${t(state, "common.replaceLink")}</button>`
              }
            </article>
          `).join("")}
        </div>
      </section>
    </main>
  `;
}
