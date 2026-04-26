import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { FOOD_DATABASE } from '@/lib/foodData';

export async function GET() {
  try {
    let addedCount = 0;

    for (const food of FOOD_DATABASE) {
      // Check if the food already exists to avoid duplicates
      const { data: existing } = await supabase
        .from('food_items')
        .select('id')
        .eq('name', food.name)
        .maybeSingle();
        
      if (!existing) {
        const { error } = await supabase.from('food_items').insert({
          name: food.name,
          unit_type: 'serving',
          calories_per_unit: food.calories,
          protein_per_unit: food.protein,
          carbs_per_unit: Math.round(food.calories * 0.5 / 4), // rough estimate for macros
          fats_per_unit: Math.round(food.calories * 0.3 / 9),  // rough estimate for macros
        });

        if (error) {
          console.error(`Failed to insert ${food.name}:`, error);
        } else {
          addedCount++;
        }
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Successfully seeded ${addedCount} new food items into the database!` 
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
