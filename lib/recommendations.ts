export function calculateDailyTargets(weight: number, goal: 'Weight Loss' | 'Muscle Gain' | 'Maintain') {
  // Base BMR approximation (very simple for UI testing purposes)
  let baseCalories = weight * 24; 
  
  if (goal === 'Weight Loss') {
    baseCalories -= 500;
  } else if (goal === 'Muscle Gain') {
    baseCalories += 300;
  }

  // Macro calculation based on a standard balanced Nepali diet
  // 55% Carbs, 20% Protein, 25% Fats
  const targetCarbs = Math.round((baseCalories * 0.55) / 4);
  const targetProtein = Math.round((baseCalories * 0.20) / 4);
  const targetFats = Math.round((baseCalories * 0.25) / 9);

  return {
    targetCalories: Math.round(baseCalories),
    targetCarbs,
    targetProtein,
    targetFats
  };
}
