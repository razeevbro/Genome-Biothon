import { NextResponse } from "next/server";
import { calculateDailyTargets } from "@/lib/recommendations";
import { FOOD_DATABASE, FoodItem, Region, Availability } from "@/lib/foodData";

function getRandomElement<T>(arr: T[]): T | null {
  return arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : null;
}

export async function POST(req: Request) {
  try {
    const { goal, dietPref, weight, height, gender, region, availability, age, diseases } = await req.json();
    const reqRegion = (region || "Hilly") as Region;
    const reqAvailability = (availability || "standard") as Availability;
    const reqAge = age ? Number(age) : 25;
    const activeDiseases = Array.isArray(diseases) ? diseases : [];

    // Determine Age Group
    let ageGroup: "child" | "adult" | "senior" = "adult";
    if (reqAge < 15) ageGroup = "child";
    else if (reqAge > 55) ageGroup = "senior";

    // Filter food by region, availability, and age
    let filteredFoods = FOOD_DATABASE.filter(food => 
      food.region_tags.includes(reqRegion) && food.suitable_for_age.includes(ageGroup)
    );

    // Disease filter: exclude any food that explicitly states it should be avoided for the user's active diseases
    if (activeDiseases.length > 0) {
      filteredFoods = filteredFoods.filter(food => 
        !food.avoid_for_conditions?.some(condition => activeDiseases.includes(condition))
      );
    }

    if (reqAvailability === "limited") {
      filteredFoods = filteredFoods.filter(food => 
        food.availability_type.includes("limited")
      );
    }

    if (dietPref === "veg") {
      // Basic veg filter: filter out known non-veg terms
      filteredFoods = filteredFoods.filter(f => !f.name.toLowerCase().includes("kukhura") && !f.name.toLowerCase().includes("macha") && !f.name.toLowerCase().includes("masu") && !f.name.toLowerCase().includes("meat") && !f.name.toLowerCase().includes("chicken") && !f.name.toLowerCase().includes("egg"));
    }

    const breakfastOptions = filteredFoods.filter(f => f.category === "breakfast");
    const lunchOptions = filteredFoods.filter(f => f.category === "lunch");
    const snackOptions = filteredFoods.filter(f => f.category === "snack");
    const dinnerOptions = filteredFoods.filter(f => f.category === "dinner");

    // EDGE CASE FIX: If the user selects too many conflicting diseases, a specific category might become completely empty!
    if (breakfastOptions.length === 0 || lunchOptions.length === 0 || dinnerOptions.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Your combined medical constraints are extremely strict. Please consult a clinical dietitian, as standard local ingredients cannot safely cover all these overlapping conditions.",
      });
    }

    // Create meal plan
    const getFood = (optionsArray: any[], categoryName: string) => {
      return getRandomElement(optionsArray) || { name: `Locally Sourced ${categoryName}`, calories: 200, protein: 5, desc: "A simple local meal." };
    };

    const planData: Record<string, any> = {
      breakfast: getFood(breakfastOptions, "breakfast"),
      lunch: getFood(lunchOptions, "lunch"),
      snack: getFood(snackOptions, "snack"),
      dinner: getFood(dinnerOptions, "dinner"),
    };

    // Calculate total protein of the draft plan
    const draftProtein = Object.values(planData).reduce((sum, item) => sum + (item.protein || 0), 0);
    
    // Scale the calories according to the user's weight
    let mappedGoal = "Maintain";
    let targetCalories = 2000;
    let targetProtein = 50;
    if (weight && height) {
      mappedGoal = goal === "lose" ? "Weight Loss" : goal === "gain" ? "Muscle Gain" : "Maintain";
      const targets = calculateDailyTargets(Number(weight), Number(height), gender || 'male', mappedGoal, reqAge);
      targetCalories = targets.targetCalories;
      targetProtein = Number(weight) * (goal === "gain" ? 1.6 : goal === "lose" ? 1.4 : 1.0);
    }

    const mealKeys = ["breakfast", "lunch", "snack", "dinner"];
    const totalMockCalories = mealKeys.reduce((sum, key) => sum + planData[key].calories, 0);
    
    mealKeys.forEach((key) => {
      const ratio = planData[key].calories / totalMockCalories;
      planData[key].calories = Math.round(targetCalories * ratio);
    });

    // Check protein deficit
    let proteinWarning = null;
    if (draftProtein < targetProtein - 15) { // 15g tolerance
      if (reqAvailability === "limited") {
        proteinWarning = `Limited options available. You are short on protein (Target: ~${Math.round(targetProtein)}g, Plan: ~${draftProtein}g). Consider adding locally available legumes, roasted soybeans, or eggs if possible.`;
      } else {
         proteinWarning = `Protein is slightly low (Target: ~${Math.round(targetProtein)}g, Plan: ~${draftProtein}g). Consider adding an extra portion of meat, lentils, or paneer.`;
      }
    }

    let aiSummary = "";
    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are DietSathi, an empathetic Nepali AI nutritionist. I have programmatically generated a safe, local meal plan for a user.
User profile: Region: ${reqRegion}, Age Group: ${ageGroup}, Active Diseases: ${activeDiseases.length > 0 ? activeDiseases.join(", ") : "None"}.
The selected foods are:
Breakfast: ${planData.breakfast.name}
Lunch: ${planData.lunch.name}
Snack: ${planData.snack.name}
Dinner: ${planData.dinner.name}

Write a short, highly encouraging 2-3 sentence summary telling the user why this plan is great for them, specifically mentioning their diseases (if any) and how these specific local foods help. Keep it warm, professional, and confident. Do NOT list the foods again, just summarize the overall health benefits.`;

        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 150, temperature: 0.7 }
          })
        });

        if (geminiRes.ok) {
          const gData = await geminiRes.json();
          aiSummary = gData.candidates?.[0]?.content?.parts?.[0]?.text || "";
        }
      } catch (e) {
        console.error("Gemini API call failed", e);
      }
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return NextResponse.json({ 
      success: true, 
      plan: planData,
      aiSummary,
      meta: {
        region: reqRegion,
        availability: reqAvailability,
        ageGroup,
        diseases: activeDiseases,
        proteinWarning
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
