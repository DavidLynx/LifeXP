export const shopItems = [
  {
    id: "glasses",
    key: "glasses",
    price: 60,
    image: "/assets/shop/glasses.png",
    category: "accessory",
    rarity: "basic",
    slot: "face",
  },
  {
    id: "hoodie_basic",
    key: "hoodie_basic",
    price: 90,
    image: "/assets/shop/hoodie_basic.png",
    category: "clothing",
    rarity: "basic",
    slot: "outfit",
  },
  {
    id: "backpack",
    key: "backpack",
    price: 120,
    image: "/assets/shop/backpack.png",
    category: "gear",
    rarity: "standard",
    slot: "back",
  },
  {
    id: "backpack2",
    key: "backpack2",
    price: 145,
    image: "/assets/shop/backpack2.png",
    category: "gear",
    rarity: "standard",
    slot: "back",
  },
  {
    id: "skate",
    key: "skate",
    price: 180,
    image: "/assets/shop/skate.png",
    category: "gear",
    rarity: "rare",
    slot: "prop",
  },
  {
    id: "jacket_black",
    key: "jacket_black",
    price: 230,
    image: "/assets/shop/jacket_black.png",
    category: "clothing",
    rarity: "rare",
    slot: "outfit",
  },
  {
    id: "vr_glasses",
    key: "vr_glasses",
    price: 320,
    image: "/assets/shop/vr_glasses.png",
    category: "premium",
    rarity: "legendary",
    slot: "face",
  },
];

export const SHOP_ITEMS = shopItems;

export const SHOP_GROUPS = {
  accessory: shopItems.filter((item) => item.category === "accessory"),
  clothing: shopItems.filter((item) => item.category === "clothing"),
  gear: shopItems.filter((item) => item.category === "gear"),
  premium: shopItems.filter((item) => item.category === "premium"),
};
