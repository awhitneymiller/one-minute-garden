// 1. We import the Catalan locale from date-fns (you can remove this if you’re not using it here):
import { ca } from "date-fns/locale";

// 2. We export an array called “allPlants” which holds the definition for each plant in the game:
export const allPlants = [

  // 3. Each object below represents one plant type:
  {
    // 4. A unique identifier:
    id: "pink-flower",

    // 5. Human-friendly display name:
    name: "Pink Flower",

    // 6. The URL to its image: we use Vite’s `new URL(..., import.meta.url).href`
    //    so that the build will correctly fingerprint and serve this asset.
    image: new URL("../assets/plants/flower4_pink.png", import.meta.url).href,

    // 7. How many coins it costs to buy a seed:
    cost: 5,

    // 8. How many coins you get when you sell a fully bloomed plant:
    sellValue: 10,

    // 9. Rarity tier (affects shop sorting, drop rates, etc.):
    rarity: "common",

    // 10. Which biomes this seed is available in:
    availableBiomes: ["meadow"],

    // 11. The “growthRecipe” defines the four care steps (seed → bloom):
    growthRecipe: [
      { action: "water",    minAccuracy: "normal" },  // step 0 → 1
      { action: "fertilize", type: "standard" },      // step 1 → 2
      { action: "weather",   condition: "Sunny" },    // step 2 → 3
      { action: "fertilize", type: "standard" }       // step 3 → bloom
    ]
  },

  // 12. Next plant definition: “Blue Flower”
  {
    id: "blue-flower",
    name: "Blue Flower",
    image: new URL("../assets/plants/flower3_blue.png", import.meta.url).href,
    cost: 5,
    sellValue: 10,
    rarity: "common",
    availableBiomes: ["meadow"],
    growthRecipe: [
      { action: "water",    minAccuracy: "normal" },
      { action: "fertilize", type: "standard" },
      { action: "weather",   condition: "Rainy" },
      { action: "fertilize", type: "standard" }
    ]
  },

  // 13. “Red Bush”
  {
    id: "red-bush",
    name: "Red Bush",
    image: new URL("../assets/plants/bush2_red.png", import.meta.url).href,
    cost: 12,
    sellValue: 15,
    rarity: "common",
    availableBiomes: ["meadow"],
    growthRecipe: [
      { action: "weather",   condition: "Cloudy" },
      { action: "water",     minAccuracy: "normal" },
      { action: "fertilize", type: "compost" },
      { action: "fertilize", type: "premium" }
    ]
  },

  // 14. “Green Bush”
  {
    id: "green-bush",
    name: "Green Bush",
    image: new URL("../assets/plants/bush1(noflowers)_green.png", import.meta.url).href,
    cost: 12,
    sellValue: 15,
    rarity: "common",
    availableBiomes: ["meadow", "grove"],
    growthRecipe: [
      { action: "water",     minAccuracy: "normal" },
      { action: "weather",   condition: "Foggy" },
      { action: "fertilize", type: "standard" },
      { action: "fertilize", type: "premium" }
    ]
  },

  // 15. “Yellow Daisy”
  {
    id: "yellow-daisy",
    name: "Yellow Daisy",
    image: new URL("../assets/plants/flower1_yellow.png", import.meta.url).href,
    cost: 15,
    sellValue: 19,
    rarity: "uncommon",
    availableBiomes: ["meadow", "grove"],
    growthRecipe: [
      { action: "water",     minAccuracy: "normal" },
      { action: "fertilize", type: "compost" },
      { action: "weather",   condition: "Cold Snap" },
      { action: "fertilize", type: "premium" }
    ]
  },

  // 16. “Small Purple Flowers”
  {
    id: "small-purple-flowers",
    name: "Small Purple Flowers",
    image: new URL("../assets/plants/flower13_purple.png", import.meta.url).href,
    cost: 20,
    sellValue: 28,
    rarity: "uncommon",
    availableBiomes: ["meadow", "grove"],
    growthRecipe: [
      { action: "water",     minAccuracy: "normal" },
      { action: "fertilize", type: "standard" },
      { action: "weather",   condition: "Cloudy" },
      { action: "fertilize", type: "premium" }
    ]
  },

  // 17. “Small Yellow Flowers”
  {
    id: "small-yellow-flowers",
    name: "Small Yellow Flowers",
    image: new URL("../assets/plants/flower13_yellow.png", import.meta.url).href,
    cost: 25,
    sellValue: 37,
    rarity: "rare",
    availableBiomes: ["meadow", "grove"],
    growthRecipe: [
      { action: "weather",   condition: "Sunny" },
      { action: "water",     minAccuracy: "perfect" },
      { action: "fertilize", type: "compost" },
      { action: "fertilize", type: "premium" }
    ]
  },

  // 18. “Moonflowers”
  {
    id: "moonflowers",
    name: "Moonflowers",
    image: new URL("../assets/plants/flower1_colorful.png", import.meta.url).href,
    cost: 40,
    sellValue: 60,
    rarity: "rare",
    availableBiomes: ["cliffside", "grove", "lunar"],
    growthRecipe: [
      { action: "weather",   condition: "Foggy" },
      { action: "water",     minAccuracy: "normal" },
      { action: "fertilize", type: "standard" },
      { action: "fertilize", type: "premium" }
    ]
  },

  // 19. “Starpetal”
  {
    id: "starpetal",
    name: "Starpetal",
    image: new URL("../assets/plants/flower9_yellow.png", import.meta.url).href,
    cost: 60,
    sellValue: 78,
    rarity: "legendary",
    availableBiomes: ["grove", "greenhouse", "cliffside", "cavern", "lunar"],
    growthRecipe: [
      { action: "water",     minAccuracy: "perfect" },
      { action: "water",     minAccuracy: "perfect" },
      { action: "weather",   condition: "Cloudy" },
      { action: "fertilize", type: "premium" }
    ]
  },

  // 20. “Pink Spirit Flower”
  {
    id: "pink-spirit-flower",
    name: "Pink Spirit Flower",
    image: new URL("../assets/plants/flower2_pink.png", import.meta.url).href,
    cost: 65,
    sellValue: 85,
    rarity: "legendary",
    availableBiomes: ["grove", "cliffside", "greenhouse"],
    growthRecipe: [
      { action: "fertilize", type: "compost" },
      { action: "water",     minAccuracy: "normal" },
      { action: "weather",   condition: "Cold Snap" },
      { action: "fertilize", type: "premium" }
    ]
  }

];  // ← end of the allPlants array
