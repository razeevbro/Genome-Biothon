"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save, Target, Flame, Dumbbell, Wheat, Droplet } from "lucide-react";
import { calculateDailyTargets } from "@/lib/recommendations";

export default function GoalsPage() {
  const [loading, setLoading] = useState(true);
  const [calcWeight, setCalcWeight] = useState(70);
  const [calcGoal, setCalcGoal] = useState<'Weight Loss' | 'Muscle Gain' | 'Maintain'>('Maintain');
  const [goals, setGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fats: 65,
  });

  useEffect(() => {
    const saved = localStorage.getItem("dietsathi_goals");
    if (saved) {
      try {
        setGoals(JSON.parse(saved));
      } catch (e) {}
    }
    setLoading(false);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("dietsathi_goals", JSON.stringify(goals));
    toast.success("Goals updated successfully!");
  };

  const handleAutoCalculate = () => {
    const targets = calculateDailyTargets(calcWeight, calcGoal);
    setGoals({
      calories: targets.targetCalories,
      protein: targets.targetProtein,
      carbs: targets.targetCarbs,
      fats: targets.targetFats,
    });
    toast.success("Magic targets applied! Remember to save.");
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <div className="h-8 w-48 animate-pulse rounded-md bg-neutral-200"></div>
        <div className="mt-8 space-y-4">
          <div className="h-12 w-full animate-pulse rounded-2xl bg-neutral-200"></div>
          <div className="h-12 w-full animate-pulse rounded-2xl bg-neutral-200"></div>
          <div className="h-12 w-full animate-pulse rounded-2xl bg-neutral-200"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 p-6 pb-24">
      {/* Background blobs */}
      <div className="fixed top-[0%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-red-200/30 to-orange-200/30 blur-[100px] -z-10 pointer-events-none" />
      <div className="fixed bottom-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tl from-emerald-200/20 to-teal-200/20 blur-[80px] -z-10 pointer-events-none" />

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-gradient-to-br from-red-500 to-orange-600 p-2 text-white shadow-sm">
            <Target size={20} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent">Your Goals</h1>
        </div>
        <p className="text-neutral-500 text-sm font-medium ml-11">
          Set your daily nutritional targets. We use these to track your progress and calculate your daily scores.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6 rounded-[2rem] border border-white/60 bg-white/60 backdrop-blur-xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Auto-Calculate Section */}
        <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-red-50/50 to-orange-50/50 p-5 border border-red-100 shadow-inner">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <h2 className="text-sm font-black uppercase tracking-widest text-red-800">Auto-Calculate Targets</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-neutral-600">Weight (kg)</span>
              <input
                type="number"
                value={calcWeight}
                onChange={(e) => setCalcWeight(Number(e.target.value))}
                className="w-full rounded-xl border border-white bg-white/80 px-3 py-2 text-sm font-bold text-neutral-800 outline-none focus:border-red-400 focus:ring-4 focus:ring-red-400/10 shadow-sm"
                min={30}
                max={200}
              />
            </label>
            
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-neutral-600">Goal</span>
              <select
                value={calcGoal}
                onChange={(e) => setCalcGoal(e.target.value as any)}
                className="w-full rounded-xl border border-white bg-white/80 px-3 py-2 text-sm font-bold text-neutral-800 outline-none focus:border-red-400 focus:ring-4 focus:ring-red-400/10 shadow-sm appearance-none"
              >
                <option value="Weight Loss">Weight Loss</option>
                <option value="Maintain">Maintain</option>
                <option value="Muscle Gain">Muscle Gain</option>
              </select>
            </label>
          </div>
          
          <button
            type="button"
            onClick={handleAutoCalculate}
            className="w-full rounded-xl bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-red-600 shadow-sm border border-red-100 hover:bg-red-50 hover:text-red-700 transition-all active:scale-[0.98]"
          >
            Calculate Magic Targets
          </button>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-200 to-transparent my-2" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <label className="group flex flex-col gap-2 relative">
            <div className="flex items-center gap-2 text-sm font-black tracking-wide text-neutral-800">
              <div className="rounded-lg bg-orange-100 p-1.5 text-orange-600">
                <Flame size={16} />
              </div>
              Daily Calories (kcal)
            </div>
            <input
              type="number"
              value={goals.calories}
              onChange={(e) => setGoals({ ...goals, calories: Number(e.target.value) })}
              className="w-full rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 font-black text-neutral-800 outline-none transition-all focus:border-orange-400 focus:ring-4 focus:ring-orange-400/10 shadow-sm"
              required
              min={500}
              max={10000}
            />
          </label>
          
          <label className="group flex flex-col gap-2 relative">
            <div className="flex items-center gap-2 text-sm font-black tracking-wide text-neutral-800">
              <div className="rounded-lg bg-blue-100 p-1.5 text-blue-600">
                <Dumbbell size={16} />
              </div>
              Daily Protein (g)
            </div>
            <input
              type="number"
              value={goals.protein}
              onChange={(e) => setGoals({ ...goals, protein: Number(e.target.value) })}
              className="w-full rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 font-black text-neutral-800 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 shadow-sm"
              required
              min={10}
            />
          </label>

          <label className="group flex flex-col gap-2 relative">
            <div className="flex items-center gap-2 text-sm font-black tracking-wide text-neutral-800">
              <div className="rounded-lg bg-emerald-100 p-1.5 text-emerald-600">
                <Wheat size={16} />
              </div>
              Daily Carbs (g)
            </div>
            <input
              type="number"
              value={goals.carbs}
              onChange={(e) => setGoals({ ...goals, carbs: Number(e.target.value) })}
              className="w-full rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 font-black text-neutral-800 outline-none transition-all focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10 shadow-sm"
              required
              min={10}
            />
          </label>

          <label className="group flex flex-col gap-2 relative">
            <div className="flex items-center gap-2 text-sm font-black tracking-wide text-neutral-800">
              <div className="rounded-lg bg-amber-100 p-1.5 text-amber-600">
                <Droplet size={16} />
              </div>
              Daily Fats (g)
            </div>
            <input
              type="number"
              value={goals.fats}
              onChange={(e) => setGoals({ ...goals, fats: Number(e.target.value) })}
              className="w-full rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 font-black text-neutral-800 outline-none transition-all focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 shadow-sm"
              required
              min={10}
            />
          </label>
        </div>

        <button
          type="submit"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 px-4 py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-red-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-500/30 active:scale-95"
        >
          <Save size={18} />
          Save Goals
        </button>
      </form>
    </main>
  );
}
