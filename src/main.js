import { initApp } from "./app.js";

document.addEventListener("DOMContentLoaded", () => {
  try {
    initApp();
  } catch (error) {
    console.error("Error al iniciar LifeXP:", error);
    renderFatalError(error);
  }
});

function renderFatalError(error) {
  const root = document.getElementById("app");
  if (!root) return;

  root.innerHTML = `
    <main class="fatal-error">
      <h1>No se pudo iniciar LifeXP</h1>
      <p>Revisa la consola del navegador para ver mas detalles.</p>
      <pre>${error?.message || error}</pre>
    </main>
  `;
}
