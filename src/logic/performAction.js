export const performAction = (plantId, action, setPlants) => {
  setPlants((prev) =>
    prev.map((p) =>
      p.id === plantId
        ? {
            ...p,
            watered: action === "water" ? (p.watered || 0) + 1 : p.watered,
            fertilized: action === "fertilize" ? (p.fertilized || 0) + 1 : p.fertilized,
          }
        : p
    )
  );
};
