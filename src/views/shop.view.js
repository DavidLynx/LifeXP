import { t } from "../i18n.js";
import { getBits, getLocalizedShopItem, getOwnedShopItems, getShopItems } from "../systems/shop.system.js";
import { escapeHtml, renderIcon } from "./view.helpers.js";

function itemLabel(item, state) {
  return getLocalizedShopItem(
    {
      ...item,
      name: {
        es: t({ language: "es" }, `shopItems.${item.key}.name`),
        en: t({ language: "en" }, `shopItems.${item.key}.name`),
      },
      description: {
        es: t({ language: "es" }, `shopItems.${item.key}.description`),
        en: t({ language: "en" }, `shopItems.${item.key}.description`),
      },
    },
    state.language || "es"
  );
}

function rarityLabel(item) {
  return item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1);
}

function itemAction(item, state) {
  if (item.status === "equipped") {
    return `<button class="btn btn-secondary" type="button" disabled>${t(state, "common.equippedAction")}</button>`;
  }
  if (item.status === "owned") {
    return `<button class="btn btn-secondary" type="button" disabled>${t(state, "common.ownedAction")}</button>`;
  }
  return `<button class="btn btn-primary" data-action="buy-shop-item" data-item-id="${item.id}" type="button">${t(state, "common.buy")}</button>`;
}

export function renderInventorySection(state, compact = false) {
  const items = getOwnedShopItems(state);
  if (!items.length) {
    return `
      <section class="surface-panel inventory-panel">
        <p class="eyebrow">${t(state, "profile.inventoryTitle")}</p>
        <p class="empty-state">${t(state, "profile.inventoryEmpty")}</p>
        <button class="btn btn-secondary" data-route="tienda" type="button">${t(state, "nav.shop")}</button>
      </section>
    `;
  }

  return `
    <section class="surface-panel inventory-panel">
      <div class="section-head inline">
        <div>
          <p class="eyebrow">${t(state, "profile.inventoryTitle")}</p>
          <h2>${items.length} ${t(state, "shop.ownedItems")}</h2>
        </div>
        ${compact ? "" : `<button class="btn btn-secondary" data-route="tienda" type="button">${t(state, "nav.shop")}</button>`}
      </div>
      <div class="inventory-grid">
        ${items.map((item) => {
          const label = itemLabel(item, state);
          return `
            <article class="inventory-item rarity-${item.rarity}">
              <img src="${item.image}" alt="${escapeHtml(label.name)}" loading="lazy" />
              <div>
                <strong>${escapeHtml(label.name)}</strong>
                <span>${rarityLabel(item)}</span>
              </div>
              ${
                item.status === "equipped"
                  ? `<small class="inventory-state">${t(state, "common.equipped")}</small>`
                  : `<button class="btn btn-secondary compact-btn" data-action="equip-shop-item" data-item-id="${item.id}" type="button">${t(state, "common.equip")}</button>`
              }
            </article>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

export function renderShopView(state) {
  const items = getShopItems(state);
  const ownedCount = (state.ownedItems || []).length;
  const equippedCount = Object.keys(state.equippedItems || {}).length;

  return `
    <main class="view shop-view">
      <div class="dashboard-column main-column">
        <section class="page-header compact-page-header shop-header">
          <img class="brand-wordmark" src="/assets/icons/lifexp_wordmark.svg" alt="LifeXP" />
          <p class="eyebrow">${t(state, "shop.eyebrow")}</p>
          <h1>${t(state, "shop.title")}</h1>
          <p class="page-description">${t(state, "shop.description")}</p>
        </section>

        <section class="summary-grid shop-summary">
          <article class="summary-tile credit-tile"><span>${t(state, "shop.balance")}</span><strong>${getBits(state)}</strong><small>Bits</small></article>
          <article class="summary-tile"><span>${t(state, "shop.inventory")}</span><strong>${ownedCount}</strong><small>${t(state, "shop.ownedItems")}</small></article>
          <article class="summary-tile"><span>${t(state, "common.equipped")}</span><strong>${equippedCount}</strong><small>${t(state, "shop.equippedItems")}</small></article>
        </section>

        <section class="shop-grid">
          ${items.map((item) => {
            const label = itemLabel(item, state);
            return `
              <article class="shop-card ${item.status} rarity-${item.rarity}">
                <div class="shop-media">
                  <img src="${item.image}" alt="${escapeHtml(label.name)}" loading="lazy" />
                </div>
                <div class="shop-card-body">
                  <span class="shop-status">${renderIcon(item.status === "equipped" ? "spark" : item.status === "owned" ? "shield" : "shop")} ${item.status === "owned" ? t(state, "common.inInventory") : t(state, `common.${item.status}`)}</span>
                  <h2>${escapeHtml(label.name)}</h2>
                  <p>${escapeHtml(label.description)}</p>
                  <div class="shop-price">
                    <strong>${item.price}</strong>
                    <span>Bits</span>
                  </div>
                  <small class="rarity-chip">${rarityLabel(item)}</small>
                  ${itemAction(item, state)}
                </div>
              </article>
            `;
          }).join("")}
        </section>
      </div>

      <aside class="dashboard-column side-column">
        <section class="surface-panel">
          <div class="section-head inline">
            <div>
              <p class="eyebrow">${t(state, "shop.howEarn")}</p>
              <h2>${getBits(state)} Bits</h2>
            </div>
          </div>
          <div class="mini-list">
            <div class="mini-row"><span class="inline-icon">${renderIcon("check")}</span><strong>${t(state, "shop.earnHabit")}</strong></div>
            <div class="mini-row"><span class="inline-icon">${renderIcon("mind")}</span><strong>${t(state, "shop.earnCheckin")}</strong></div>
            <div class="mini-row"><span class="inline-icon">${renderIcon("flame")}</span><strong>${t(state, "shop.earnStreak")}</strong></div>
          </div>
        </section>
        ${renderInventorySection(state, true)}
      </aside>
    </main>
  `;
}
