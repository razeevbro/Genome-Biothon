import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// We need a service role key or just use the anon key if RLS allows inserts.
// Assuming for development, RLS is disabled or allows anon inserts for food_items.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const nepaliFoods = [
  // Staples
  { name: "Dal (Lentil Soup)", calories_per_unit: 110, protein_per_unit: 9, carbs_per_unit: 18, fats_per_unit: 1, unit_type: "bowl" },
  { name: "Bhat (White Rice)", calories_per_unit: 200, protein_per_unit: 4, carbs_per_unit: 45, fats_per_unit: 0.5, unit_type: "cup" },
  { name: "Dhido (Millet/Buckwheat)", calories_per_unit: 250, protein_per_unit: 8, carbs_per_unit: 50, fats_per_unit: 2, unit_type: "serving" },
  { name: "Roti (Chapati)", calories_per_unit: 100, protein_per_unit: 3, carbs_per_unit: 20, fats_per_unit: 1, unit_type: "piece" },
  { name: "Chiura (Beaten Rice)", calories_per_unit: 130, protein_per_unit: 2, carbs_per_unit: 30, fats_per_unit: 0, unit_type: "cup" },
  
  // Veggies & Sides
  { name: "Saag (Mustard Greens)", calories_per_unit: 35, protein_per_unit: 3, carbs_per_unit: 5, fats_per_unit: 1, unit_type: "bowl" },
  { name: "Aloo Tama (Potato & Bamboo Shoot)", calories_per_unit: 150, protein_per_unit: 4, carbs_per_unit: 25, fats_per_unit: 3, unit_type: "bowl" },
  { name: "Gundruk (Fermented Greens)", calories_per_unit: 20, protein_per_unit: 1, carbs_per_unit: 4, fats_per_unit: 0, unit_type: "bowl" },
  { name: "Mula ko Achar (Radish Pickle)", calories_per_unit: 40, protein_per_unit: 1, carbs_per_unit: 5, fats_per_unit: 2, unit_type: "tbsp" },
  { name: "Golbheda ko Achar (Tomato Pickle)", calories_per_unit: 30, protein_per_unit: 1, carbs_per_unit: 4, fats_per_unit: 1, unit_type: "tbsp" },
  { name: "Bhatmas Sadeko (Roasted Soybeans)", calories_per_unit: 180, protein_per_unit: 15, carbs_per_unit: 10, fats_per_unit: 9, unit_type: "small bowl" },
  
  // Meats
  { name: "Kukhura ko Masu (Chicken Curry)", calories_per_unit: 220, protein_per_unit: 25, carbs_per_unit: 5, fats_per_unit: 10, unit_type: "bowl" },
  { name: "Khasi ko Masu (Mutton Curry)", calories_per_unit: 320, protein_per_unit: 28, carbs_per_unit: 6, fats_per_unit: 20, unit_type: "bowl" },
  { name: "Sukuti (Dry Meat)", calories_per_unit: 250, protein_per_unit: 35, carbs_per_unit: 2, fats_per_unit: 10, unit_type: "serving" },
  { name: "Chhoila (Spicy Grilled Meat)", calories_per_unit: 200, protein_per_unit: 22, carbs_per_unit: 4, fats_per_unit: 10, unit_type: "serving" },
  
  // Snacks & Street Food
  { name: "Momo (Chicken)", calories_per_unit: 350, protein_per_unit: 15, carbs_per_unit: 40, fats_per_unit: 12, unit_type: "plate (10 pcs)" },
  { name: "Momo (Buff)", calories_per_unit: 380, protein_per_unit: 18, carbs_per_unit: 40, fats_per_unit: 15, unit_type: "plate (10 pcs)" },
  { name: "Momo (Veg)", calories_per_unit: 280, protein_per_unit: 8, carbs_per_unit: 45, fats_per_unit: 8, unit_type: "plate (10 pcs)" },
  { name: "Sel Roti", calories_per_unit: 200, protein_per_unit: 2, carbs_per_unit: 35, fats_per_unit: 6, unit_type: "piece" },
  { name: "Chatpate", calories_per_unit: 150, protein_per_unit: 4, carbs_per_unit: 30, fats_per_unit: 2, unit_type: "paper cone" },
  { name: "Pani Puri", calories_per_unit: 180, protein_per_unit: 4, carbs_per_unit: 35, fats_per_unit: 3, unit_type: "plate" },
  { name: "Aloo Nimki", calories_per_unit: 220, protein_per_unit: 5, carbs_per_unit: 38, fats_per_unit: 6, unit_type: "bowl" },
  { name: "Laphing", calories_per_unit: 140, protein_per_unit: 6, carbs_per_unit: 25, fats_per_unit: 2, unit_type: "bowl" },
  
  // Soups & Stews
  { name: "Thukpa (Noodle Soup)", calories_per_unit: 300, protein_per_unit: 12, carbs_per_unit: 50, fats_per_unit: 6, unit_type: "bowl" },
  { name: "Kwati (Mixed Bean Soup)", calories_per_unit: 180, protein_per_unit: 12, carbs_per_unit: 30, fats_per_unit: 1, unit_type: "bowl" },
  
  // Sweets & Drinks
  { name: "Yomari (Chaku)", calories_per_unit: 220, protein_per_unit: 2, carbs_per_unit: 45, fats_per_unit: 3, unit_type: "piece" },
  { name: "Juju Dhau (King Curd)", calories_per_unit: 140, protein_per_unit: 4, carbs_per_unit: 15, fats_per_unit: 8, unit_type: "clay cup" },
  { name: "Chiya (Milk Tea with Sugar)", calories_per_unit: 120, protein_per_unit: 3, carbs_per_unit: 18, fats_per_unit: 4, unit_type: "cup" },
  { name: "Lassi", calories_per_unit: 180, protein_per_unit: 6, carbs_per_unit: 28, fats_per_unit: 5, unit_type: "glass" },
];

export async function GET() {
  try {
    const { error } = await supabase
      .from('food_items')
      .upsert(nepaliFoods, { onConflict: 'name' });

    if (error) {
      console.error("Seeding error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `Seeded ${nepaliFoods.length} Nepali foods successfully!` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
