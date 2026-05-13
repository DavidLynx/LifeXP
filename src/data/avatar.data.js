export const AVATAR_OPTIONS = [
  {
    id: "male-base",
    label: "Base masculina",
    group: "Base",
    src: "/assets/avatars/base/male_base.png",
  },
  {
    id: "female-base",
    label: "Base femenina",
    group: "Base",
    src: "/assets/avatars/base/female_base.png",
  },
  {
    id: "male-nocturne",
    label: "Estilo nocturno",
    group: "Masculino",
    src: "/assets/avatars/styles/male_nocturne.png",
  },
  {
    id: "female-nocturne",
    label: "Estilo nocturno",
    group: "Femenino",
    src: "/assets/avatars/styles/female_nocturne.png",
  },
  {
    id: "male-punk",
    label: "Estilo punk",
    group: "Masculino",
    src: "/assets/avatars/styles/male_punk.png",
  },
  {
    id: "female-punk",
    label: "Estilo punk",
    group: "Femenino",
    src: "/assets/avatars/styles/female_punk.png",
  },
  {
    id: "male-techwear",
    label: "Estilo urbano tecnico",
    group: "Masculino",
    src: "/assets/avatars/styles/male_techwear.png",
  },
  {
    id: "female-techwear",
    label: "Estilo urbano tecnico",
    group: "Femenino",
    src: "/assets/avatars/styles/female_techwear.png",
  },
];

export function getAvatarById(avatarId) {
  return AVATAR_OPTIONS.find((avatar) => avatar.id === avatarId) || null;
}

export function createEmptyLoadout() {
  return {};
}

export function getAvatarPreviewData(avatarId) {
  const avatar = getAvatarById(avatarId);
  return {
    label: avatar?.label || "Avatar personalizado",
    styledImage: avatar?.src || "",
    baseImage: avatar?.src || "",
    baseIcon: "LV",
  };
}

export function getItemSlot() {
  return null;
}

export const EQUIPMENT_SLOTS = [];
