export function renderNotFoundView() {
  return `
    <main class="view not-found-view">
      <section class="page-header">
        <p class="eyebrow">Ruta no encontrada</p>
        <h1>Esta seccion no existe</h1>
        <p class="page-description">Vuelve a Hoy para continuar usando LifeXP.</p>
      </section>

      <section class="panel surface-panel">
        <button class="btn btn-primary" data-route="hoy">Ir a Hoy</button>
      </section>
    </main>
  `;
}
