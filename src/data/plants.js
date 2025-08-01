
import { ca } from "date-fns/locale";
import { CACHE_SIZE_UNLIMITED } from "firebase/firestore";

export const allPlants = [


  {
    
    id: "pink-flower",
    name: "Pink Flower",
    image: new URL("../assets/plants/flower4_pink.png", import.meta.url).href,
    cost: 5,
    sellValue: 10,
    rarity: "common",
    availableBiomes: ["meadow"],
    growthRecipe: [
      { action: "water",    minAccuracy: "normal" },  
      { action: "fertilize", type: "standard" },      
      { action: "weather",   condition: "Sunny" },   
      { action: "fertilize", type: "standard" }      
    ]
  },

  // 12. Next plant definition: “Blue Flower”
  {
    id: "blue-flower",
    name: "Blue Flower",
    image: new URL("../assets/plants/flower7_blue.png", import.meta.url).href,
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
    availableBiomes: ["meadow", "grove", "cliffside"],
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
    availableBiomes: ["meadow", "grove", "cliffside", "cavern"],
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
    availableBiomes: ["meadow", "grove", "cliffside"],
    growthRecipe: [
      { action: "weather",   condition: "Sunny" },
      { action: "water",     minAccuracy: "perfect" },
      { action: "fertilize", type: "compost" },
      { action: "fertilize", type: "premium" }
    ]
  },
  // “Colourful pot of flowers”
    {
    id: "colorful-pot-of-flowers",
    name: "Colourful Pot of Flowers",
    image: new URL("../assets/plants/flowerpot3_colorful.png", import.meta.url).href,
    cost: 30,
    sellValue: 55,
    rarity: "rare",
    availableBiomes: ["meadow", "grove"],
    growthRecipe: [
      { action: "weather",   condition: "Rainy" },
      { action: "water",     minAccuracy: "perfect" },
      { action: "fertilize", type: "compost" },
      { action: "water", minAccuracy: "perfect" }
    ]
  },

    // "Cheerful pot of flowers”
    {
    id: "cheerful-pot-of-flowers",
    name: "Cheerful Pot of Flowers",
    image: new URL("../assets/plants/flowerpot6_colorful.png", import.meta.url).href,
    cost: 35,
    sellValue: 70,
    rarity: "rare",
    availableBiomes: ["meadow", "grove"],
    growthRecipe: [
      { action: "water",     minAccuracy: "normal" },
      { action: "water",     minAccuracy: "perfect" },
      { action: "weather", condition: "Sunny" },
      { action: "fertilize", type: "premium" }
    ]
  },

      // "Pink Flower Bush"
    {
    id: "pink-flower-bush",
    name: "Pink Flower Bush",
    image: new URL("../assets/plants/bush2_pink.png", import.meta.url).href,
    cost: 35,
    sellValue: 50,
    rarity: "rare",
    availableBiomes: ["meadow", "grove"],
    growthRecipe: [
      { action: "water",     minAccuracy: "normal" },
      { action: "water",     minAccuracy: "perfect" },
      { action: "weather", condition: "Sunny" },
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
    sellValue: 80,
    rarity: "legendary",
    availableBiomes: ["grove", "greenhouse", "cliffside", "cavern", "lunar"],
    growthRecipe: [
      { action: "water",     minAccuracy: "perfect" },
      { action: "water",     minAccuracy: "perfect" },
      { action: "weather",   condition: "Cloudy" },
      { action: "fertilize", type: "premium" }
    ]
  },

  {
    id: "pink-spirit-flower",
    name: "Pink Spirit Flower",
    image: new URL("../assets/plants/flower2_pink.png", import.meta.url).href,
    cost: 65,
    sellValue: 90,
    rarity: "legendary",
    availableBiomes: ["grove", "cliffside", "greenhouse"],
    growthRecipe: [
      { action: "fertilize", type: "compost" },
      { action: "water",     minAccuracy: "normal" },
      { action: "weather",   condition: "Cold Snap" },
      { action: "fertilize", type: "premium" }
    ]
  }

      /*||||| Greenhouse Only Themed Entries ||||||*/
  ,{
    id: "marijuana",
    name: "marijuana",
    image: new URL("../assets/plants/weedlogo.webp", import.meta.url).href,
    cost: 100,
    sellValue: 200,
    rarity: "greenhouse only",
    availableBiomes: ["greenhouse"],
    growthRecipe: [
      { action: "fertilize", type: "compost" },
      { action: "water",     minAccuracy: "normal" },
      { action: "fertilize", type: "premium" },
      { action: "water", minAccuracy: "perfect" }
    ]
  }
];  
