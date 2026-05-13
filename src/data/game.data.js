export const APP_META = {
  name: "LifeXP",
  tagline: "Habitos simples. Progreso visible. Todos los dias.",
};

export const AREA_IDS = ["bienestar", "enfoque", "salud", "descanso", "creatividad", "consumo"];
export const ATTRIBUTE_IDS = AREA_IDS;
export const AREAS = AREA_IDS.map((id) => ({ id, name: id }));
export const ATTRIBUTES = AREAS.map((area) => ({ id: area.id, nameEs: area.name }));
export const GAME_RULES = {};
export const LEVELS = [];
export const RANKS = [];
