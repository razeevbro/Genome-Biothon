export function calculateDailyTargets(weight: number, height: number, gender: 'male' | 'female', goal: 'Weight Loss' | 'Muscle Gain' | 'Maintain', age: number = 25) {
  // Mifflin-St Jeor Equation for BMR
  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  if (gender === 'male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }

  // Calculate Total Daily Energy Expenditure (TDEE) assuming a sedentary lifestyle as a safe baseline
  let baseCalories = bmr * 1.2;

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
