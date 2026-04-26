"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Chip } from "@/components/ui/Chip";
import { calculateDailyTargets } from "@/lib/recommendations";

export default function DietSathiPreview() {
  // State for testing our logic and UI
  const [weight, setWeight] = useState(70);
  const [goal, setGoal] = useState<'Weight Loss' | 'Muscle Gain' | 'Maintain'>('Maintain');
  const [selectedFood, setSelectedFood] = useState('Dal');

  // Running your core calculation logic
  const targets = calculateDailyTargets(weight, 165, 'male', goal, 25);

  const foods = ['Dal', 'Bhat (Rice)', 'Masu (Chicken)', 'Tarkari', 'Roti'];

  return (
    <main className="min-h-screen p-6 md:p-12 bg-gray-50 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-dietPrimary">DietSathi UI Playground</h1>
        <p className="text-gray-500">Testing Phase 3 (Design) & Phase 4 (Logic)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: UI Components */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-dietPrimary">1. Interactive Chips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {foods.map((food) => (
                  <Chip 
                    key={food} 
                    selected={selectedFood === food}
                    onClick={() => setSelectedFood(food)}
                  >
                    {food}
                  </Chip>
                ))}
              </div>
              <p className="mt-4 text-sm text-gray-600">Selected: <span className="font-bold">{selectedFood}</span></p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-dietPrimary">2. Buttons & Theme Colors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button className="bg-dietPrimary hover:bg-dietPrimary/90 text-white">Primary Action</Button>
                <Button variant="outline" className="text-dietPrimary border-dietPrimary hover:bg-dietSoft/20">Secondary</Button>
              </div>
              {/* Color Palette Display */}
              <div className="flex gap-2 h-10 w-full mt-4 rounded-md overflow-hidden shadow-sm">
                <div className="bg-dietPrimary flex-1 flex items-center justify-center text-xs text-white font-bold">Primary</div>
                <div className="bg-dietSoft flex-1 flex items-center justify-center text-xs text-dietPrimary font-bold">Soft</div>
                <div className="bg-dietDal flex-1 flex items-center justify-center text-xs text-white font-bold">Dal</div>
                <div className="bg-dietMasu flex-1 flex items-center justify-center text-xs text-white font-bold">Masu</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Logic & Progress */}
        <div className="space-y-8">
          <Card className="border-t-4 border-t-dietDal">
            <CardHeader>
              <CardTitle>3. Target Calculator Logic</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Input Controls */}
              <div className="flex justify-between items-center bg-gray-100 p-2 rounded-lg">
                <Button variant="ghost" onClick={() => setWeight(w => w - 1)}>-</Button>
                <span className="font-bold">{weight} kg</span>
                <Button variant="ghost" onClick={() => setWeight(w => w + 1)}>+</Button>
              </div>
              
              <div className="flex gap-2 justify-center">
                {(['Weight Loss', 'Maintain', 'Muscle Gain'] as const).map(g => (
                  <button 
                    key={g}
                    onClick={() => setGoal(g)}
                    className={`text-xs px-3 py-1 rounded-full border transition-all ${goal === g ? 'bg-gray-800 text-white' : 'bg-white'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>

              {/* Output Display */}
              <div className="space-y-4 pt-4 border-t">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">Daily Calories</span>
                    <span className="font-bold text-dietPrimary">{targets.targetCalories} kcal</span>
                  </div>
                  <Progress value={75} className="h-2 bg-gray-200" />
                  <p className="text-xs text-right mt-1 text-gray-400">Mock 75% filled</p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="bg-dietSoft/20 p-2 rounded">
                    <div className="font-bold text-dietPrimary">{targets.targetProtein}g</div>
                    <div className="text-xs text-gray-500">Protein</div>
                  </div>
                  <div className="bg-dietDal/20 p-2 rounded">
                    <div className="font-bold text-yellow-700">{targets.targetCarbs}g</div>
                    <div className="text-xs text-gray-500">Carbs</div>
                  </div>
                  <div className="bg-dietMasu/20 p-2 rounded">
                    <div className="font-bold text-dietMasu">{targets.targetFats}g</div>
                    <div className="text-xs text-gray-500">Fats</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
