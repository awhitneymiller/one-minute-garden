// src/data/plants.js

import { ca } from "date-fns/locale";

// Defines all plant types with their costs, rarities, and unique growth recipes.
export const allPlants = [
  {
    id: "pink-flower",
    name: "Pink Flower",
    image: "src/assets/plants/flower4_pink.png",
    cost: 5,
    sellValue: 10,
    rarity: "common",
    availableBiomes: ["meadow"],
    // Recipe: seed→sprout→growing→bloom
    growthRecipe: [
      { action: "water", minAccuracy: "normal" },    // Seed → Sprout
      { action: "fertilize", type: "standard" },    // Sprout → Growing
      { action: "weather", condition: "Sunny" },    // Growing → Pre-Bloom
      { action: "fertilize", type: "standard" }      // Pre-Bloom → Bloom
    ]
  },
  {
    id: "blue-flower",
    name: "Blue Flower",
    image: "src/assets/plants/flower3_blue.png",
    cost: 5,
    sellValue: 10,
    rarity: "common",
    availableBiomes: ["meadow"],
    growthRecipe: [
      { action: "water", minAccuracy: "normal" },   // Seed → Sprout
      { action: "fertilize", type: "standard" },    // Sprout → Growing
      { action: "weather", condition: "Rainy" },    // Growing → Pre-Bloom
      { action: "fertilize", type: "standard" }      // Pre-Bloom → Bloom
    ]
  },
  {
    id: "red-bush",
    name: "Red Bush",
    image: "src/assets/plants/bush2_red.png",
    cost: 12,
    sellValue: 15,
    rarity: "common",
    availableBiomes: ["meadow"],
    growthRecipe: [
      { action: "weather", condition: "Cloudy" },    // Seed → Sprout
      { action: "water", minAccuracy: "normal" },    // Sprout → Growing
      { action: "fertilize", type: "compost" },      // Growing → Pre-Bloom
      { action: "fertilize", type: "premium" }      // Pre-Bloom → Bloom
    ]
  },
  {
    id: "green-bush",
    name: "Green Bush",
    image: "src/assets/plants/bush1(noflowers)_green.png",
    cost: 12,
    sellValue: 15,
    rarity: "common",
    availableBiomes: ["meadow", "grove"],
    growthRecipe: [
      { action: "water", minAccuracy: "normal" },    // Seed → Sprout
      { action: "weather", condition: "Foggy" },     // Sprout → Growing
      { action: "fertilize", type: "standard" },    // Growing → Pre-Bloom
      { action: "fertilize", type: "premium" }      // Pre-Bloom → Bloom
    ]
  },
  {
    id: "yellow-daisy",
    name: "Yellow Daisy",
    image: "src/assets/plants/flower1_yellow.png",
    cost: 15,
    sellValue: 19,
    rarity: "uncommon",
    availableBiomes: ["meadow", "grove"],
    growthRecipe: [
      { action: "water", minAccuracy: "normal" },   // Seed → Sprout
      { action: "fertilize", type: "compost" },      // Sprout → Growing
      { action: "weather", condition: "Cold Snap" }, // Growing → Pre-Bloom
      { action: "fertilize", type: "premium" }      // Pre-Bloom → Bloom
    ]
  },
  {
    id: "small-purple-flowers",
    name: "Small Purple Flowers",
    image: "src/assets/plants/flower13_purple.png",
    cost: 20,
    sellValue: 28,
    rarity: "uncommon",
    availableBiomes: ["meadow", "grove"],
    growthRecipe: [
      { action: "water", minAccuracy: "normal" },    // Seed → Sprout
      { action: "fertilize", type: "standard" },    // Sprout → Growing
      { action: "weather", condition: "Cloudy" },    // Growing → Pre-Bloom
      { action: "fertilize", type: "premium" }      // Pre-Bloom → Bloom
    ]
  },
  {
    id: "small-yellow-flowers",
    name: "Small Yellow Flowers",
    image: "src/assets/plants/flower13_yellow.png",
    cost: 25,
    sellValue: 37,
    rarity: "rare",
    availableBiomes: ["meadow", "grove"],
    growthRecipe: [
      { action: "weather", condition: "Sunny" },     // Seed → Sprout
      { action: "water", minAccuracy: "perfect" },   // Sprout → Growing
      { action: "fertilize", type: "compost" },      // Growing → Pre-Bloom
      { action: "fertilize", type: "premium" }      // Pre-Bloom → Bloom
    ]
  },
  {
    id: "moonflowers",
    name: "Moonflowers",
    image: "src/assets/plants/flower1_colorful.png",
    cost: 40,
    sellValue: 60,
    rarity: "rare",
    availableBiomes: ["cliffside", "grove", "lunar"],
    growthRecipe: [
      { action: "weather", condition: "Foggy" },     // Seed → Sprout (night/mist)
      { action: "water", minAccuracy: "normal" },    // Sprout → Growing
      { action: "fertilize", type: "standard" },    // Growing → Pre-Bloom
      { action: "fertilize", type: "premium" }      // Pre-Bloom → Bloom
    ]
  },
  {
    id: "starpetal",
    name: "Starpetal",
    image: "src/assets/plants/flower9_yellow.png",
    cost: 60,
    sellValue: 78,
    rarity: "legendary",
    availableBiomes: ["grove", "greenhouse", "cliffside", "cavern", "lunar"],
    growthRecipe: [
      { action: "water", minAccuracy: "perfect" },   // Seed → Sprout
      { action: "water", minAccuracy: "perfect" },   // Sprout → Growing
      { action: "weather", condition: "Cloudy" },    // Growing → Pre-Bloom
      { action: "fertilize", type: "premium" }      // Pre-Bloom → Bloom
    ]
  },
  {
    id: "pink-spirit-flower",
    name: "Pink Spirit Flower",
    image: "src/assets/plants/flower2_pink.png",
    cost: 65,
    sellValue: 85,
    rarity: "legendary",
    availableBiomes: ["grove", "cliffside", "greenhouse"],
    growthRecipe: [
      { action: "fertilize", type: "compost" },      // Seed → Sprout
      { action: "water", minAccuracy: "normal" },    // Sprout → Growing
      { action: "weather", condition: "Cold Snap" }, // Growing → Pre-Bloom
      { action: "fertilize", type: "premium" }      // Pre-Bloom → Bloom
    ]
  }
];
