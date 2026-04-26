import { NextResponse } from "next/server";
import { calculateDailyTargets } from "@/lib/recommendations";

const MOCK_PLANS: Record<string, any> = {
  "lose": {
    breakfast: { name: "Chiya (No Sugar) + 2 Boiled Eggs", calories: 300, desc: "High protein, low carb start to the day." },
    lunch: { name: "Brown Rice + Dal + Saag + Kukhura ko Jhol (low oil)", calories: 550, desc: "Classic Nepali staple with brown rice for fiber." },
    snack: { name: "Roasted Bhatmas Sadeko", calories: 200, desc: "Spicy roasted soybeans for afternoon energy." },
    dinner: { name: "Roti (2 pcs) + Aloo Tama", calories: 400, desc: "Light dinner for better digestion." }
  },
  "gain": {
    breakfast: { name: "3 Boiled Eggs + 2 Roti + Sweet Chiya", calories: 500, desc: "High calorie and protein to fuel muscle growth." },
    lunch: { name: "Double Dal Bhat + Double Kukhura ko Masu", calories: 850, desc: "Massive traditional lunch for maximum calories." },
    snack: { name: "Chhoila with Chiura", calories: 400, desc: "Heavy meat snack to bump up protein." },
    dinner: { name: "Dhido with Khasi ko Masu", calories: 750, desc: "Dense, slow-digesting carbs and rich protein." }
  },
  "maintain": {
    breakfast: { name: "Sel Roti (1 pc) + Chiya + Apple", calories: 400, desc: "Balanced sweet start with fruit." },
    lunch: { name: "Normal Dal Bhat Tarkari + Golbheda ko Achar", calories: 650, desc: "Standard balanced Nepali lunch." },
    snack: { name: "Wai Wai Chatpate (homemade)", calories: 250, desc: "Fun, light afternoon snack." },
    dinner: { name: "Thukpa with vegetables and egg", calories: 500, desc: "Warm comforting noodle soup." }
  },
};

export async function POST(req: Request) {
  try {
    const { goal, dietPref, weight } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY; 
    
    if (apiKey) {
      // Logic for real AI can go here, ensuring it returns JSON
    }

    // Deep copy the fallback plan so we don't mutate the global constant
    const fallbackPlan = JSON.parse(JSON.stringify(MOCK_PLANS[goal] || MOCK_PLANS["maintain"]));
    
    // Scale the calories according to the user's weight
    if (weight) {
      // Map UI goal to recommendation logic goal
      const mappedGoal = goal === "lose" ? "Weight Loss" : goal === "gain" ? "Muscle Gain" : "Maintain";
      const { targetCalories } = calculateDailyTargets(Number(weight), mappedGoal);
      
      // Calculate current total of the mock plan
      const mealKeys = Object.keys(fallbackPlan);
      const totalMockCalories = mealKeys.reduce((sum, key) => sum + fallbackPlan[key].calories, 0);
      
      // Scale each meal's calories proportionally to perfectly hit the target
      mealKeys.forEach((key) => {
        const ratio = fallbackPlan[key].calories / totalMockCalories;
        fallbackPlan[key].calories = Math.round(targetCalories * ratio);
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({ 
      success: true, 
      plan: fallbackPlan 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
