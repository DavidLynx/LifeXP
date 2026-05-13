export const HABIT_CATEGORIES = [
  { id: "salud", name: "Salud", color: "#36c58f", icon: "health" },
  { id: "movimiento", name: "Movimiento", color: "#f59e66", icon: "movement" },
  { id: "enfoque", name: "Enfoque", color: "#7aa7ff", icon: "focus" },
  { id: "descanso", name: "Descanso", color: "#6ee7d8", icon: "rest" },
  { id: "alimentacion", name: "Alimentacion", color: "#a3e635", icon: "food" },
  { id: "bienestar-mental", name: "Bienestar mental", color: "#c4a1ff", icon: "mind" },
  { id: "estudio", name: "Estudio", color: "#67e8f9", icon: "study" },
  { id: "creatividad", name: "Creatividad", color: "#f0abfc", icon: "creative" },
  { id: "finanzas", name: "Finanzas", color: "#86efac", icon: "finance" },
  { id: "orden", name: "Orden", color: "#cbd5e1", icon: "order" },
  { id: "reducir-consumo", name: "Reducir consumo", color: "#fda4af", icon: "reduce" },
  { id: "higiene-digital", name: "Higiene digital", color: "#a5b4fc", icon: "digital" },
];

export const HABIT_AREAS = HABIT_CATEGORIES;

export const MEASUREMENT_TYPES = {
  boolean: "Completar / no completar",
  counter: "Contador",
  numeric: "Meta numerica",
  timer: "Temporizador",
  reduce: "Reducir cantidad",
  mood: "Registro emocional",
};

export const HABIT_TYPES = MEASUREMENT_TYPES;

export const FREQUENCIES = {
  daily: "Diario",
  weekdays: "Lunes a viernes",
  weekends: "Fines de semana",
  weekly: "Semanal",
};

export const THEME_OPTIONS = [
  { id: "dark", name: "Oscuro elegante" },
  { id: "calm", name: "Calma" },
  { id: "light-ready", name: "Claro preparado" },
];

export const WEEKLY_SUMMARY_OPTIONS = [
  { id: "brief", name: "Breve" },
  { id: "balanced", name: "Balanceado" },
  { id: "detailed", name: "Detallado" },
];

export const MAIN_GOAL_OPTIONS = [
  "Crear habitos saludables",
  "Mejorar enfoque",
  "Hacer mas ejercicio",
  "Dormir mejor",
  "Reducir consumo",
  "Cuidar mi bienestar mental",
  "Organizar mi rutina",
  "Mejorar mi creatividad",
  "Reducir distracciones digitales",
  "Otro objetivo",
];

export const PROFESSIONAL_ICONS = [
  "health",
  "movement",
  "focus",
  "rest",
  "food",
  "mind",
  "study",
  "creative",
  "finance",
  "order",
  "reduce",
  "digital",
];

const template = (data) => ({
  frequency: "daily",
  reminderTime: "",
  target: 1,
  unit: "vez",
  measurementType: "boolean",
  note: "",
  ...data,
});

