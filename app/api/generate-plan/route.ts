import { NextResponse } from "next/server";
import { calculateDailyTargets } from "@/lib/recommendations";

const MOCK_PLANS: Record<string, any> = {
  standard: {
    "lose": {
      breakfast: { name: "Chiya (No Sugar) + 2 Boiled Eggs", calories: 300, desc: "High protein, low carb start to the day.", alternatives: ["Black Tea & Chana", "Oats with Milk"] },
      lunch: { name: "Brown Rice + Dal + Saag + Kukhura ko Jhol (low oil)", calories: 550, desc: "Classic Nepali staple with brown rice for fiber.", alternatives: ["Roti and Mixed Veg Curry", "Buckwheat Dhido & Dal"] },
      snack: { name: "Roasted Bhatmas Sadeko", calories: 200, desc: "Spicy roasted soybeans for afternoon energy.", alternatives: ["Boiled Egg", "Apple"] },
      dinner: { name: "Roti (2 pcs) + Aloo Tama", calories: 400, desc: "Light dinner for better digestion.", alternatives: ["Thukpa", "Vegetable Soup & Roti"] }
    },
    "gain": {
      breakfast: { name: "3 Boiled Eggs + 2 Roti + Sweet Chiya", calories: 500, desc: "High calorie and protein to fuel muscle growth.", alternatives: ["Milk & Oats with Bananas", "Omelette with Cheese"] },
      lunch: { name: "Double Dal Bhat + Double Kukhura ko Masu", calories: 850, desc: "Massive traditional lunch for maximum calories.", alternatives: ["Buff Chowmein & Momo", "Ghee Dhido & Meat"] },
      snack: { name: "Chhoila with Chiura", calories: 400, desc: "Heavy meat snack to bump up protein.", alternatives: ["Roasted Peanuts & Makai", "Paneer Tikka"] },
      dinner: { name: "Dhido with Khasi ko Masu", calories: 750, desc: "Dense, slow-digesting carbs and rich protein.", alternatives: ["Rice, Ghee, and Paneer Curry", "Thick Egg Noodles"] }
    },
    "maintain": {
      breakfast: { name: "Sel Roti (1 pc) + Chiya + Apple", calories: 400, desc: "Balanced sweet start with fruit.", alternatives: ["Boiled Potatoes & Tea", "Puri Tarkari"] },
      lunch: { name: "Normal Dal Bhat Tarkari + Golbheda ko Achar", calories: 650, desc: "Standard balanced Nepali lunch.", alternatives: ["Dhido and Gundruk", "Roti with Chicken Curry"] },
      snack: { name: "Wai Wai Chatpate (homemade)", calories: 250, desc: "Fun, light afternoon snack.", alternatives: ["Roasted Soybeans", "Fresh Fruit"] },
      dinner: { name: "Thukpa with vegetables and egg", calories: 500, desc: "Warm comforting noodle soup.", alternatives: ["Aloo Tama and Roti", "Vegetable Jaulo"] }
    }
  },
  rural: {
    "lose": {
      breakfast: { name: "Kalo Chiya + 2 Ushineko Aloo (Boiled Potatoes)", calories: 300, desc: "Simple, accessible energy.", alternatives: ["Roasted Corn (Makai)", "Millet Roti (Kodo ko Roti)"] },
      lunch: { name: "Kodo ko Dhido + Sisnu (Nettle Soup) or Local Dal", calories: 550, desc: "Traditional nutrient-dense rural meal.", alternatives: ["Potato and Gundruk Soup", "Rice with Local Beans"] },
      snack: { name: "Makkai Bhuteko (Roasted Corn)", calories: 200, desc: "Locally available crunch.", alternatives: ["Aloo Sadeko (Spicy Potato)", "Roasted Wheat"] },
      dinner: { name: "Phapar ko Roti (Buckwheat) + Aloo ko Tarkari", calories: 400, desc: "Locally grown grains and potato.", alternatives: ["Vegetable Jaulo", "Gundruk Dhido"] }
    },
    "gain": {
      breakfast: { name: "Kalo Chiya + 4 Boiled Potatoes with local ghee", calories: 500, desc: "High calorie energy.", alternatives: ["Thick Millet Porridge", "Corn and Soybeans"] },
      lunch: { name: "Large Portion Dhido + Ghee + Local Beans (Simi) + Potato Curry", calories: 850, desc: "Heavy rural meal.", alternatives: ["Rice, Ghee, and Lentils", "Meat (if available) with Dhido"] },
      snack: { name: "Roasted Corn and Soybeans (Makai Bhatmas) mixed with Ghee", calories: 400, desc: "Calorie dense snack.", alternatives: ["Fried Potatoes", "Local Dairy/Mohi"] },
      dinner: { name: "Double Phapar ko Roti + Potato & Soy chunk Curry", calories: 750, desc: "Filling carb and protein.", alternatives: ["Heavy Jaulo with Ghee", "Dhido with Local Greens"] }
    },
    "maintain": {
      breakfast: { name: "Chiya + 2 Roti or 2 Boiled Potatoes", calories: 400, desc: "Basic morning sustenance.", alternatives: ["Roasted Corn", "Leftover Rice (Bhuja)"] },
      lunch: { name: "Local Rice/Dhido + Dal/Gundruk + Aloo Tarkari", calories: 650, desc: "Standard rural meal.", alternatives: ["Millet Roti and Beans", "Potato Curry and Rice"] },
      snack: { name: "Aloo Sadeko or Roasted Soybeans", calories: 250, desc: "Easy midday snack.", alternatives: ["Makai", "Fresh Local Fruit"] },
      dinner: { name: "Gundruk ko Jhol + Roti/Dhido", calories: 500, desc: "Comforting, fermented soup.", alternatives: ["Aloo Tama", "Vegetable Jaulo"] }
    }
  }
};

export async function POST(req: Request) {
  try {
    const { goal, dietPref, weight, region = "standard" } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY; 
    
    // Select the correct region and plan
    const regionPlans = MOCK_PLANS[region] || MOCK_PLANS.standard;
    const fallbackPlan = JSON.parse(JSON.stringify(regionPlans[goal] || regionPlans["maintain"]));
    
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
