const fs = require('fs');

const data = fs.readFileSync('lib/foodData.ts', 'utf8');
const match = data.match(/export const FOOD_DATABASE: FoodItem\[\] = (\[[\s\S]*?\]);/);

if (match) {
  // Mock the types so eval works
  const Hilly = "Hilly", Terai = "Terai", Himalayan = "Himalayan";
  const standard = "standard", limited = "limited";
  const adult = "adult", senior = "senior", child = "child";
  const foods = eval(match[1]);

  let sql = 'INSERT INTO public.food_items (name, unit_type, calories_per_unit, protein_per_unit, carbs_per_unit, fats_per_unit) VALUES\n';
  const values = foods.map(f => {
    const carbs = Math.round(f.calories * 0.5 / 4);
    const fats = Math.round(f.calories * 0.3 / 9);
    return `('${f.name.replace(/'/g, "''")}', 'serving', ${f.calories}, ${f.protein}, ${carbs}, ${fats})`;
  });
  
  sql += values.join(',\n') + ';';
  fs.writeFileSync('scratch/seed.sql', sql);
  console.log('Done!');
} else {
  console.log('Failed');
}
