export type Region = "Himalayan" | "Hilly" | "Terai";
export type Availability = "standard" | "limited";
export type MealCategory = "breakfast" | "lunch" | "snack" | "dinner";
export type AgeGroup = "child" | "adult" | "senior";
export type MedicalCondition = 
  | "Diabetes" 
  | "Hypertension" 
  | "Uric Acid" 
  | "Gastritis"
  | "High Cholesterol"
  | "Thyroid"
  | "PCOS"
  | "Celiac Disease"
  | "Lactose Intolerance"
  | "Fatty Liver";

export interface FoodItem {
  id: string;
  name: string;
  category: MealCategory | "protein" | "carb" | "fat" | "any";
  calories: number; // per serving
  protein: number; // per serving
  region_tags: Region[];
  availability_type: Availability[];
  suitable_for_age: AgeGroup[];
  avoid_for_conditions: MedicalCondition[];
  desc: string;
  is_base_meal?: boolean;
}

export const FOOD_DATABASE: FoodItem[] = [
  // BREAKFAST
  { id: "b1", name: "Chiya (No Sugar) + 2 Boiled Eggs", category: "breakfast", calories: 250, protein: 12, region_tags: ["Hilly", "Terai"], availability_type: ["standard"], suitable_for_age: ["adult", "senior"], avoid_for_conditions: ["Lactose Intolerance", "High Cholesterol"], desc: "High protein, low carb start.", is_base_meal: true },
  { id: "b2", name: "Kalo Chiya + 2 Ushineko Aloo (Boiled Potatoes)", category: "breakfast", calories: 300, protein: 4, region_tags: ["Himalayan", "Hilly", "Terai"], availability_type: ["standard", "limited"], suitable_for_age: ["child", "adult", "senior"], avoid_for_conditions: ["Diabetes", "PCOS", "Fatty Liver"], desc: "Simple, accessible energy.", is_base_meal: true },
  { id: "b3", name: "Tsampa (Roasted Barley Flour) Porridge", category: "breakfast", calories: 350, protein: 10, region_tags: ["Himalayan"], availability_type: ["standard", "limited"], suitable_for_age: ["child", "adult", "senior"], avoid_for_conditions: ["Celiac Disease"], desc: "Hearty, soft, high-altitude breakfast. Low glycemic index.", is_base_meal: true },
  { id: "b4", name: "Sel Roti (1 pc) + Chiya + Apple", category: "breakfast", calories: 400, protein: 5, region_tags: ["Hilly", "Terai"], availability_type: ["standard"], suitable_for_age: ["child", "adult"], avoid_for_conditions: ["Diabetes", "Gastritis", "Hypertension", "High Cholesterol", "PCOS", "Fatty Liver", "Lactose Intolerance"], desc: "Balanced sweet start with fruit. Very oily and sugary.", is_base_meal: true },
  { id: "b5", name: "Oats with Buffalo Milk and Bananas", category: "breakfast", calories: 450, protein: 15, region_tags: ["Terai", "Hilly"], availability_type: ["standard"], suitable_for_age: ["child", "adult", "senior"], avoid_for_conditions: ["Lactose Intolerance"], desc: "Modern, easy to digest high protein start. Good for diabetics.", is_base_meal: true },
  { id: "b6", name: "Sprouted Moong Dal Chat", category: "breakfast", calories: 200, protein: 14, region_tags: ["Terai", "Hilly"], availability_type: ["standard", "limited"], suitable_for_age: ["adult"], avoid_for_conditions: ["Uric Acid", "Gastritis", "Thyroid"], desc: "Raw protein packed start.", is_base_meal: true },

  // LUNCH
  { id: "l1", name: "Brown Rice + Dal + Saag + Kukhura ko Jhol", category: "lunch", calories: 600, protein: 35, region_tags: ["Hilly", "Terai"], availability_type: ["standard"], suitable_for_age: ["adult", "senior"], avoid_for_conditions: ["Uric Acid"], desc: "Classic Nepali staple with lean meat. Brown rice controls sugar.", is_base_meal: true },
  { id: "l2", name: "Kodo ko Dhido + Sisnu (Nettle Soup) + Local Beans", category: "lunch", calories: 550, protein: 18, region_tags: ["Himalayan", "Hilly"], availability_type: ["standard", "limited"], suitable_for_age: ["adult", "senior"], avoid_for_conditions: ["Uric Acid"], desc: "Traditional nutrient-dense rural meal. Excellent for blood sugar.", is_base_meal: true },
  { id: "l3", name: "White Rice + Fish Curry (Macha ko Jhol) + Rayo ko Saag", category: "lunch", calories: 650, protein: 30, region_tags: ["Terai"], availability_type: ["standard", "limited"], suitable_for_age: ["child", "adult", "senior"], avoid_for_conditions: ["Diabetes", "PCOS", "Fatty Liver"], desc: "Protein-rich Terai staple. High simple carbs.", is_base_meal: true },
  { id: "l4", name: "Phapar ko Dhido (Buckwheat) + Ghee + Kukhura ko Masu", category: "lunch", calories: 750, protein: 40, region_tags: ["Himalayan", "Hilly"], availability_type: ["standard"], suitable_for_age: ["adult"], avoid_for_conditions: ["Uric Acid", "High Cholesterol", "Fatty Liver", "Lactose Intolerance"], desc: "Dense, slow-digesting carbs and rich protein.", is_base_meal: true },
  { id: "l5", name: "White Rice + Daal + Gundruk Sadeko", category: "lunch", calories: 500, protein: 12, region_tags: ["Himalayan", "Hilly", "Terai"], availability_type: ["standard", "limited"], suitable_for_age: ["child", "adult", "senior"], avoid_for_conditions: ["Diabetes", "Gastritis", "PCOS"], desc: "Simple vegetarian meal. High GI and acidic.", is_base_meal: true },
  { id: "l6", name: "Vegetable Jaulo (Soft Rice and Lentils) with Ghee", category: "lunch", calories: 450, protein: 14, region_tags: ["Himalayan", "Hilly", "Terai"], availability_type: ["standard", "limited"], suitable_for_age: ["child", "senior"], avoid_for_conditions: ["Lactose Intolerance", "Diabetes", "PCOS"], desc: "Extremely easy to digest, soft and nutritious.", is_base_meal: true },

  // SNACKS
  { id: "s1", name: "Roasted Bhatmas (Soybeans) Sadeko", category: "snack", calories: 250, protein: 18, region_tags: ["Hilly", "Terai", "Himalayan"], availability_type: ["standard", "limited"], suitable_for_age: ["adult"], avoid_for_conditions: ["Gastritis", "Uric Acid", "Hypertension", "Thyroid"], desc: "Spicy roasted soybeans for afternoon energy. Hard to chew for seniors.", is_base_meal: true },
  { id: "s2", name: "Makkai Bhuteko (Roasted Corn)", category: "snack", calories: 200, protein: 6, region_tags: ["Himalayan", "Hilly", "Terai"], availability_type: ["standard", "limited"], suitable_for_age: ["child", "adult"], avoid_for_conditions: [], desc: "Locally available crunch. Hard to chew.", is_base_meal: true },
  { id: "s3", name: "Chhoila with Chiura", category: "snack", calories: 400, protein: 25, region_tags: ["Hilly", "Terai"], availability_type: ["standard"], suitable_for_age: ["adult"], avoid_for_conditions: ["Uric Acid", "Gastritis", "Hypertension", "Diabetes", "High Cholesterol", "Fatty Liver", "PCOS"], desc: "Heavy, spicy meat snack to bump up protein.", is_base_meal: true },
  { id: "s4", name: "Chana (Chickpeas) Chatpate", category: "snack", calories: 300, protein: 12, region_tags: ["Terai", "Hilly"], availability_type: ["standard", "limited"], suitable_for_age: ["child", "adult"], avoid_for_conditions: ["Gastritis", "Hypertension"], desc: "Tangy and protein-packed. High sodium.", is_base_meal: true },
  { id: "s5", name: "Aloo Sadeko (Spicy Potato) + Black Tea", category: "snack", calories: 250, protein: 3, region_tags: ["Himalayan", "Hilly", "Terai"], availability_type: ["standard", "limited"], suitable_for_age: ["adult"], avoid_for_conditions: ["Diabetes", "Gastritis", "PCOS", "Fatty Liver"], desc: "Quick and easy energy.", is_base_meal: true },
  { id: "s6", name: "Boiled Eggs and Soft Fruits (Banana/Papaya)", category: "snack", calories: 200, protein: 12, region_tags: ["Hilly", "Terai", "Himalayan"], availability_type: ["standard", "limited"], suitable_for_age: ["child", "senior", "adult"], avoid_for_conditions: ["High Cholesterol"], desc: "Soft, nutritious, and easy to digest.", is_base_meal: true },
  { id: "s7", name: "Sugar-free Almonds & Walnuts + Green Tea", category: "snack", calories: 220, protein: 8, region_tags: ["Hilly", "Terai"], availability_type: ["standard"], suitable_for_age: ["adult", "senior"], avoid_for_conditions: [], desc: "Heart healthy fats, excellent for diabetics.", is_base_meal: true },

  // DINNER
  { id: "d1", name: "Roti (2 pcs) + Aloo Tama", category: "dinner", calories: 400, protein: 8, region_tags: ["Hilly", "Terai"], availability_type: ["standard"], suitable_for_age: ["adult", "senior"], avoid_for_conditions: ["Gastritis", "Diabetes", "PCOS", "Celiac Disease"], desc: "Light dinner for better digestion. Tama is acidic.", is_base_meal: true },
  { id: "d2", name: "Phapar ko Roti (Buckwheat) + Mixed Veg Tarkari", category: "dinner", calories: 400, protein: 10, region_tags: ["Himalayan", "Hilly"], availability_type: ["standard", "limited"], suitable_for_age: ["adult", "senior"], avoid_for_conditions: [], desc: "Locally grown grains. Low GI index, great for diabetes.", is_base_meal: true },
  { id: "d3", name: "Thukpa with mixed vegetables and egg", category: "dinner", calories: 450, protein: 15, region_tags: ["Himalayan", "Hilly"], availability_type: ["standard"], suitable_for_age: ["child", "adult", "senior"], avoid_for_conditions: ["Hypertension", "Celiac Disease"], desc: "Warm comforting noodle soup. Can be high in sodium.", is_base_meal: true },
  { id: "d4", name: "Gundruk ko Jhol + Roti or Rice", category: "dinner", calories: 350, protein: 6, region_tags: ["Himalayan", "Hilly"], availability_type: ["standard", "limited"], suitable_for_age: ["adult", "senior"], avoid_for_conditions: ["Gastritis", "Celiac Disease"], desc: "Comforting, fermented soup. High acidity.", is_base_meal: true },
  { id: "d5", name: "Litti Chokha", category: "dinner", calories: 500, protein: 14, region_tags: ["Terai"], availability_type: ["standard", "limited"], suitable_for_age: ["adult"], avoid_for_conditions: ["Diabetes", "PCOS", "Celiac Disease"], desc: "Roasted wheat balls with mashed potato/eggplant.", is_base_meal: true },
  { id: "d6", name: "Soft Dal Soup with Light Vegetable Tarkari", category: "dinner", calories: 300, protein: 10, region_tags: ["Himalayan", "Hilly", "Terai"], availability_type: ["standard", "limited"], suitable_for_age: ["child", "senior"], avoid_for_conditions: [], desc: "Very light on the stomach for a peaceful night.", is_base_meal: true },
  
  // PROTEIN ADD-ONS (Fallback)
  { id: "p1", name: "Extra Boiled Eggs (2 pcs)", category: "protein", calories: 150, protein: 12, region_tags: ["Hilly", "Terai"], availability_type: ["standard"], suitable_for_age: ["child", "adult", "senior"], avoid_for_conditions: ["High Cholesterol"], desc: "Extra protein boost." },
  { id: "p2", name: "Extra Roasted Soybeans (Bhatmas)", category: "protein", calories: 200, protein: 15, region_tags: ["Himalayan", "Hilly", "Terai"], availability_type: ["standard", "limited"], suitable_for_age: ["adult"], avoid_for_conditions: ["Gastritis", "Uric Acid", "Thyroid"], desc: "Plant-based protein addition." },
  { id: "p3", name: "Extra Local Beans / Kwati", category: "protein", calories: 200, protein: 14, region_tags: ["Himalayan", "Hilly", "Terai"], availability_type: ["standard", "limited"], suitable_for_age: ["adult", "senior"], avoid_for_conditions: ["Uric Acid", "Gastritis"], desc: "Rich mixed beans." },
  { id: "p4", name: "Extra Chicken / Meat portion", category: "protein", calories: 200, protein: 25, region_tags: ["Hilly", "Terai"], availability_type: ["standard"], suitable_for_age: ["adult"], avoid_for_conditions: ["Uric Acid"], desc: "Lean meat." },
];