export const HABIT_TEMPLATES = [
  template({ name: "Tomar agua", category: "salud", measurementType: "counter", target: 3, unit: "vasos", reminderTime: "10:00", icon: "health", color: "#36c58f" }),
  template({ name: "Dormir 7 horas", category: "salud", measurementType: "numeric", target: 7, unit: "horas", reminderTime: "22:30", icon: "rest", color: "#6ee7d8" }),
  template({ name: "Tomar medicamento o suplemento", category: "salud", reminderTime: "08:00", icon: "health", color: "#36c58f" }),
  template({ name: "Comer fruta", category: "alimentacion", measurementType: "counter", target: 1, unit: "porcion", icon: "food", color: "#a3e635" }),
  template({ name: "Caminar al menos 15 minutos", category: "movimiento", measurementType: "timer", target: 15, unit: "min", icon: "movement", color: "#f59e66" }),
  template({ name: "Entrenar", category: "movimiento", measurementType: "timer", target: 30, unit: "min", icon: "movement", color: "#f59e66" }),
  template({ name: "Estirar", category: "movimiento", measurementType: "timer", target: 10, unit: "min", icon: "movement", color: "#f59e66" }),
  template({ name: "Hacer movilidad", category: "movimiento", measurementType: "timer", target: 8, unit: "min", icon: "movement", color: "#f59e66" }),
  template({ name: "Cardio suave", category: "movimiento", measurementType: "timer", target: 20, unit: "min", icon: "movement", color: "#f59e66" }),
  template({ name: "Leer 10 minutos", category: "enfoque", measurementType: "timer", target: 10, unit: "min", icon: "study", color: "#67e8f9" }),
  template({ name: "Estudiar", category: "estudio", measurementType: "timer", target: 25, unit: "min", icon: "study", color: "#67e8f9" }),
  template({ name: "Trabajar sin celular", category: "enfoque", measurementType: "timer", target: 25, unit: "min", icon: "focus", color: "#7aa7ff" }),
  template({ name: "Bloque de enfoque", category: "enfoque", measurementType: "timer", target: 25, unit: "min", reminderTime: "09:00", icon: "focus", color: "#7aa7ff" }),
  template({ name: "Planear el dia", category: "orden", reminderTime: "08:30", icon: "order", color: "#cbd5e1" }),
  template({ name: "No usar pantalla antes de dormir", category: "higiene-digital", reminderTime: "21:30", icon: "digital", color: "#a5b4fc" }),
  template({ name: "Respirar 2 minutos", category: "bienestar-mental", measurementType: "timer", target: 2, unit: "min", icon: "mind", color: "#c4a1ff" }),
  template({ name: "Preparar el dia siguiente", category: "orden", reminderTime: "21:00", icon: "order", color: "#cbd5e1" }),
  template({ name: "Registrar como me siento", category: "bienestar-mental", measurementType: "mood", icon: "mind", color: "#c4a1ff" }),
  template({ name: "Meditacion", category: "bienestar-mental", measurementType: "timer", target: 5, unit: "min", icon: "mind", color: "#c4a1ff" }),
  template({ name: "Salir al sol", category: "bienestar-mental", measurementType: "timer", target: 10, unit: "min", icon: "mind", color: "#c4a1ff" }),
  template({ name: "Escribir una nota del dia", category: "creatividad", icon: "creative", color: "#f0abfc" }),
  template({ name: "Dibujar", category: "creatividad", measurementType: "timer", target: 15, unit: "min", icon: "creative", color: "#f0abfc" }),
  template({ name: "Escribir", category: "creatividad", measurementType: "counter", target: 1, unit: "avance", icon: "creative", color: "#f0abfc" }),
  template({ name: "Editar video", category: "creatividad", measurementType: "timer", target: 30, unit: "min", icon: "creative", color: "#f0abfc" }),
  template({ name: "Practicar musica", category: "creatividad", measurementType: "timer", target: 20, unit: "min", icon: "creative", color: "#f0abfc" }),
  template({ name: "Crear una idea diaria", category: "creatividad", icon: "creative", color: "#f0abfc" }),
  template({ name: "Tender la cama", category: "orden", icon: "order", color: "#cbd5e1" }),
  template({ name: "Ordenar escritorio", category: "orden", measurementType: "timer", target: 10, unit: "min", icon: "order", color: "#cbd5e1" }),
  template({ name: "Limpiar una zona", category: "orden", measurementType: "timer", target: 15, unit: "min", icon: "order", color: "#cbd5e1" }),
  template({ name: "Revisar pendientes", category: "orden", icon: "order", color: "#cbd5e1" }),
  template({ name: "Registrar gastos", category: "finanzas", icon: "finance", color: "#86efac" }),
  template({ name: "Ahorrar una cantidad", category: "finanzas", measurementType: "numeric", target: 1, unit: "meta", icon: "finance", color: "#86efac" }),
  template({ name: "Evitar compra impulsiva", category: "finanzas", measurementType: "reduce", target: 0, unit: "compras", icon: "finance", color: "#86efac" }),
  template({ name: "Revisar presupuesto", category: "finanzas", frequency: "weekly", icon: "finance", color: "#86efac" }),
  template({ name: "Reducir redes sociales", category: "higiene-digital", measurementType: "timer", target: 30, unit: "min max", icon: "digital", color: "#a5b4fc" }),
  template({ name: "Evitar contenido impulsivo", category: "higiene-digital", measurementType: "reduce", target: 0, unit: "sesiones", icon: "digital", color: "#a5b4fc" }),
  template({ name: "No usar celular al despertar", category: "higiene-digital", icon: "digital", color: "#a5b4fc" }),
  template({ name: "Limitar pantalla nocturna", category: "higiene-digital", measurementType: "timer", target: 30, unit: "min max", icon: "digital", color: "#a5b4fc" }),
  template({ name: "Bloque de desconexion", category: "higiene-digital", measurementType: "timer", target: 30, unit: "min", icon: "digital", color: "#a5b4fc" }),
  template({ name: "Reducir tabaco", category: "reducir-consumo", measurementType: "reduce", target: 0, unit: "cigarrillos", icon: "reduce", color: "#fda4af" }),
  template({ name: "Reducir alcohol", category: "reducir-consumo", measurementType: "reduce", target: 0, unit: "bebidas", icon: "reduce", color: "#fda4af" }),
  template({ name: "Reducir azucar", category: "reducir-consumo", measurementType: "reduce", target: 1, unit: "porciones max", icon: "reduce", color: "#fda4af" }),
  template({ name: "Reducir cafeina", category: "reducir-consumo", measurementType: "reduce", target: 2, unit: "tazas max", icon: "reduce", color: "#fda4af" }),
  template({ name: "Reducir comida ultraprocesada", category: "reducir-consumo", measurementType: "reduce", target: 1, unit: "porciones max", icon: "reduce", color: "#fda4af" }),
];

export const REDUCTION_PLAN_TYPES = [
  {
    id: "tabaco",
    label: "Tabaco",
    defaultUnit: "cigarrillos",
    questions: ["consumo actual diario", "meta", "tiempo", "momentos de mayor consumo"],
    triggers: ["Manana", "Despues de comer", "Estres", "Social", "Noche", "Otro"],
  },
  {
    id: "alcohol",
    label: "Cuidar consumo social",
    defaultUnit: "bebidas",
    questions: ["dias por semana", "cantidad habitual", "meta", "situaciones activadoras"],
    triggers: ["Reuniones sociales", "Estres", "Aburrimiento", "Fin de semana", "Otro"],
  },
  {
    id: "digital",
    label: "Higiene digital",
    defaultUnit: "impulsos",
    questions: ["que quiere reducir", "momento frecuente", "meta"],
    triggers: ["Al despertar", "Noche", "Cuando estoy solo", "Estres", "Aburrimiento", "Otro"],
  },
];

export const DEFAULT_HABITS = [
  HABIT_TEMPLATES[0],
  HABIT_TEMPLATES[12],
  HABIT_TEMPLATES[17],
  HABIT_TEMPLATES[36],
].map((habit, index) => ({
  id: `habit-default-${index + 1}`,
  ...habit,
  active: true,
  createdAt: "2026-01-01T00:00:00.000Z",
}));
