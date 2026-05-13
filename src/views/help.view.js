const FAQ_ITEMS = [
  ["Que es LifeXP?", "LifeXP es una app gratuita para crear habitos, recibir recordatorios visuales, registrar avances y revisar progreso personal desde una experiencia mobile-first."],
  ["LifeXP es gratis?", "Si. Esta version esta pensada como una app gratuita y local."],
  ["Necesito crear cuenta?", "No. No hay login real en esta version."],
  ["Donde se guardan mis datos?", "Los datos se guardan en localStorage, dentro del navegador que esta usando."],
  ["Que diferencia hay entre habito y ciclo?", "Un habito es una accion que quiere repetir. Un ciclo es un patron que quiere reducir o controlar, como distracciones digitales, consumo o impulsos repetitivos."],
  ["Puedo crear habitos personalizados?", "Si. Puede crear habitos personalizados con categoria, frecuencia, meta, recordatorio, icono, color y nota."],
  ["Como funcionan los recordatorios?", "Cada habito puede tener una hora visible dentro de la app. Las notificaciones del navegador estan preparadas como mejora futura."],
  ["Que pasa si fallo un dia?", "No pasa nada grave. El progreso se mantiene visible y puede retomar con una accion pequena al dia siguiente."],
  ["Puedo usar LifeXP para reducir consumo o distracciones?", "Si. Puede crear planes de reduccion para higiene digital, consumo y control de impulsos con seguimiento simple y notas."],
  ["LifeXP reemplaza terapia o tratamiento profesional?", "No. LifeXP es una herramienta de organizacion, seguimiento y motivacion personal. No reemplaza terapia, diagnostico ni tratamiento profesional."],
  ["Funciona en celular?", "Si. La interfaz esta disenada primero para celular, con botones grandes, navegacion inferior y lectura clara."],
  ["Puedo exportar mis datos?", "Si. Desde Perfil puede exportar sus datos como JSON."],
];

const PROJECTS = [
  ["Dark Wallet", "Prototipo web interactivo con estetica digital, coleccionables y sistema de progresion visual.", "Web app / prototipo interactivo", "Demo", "#"],
  ["Neon Dice", "Experimento visual e interactivo alrededor de dados, azar, identidad grafica y experiencia mobile.", "Web app / sistema visual", "Prototipo", "#"],
  ["Nido Canino", "Sitio web y sistema de comunicacion para un centro de cuidado estructurado y bienestar animal.", "Landing / marca / servicios", "En desarrollo", "#"],
  ["Generador QR", "Herramienta web gratuita para crear codigos QR personalizados con diseno visual.", "Utilidad web", "Demo", "#"],
  ["Portafolio audiovisual", "Seleccion de proyectos de video, animacion, diseno visual y herramientas con IA.", "Portafolio creativo", "Editable", "#"],
];

export function renderHelpView() {
  return `
    <main class="view help-view">
      <section class="page-header compact-page-header">
        <img class="brand-logo help-logo" src="/assets/icons/lifexp_primary_logo.svg" alt="LifeXP" />
        <p class="eyebrow">Ayuda / FAQ</p>
        <h1>LifeXP sin complicarlo</h1>
        <p class="page-description">Respuestas claras sobre datos, habitos, rachas, reduccion de consumo y uso en celular.</p>
      </section>

      <section class="surface-panel faq-list">
        <h2>Preguntas frecuentes</h2>
        ${FAQ_ITEMS.map(([question, answer]) => `
          <details class="faq-item">
            <summary>${question}</summary>
            <p>${answer}</p>
          </details>
        `).join("")}
      </section>

      <section class="surface-panel brand-panel">
        <p class="eyebrow">Acerca de LifeXP</p>
        <h2>Prototipo viable creado por Links Visual Division</h2>
        <p>
          LifeXP es un prototipo viable de web app gratuita creado por Links Visual Division. Permite crear habitos,
          configurar recordatorios, registrar progreso, revisar logros, reducir ciclos y personalizar la experiencia con avatar.
        </p>
        <p>La interfaz esta preparada para evolucionar a PWA y app movil en una siguiente etapa.</p>
        <p><strong>Diseño y desarrollo:</strong> Juan David</p>
        <button class="btn btn-secondary" data-route="hoy">Volver a la app</button>
      </section>

      <section class="surface-panel">
        <p class="eyebrow">Portafolio</p>
        <h2>Otros proyectos de Links Visual Division</h2>
        <div class="project-grid">
          ${PROJECTS.map(([name, description, type, status, link]) => `
            <!-- Reemplazar con link real del proyecto -->
            <a class="project-card" href="${link}" aria-label="Ver proyecto ${name}">
              <strong>${name}</strong>
              <span>${description}</span>
              <small>${type}</small>
              <small>Estado: ${status}</small>
            </a>
          `).join("")}
        </div>
      </section>
    </main>
  `;
}
