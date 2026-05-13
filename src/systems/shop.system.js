import { shopItems } from "../data/shop.data.js";

export function getBits(state) {
  return Number(state.bits ?? state.credits ?? 100);
}

export function getShopItem(itemId) {
  return shopItems.find((candidate) => candidate.id === itemId) || null;
}

export function getShopItems(state) {
  const ownedItems = new Set(state.ownedItems || []);
  const equippedItems = state.equippedItems || {};

  return shopItems.map((item) => ({
    ...item,
    status: equippedItems[item.slot] === item.id ? "equipped" : ownedItems.has(item.id) ? "owned" : "locked",
  }));
}

export function getOwnedShopItems(state) {
  const ownedItems = new Set(state.ownedItems || []);
  return getShopItems(state).filter((item) => ownedItems.has(item.id));
}

export function getLocalizedShopItem(item, language = "es") {
  return {
    name: item?.name?.[language] || item?.name?.es || item?.id || "",
    description: item?.description?.[language] || item?.description?.es || "",
  };
}

function rewardKey({ reason, dateKey, habitId }) {
  return [reason, dateKey || "any", habitId || "global"].join(":");
}

export function hasReward(state, payload) {
  const key = rewardKey(payload);
  return (state.rewardHistory || []).some((reward) => reward.key === key);
}

export function addBits(state, amount, payload = {}) {
  const nextState = structuredClone(state);
  const key = rewardKey(payload);

  nextState.rewardHistory = Array.isArray(nextState.rewardHistory) ? nextState.rewardHistory : [];
  if (nextState.rewardHistory.some((reward) => reward.key === key)) {
    return { state: nextState, awarded: 0, skipped: true };
  }

  const bits = Math.max(0, getBits(nextState) + Number(amount || 0));
  const reward = {
    id: `reward-${Date.now()}-${nextState.rewardHistory.length}`,
    key,
    amount: Number(amount || 0),
    reason: payload.reason || "manual",
    habitId: payload.habitId || "",
    date: payload.dateKey || "",
    createdAt: new Date().toISOString(),
  };

  nextState.bits = bits;
  nextState.credits = bits;
  nextState.rewardHistory.unshift(reward);
  nextState.logs.unshift({
    id: `log-${Date.now()}-bits`,
    type: "bits-earned",
    amount: reward.amount,
    reason: reward.reason,
    habitId: reward.habitId,
    dateKey: reward.date,
    createdAt: reward.createdAt,
  });

  return { state: nextState, awarded: reward.amount, skipped: false };
}

export function buyShopItem(state, itemId) {
  const item = getShopItem(itemId);
  if (!item) return { ok: false, error: "not-found", state };
  if ((state.ownedItems || []).includes(item.id)) return { ok: false, error: "owned", item, state };

  const currentBits = getBits(state);
  if (currentBits < item.price) {
    return { ok: false, error: "insufficient", missingBits: item.price - currentBits, item, state };
  }

  const nextState = structuredClone(state);
  nextState.bits = currentBits - item.price;
  nextState.credits = nextState.bits;
  nextState.ownedItems = [...new Set([...(nextState.ownedItems || []), item.id])];
  nextState.equippedItems = {
    ...(nextState.equippedItems || {}),
    [item.slot]: item.id,
  };
  nextState.shopPurchases = Array.isArray(nextState.shopPurchases) ? nextState.shopPurchases : [];
  nextState.shopPurchases.unshift({
    id: `purchase-${Date.now()}-${item.id}`,
    itemId: item.id,
    price: item.price,
    date: new Date().toISOString().slice(0, 10),
    createdAt: new Date().toISOString(),
  });
  nextState.logs.unshift({
    id: `log-${Date.now()}-${item.id}`,
    type: "shop-item-bought",
    itemId: item.id,
    price: item.price,
    createdAt: new Date().toISOString(),
  });

  return { ok: true, item, state: nextState };
}

export function equipShopItem(state, itemId) {
  const item = getShopItem(itemId);
  if (!item) return { ok: false, error: "not-found", state };
  if (!(state.ownedItems || []).includes(item.id)) return { ok: false, error: "locked", item, state };

  const nextState = structuredClone(state);
  nextState.equippedItems = {
    ...(nextState.equippedItems || {}),
    [item.slot]: item.id,
  };
  nextState.logs.unshift({
    id: `log-${Date.now()}-${item.id}`,
    type: "shop-item-equipped",
    itemId: item.id,
    createdAt: new Date().toISOString(),
  });

  return { ok: true, item, state: nextState };
}

export function unlockTheme(state) {
  return { ok: false, error: "Funcion no disponible en esta version.", state };
}

export function applyTheme(state) {
  return { ok: false, error: "Funcion no disponible en esta version.", state };
}
