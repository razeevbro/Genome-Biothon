"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { LogOut, PlusCircle, User, Flame, Dumbbell, Wheat, Droplet } from "lucide-react";

type Meal = {
  id: string;
  portion_size: number;
  meal_time: string;
  date: string;
  food_items: {
    id: string;
    name: string;
    unit_type: string;
    calories_per_unit: number;
    protein_per_unit: number;
    carbs_per_unit: number;
    fats_per_unit: number;
  };
};

export default function HomePage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [goals, setGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fats: 65,
  });

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/sign-in");
        return;
      }

      setEmail(user.email ?? null);

      const savedGoals = localStorage.getItem("dietsathi_goals");
      if (savedGoals) {
        try {
          setGoals(JSON.parse(savedGoals));
        } catch (e) {}
      }

      const today = new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from("meals")
        .select(`
          id,
          portion_size,
          meal_time,
          date,
          food_items (
            id,
            name,
            unit_type,
            calories_per_unit,
            protein_per_unit,
            carbs_per_unit,
            fats_per_unit
          )
        `)
        .eq("user_id", user.id)
        .eq("date", today)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setMeals(data as any as Meal[]);
      }

      setLoading(false);
    };

    void loadData();
  }, [router]);

  const onSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/sign-in");
  };

  if (loading) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-40 animate-pulse rounded-md bg-neutral-200"></div>
          <div className="h-6 w-24 animate-pulse rounded-md bg-neutral-200"></div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-neutral-200"></div>
          ))}
        </div>
        <div className="h-24 w-full animate-pulse rounded-2xl bg-neutral-200"></div>
        <div className="mt-4 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 w-full animate-pulse rounded-2xl bg-neutral-200"></div>
          ))}
        </div>
      </main>
    );
  }

  const totals = meals.reduce(
    (acc, meal) => {
      const p = meal.portion_size;
      const f = meal.food_items;
      if (f) {
        acc.calories += (f.calories_per_unit || 0) * p;
        acc.protein += (f.protein_per_unit || 0) * p;
        acc.carbs += (f.carbs_per_unit || 0) * p;
        acc.fats += (f.fats_per_unit || 0) * p;
      }
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const status = totals.calories > goals.calories ? "Over Limit" : "On Track";
  const getProgress = (current: number, target: number) => Math.min(100, (current / target) * 100);

  // Calculate Nutrition Score
  let score = 100;
  if (totals.calories === 0) {
    score = 0;
  } else {
    const calDiff = Math.abs(totals.calories - goals.calories);
    const calPenalty = Math.min(40, (calDiff / goals.calories) * 100);
    
    const proDiff = Math.abs(totals.protein - goals.protein);
    const proPenalty = Math.min(30, (proDiff / goals.protein) * 100);
    
    score = Math.max(0, Math.round(100 - calPenalty - proPenalty));
  }

  // Generate Suggestion
  let suggestion = "Log your first meal to get personalized tips!";
  if (totals.calories > 0) {
    if (totals.calories > goals.calories) {
      suggestion = "You're over your calorie limit! Try lighter meals like Jhol Momo or clear soups tomorrow.";
    } else if (totals.protein < goals.protein * 0.5) {
      suggestion = "Protein is low! Add a serving of Dal, Kukhura ko Masu, or Bhatmas to your next meal.";
    } else if (totals.carbs > goals.carbs * 1.2) {
      suggestion = "Carbs are high today. Swap out extra white rice (Bhat) for more Saag and Tarkari.";
    } else if (score > 80) {
      suggestion = "Great job! You're hitting your targets perfectly. Keep eating balanced Nepali meals!";
    } else {
      suggestion = "You're on track, but try to balance your macros better with a mix of veggies and protein.";
    }
  }

  const statCards = [
    { label: "Calories", current: totals.calories, target: goals.calories, unit: "kcal", icon: Flame, color: "from-orange-400 to-rose-400", bg: "bg-orange-50", text: "text-orange-600" },
    { label: "Protein", current: totals.protein, target: goals.protein, unit: "g", icon: Dumbbell, color: "from-blue-400 to-indigo-500", bg: "bg-blue-50", text: "text-blue-600" },
    { label: "Carbs", current: totals.carbs, target: goals.carbs, unit: "g", icon: Wheat, color: "from-emerald-400 to-teal-500", bg: "bg-emerald-50", text: "text-emerald-600" },
    { label: "Fats", current: totals.fats, target: goals.fats, unit: "g", icon: Droplet, color: "from-amber-400 to-yellow-500", bg: "bg-amber-50", text: "text-amber-600" },
  ];

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 p-6 pb-28">
      {/* Decorative background blob - Nepali theme */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-red-200/40 to-orange-200/40 blur-[120px] -z-10 pointer-events-none mix-blend-multiply" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tl from-emerald-200/30 to-amber-200/30 blur-[100px] -z-10 pointer-events-none mix-blend-multiply" />

      <header className="flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-3xl font-black tracking-tighter bg-gradient-to-br from-red-700 via-orange-600 to-amber-600 bg-clip-text text-transparent drop-shadow-sm">DietSathi</h1>
          <div className="flex items-center gap-3">
            <p className="text-xs text-neutral-500 flex items-center gap-1 font-semibold uppercase tracking-widest">
              <User size={12} className="text-red-500" /> {email?.split("@")[0]}
            </p>
            <div className="flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-orange-600">
              🔥 3 Day Streak
            </div>
            {meals.some(m => m.food_items?.name?.toLowerCase().includes("momo")) && (
              <div title="Momo Master" className="flex items-center justify-center h-5 w-5 rounded-full bg-red-100 text-[12px] shadow-sm cursor-help">
                🥟
              </div>
            )}
          </div>
        </div>
        <button 
          className="flex items-center gap-2 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-xl px-4 py-2 text-xs font-bold text-neutral-600 transition-all hover:bg-white/60 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:-translate-y-0.5" 
          onClick={onSignOut}
        >
          <LogOut size={14} />
          Sign out
        </button>
      </header>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="group relative overflow-hidden flex flex-col gap-3 rounded-[2rem] border border-white/80 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              <div className="relative flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">{stat.label}</span>
                <div className={`rounded-xl p-2 ${stat.bg} ${stat.text} shadow-inner transition-transform duration-300 group-hover:scale-110`}>
                  <Icon size={14} strokeWidth={2.5} />
                </div>
              </div>
              
              <div className="relative flex flex-col">
                <span className="text-3xl font-black tracking-tighter text-neutral-900 drop-shadow-sm">
                  {Math.round(stat.current)}<span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">{stat.unit}</span>
                </span>
                
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-200/50 shadow-inner">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${stat.current > stat.target && stat.label === "Calories" ? "from-red-500 to-rose-600 shadow-[0_0_10px_rgba(225,29,72,0.4)]" : `${stat.color} shadow-sm`} transition-all duration-1000 ease-out`}
                    style={{ width: `${getProgress(stat.current, stat.target)}%` }}
                  />
                </div>
                <span className="mt-1.5 text-[9px] font-extrabold uppercase tracking-widest text-neutral-400 text-right">{stat.target} {stat.unit} max</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`relative overflow-hidden flex flex-col gap-5 rounded-[2rem] p-7 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-white/80 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both ${status === "On Track" ? "bg-gradient-to-br from-green-50/80 to-emerald-100/60 backdrop-blur-xl" : "bg-gradient-to-br from-red-50/80 to-orange-100/60 backdrop-blur-xl"}`}>
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white/50 blur-[50px] pointer-events-none mix-blend-overlay"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 opacity-80">
              Nutrition Score
            </h2>
            <div className="flex items-baseline gap-1 mt-1">
              <span className={`text-5xl font-black tracking-tighter drop-shadow-sm ${status === "On Track" ? "text-green-700" : "text-red-700"}`}>
                {score}
              </span>
              <span className="text-xl font-bold text-neutral-400/80">/ 100</span>
            </div>
          </div>
          <div className={`rounded-2xl px-4 py-2 text-xs font-black uppercase tracking-widest shadow-lg ${status === "On Track" ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-green-500/30" : "bg-gradient-to-br from-red-400 to-orange-500 text-white shadow-red-500/30"}`}>
            {status}
          </div>
        </div>

        <div className="relative z-10 mt-1 rounded-[1.5rem] bg-white/60 backdrop-blur-md p-5 border border-white/60 shadow-sm transition-transform hover:scale-[1.01] duration-300">
          <p className="text-sm font-bold text-neutral-700 flex gap-3 leading-relaxed">
            <span className="text-2xl drop-shadow-sm animate-pulse">💡</span> 
            <span className="pt-0.5">{suggestion}</span>
          </p>
        </div>
      </div>

      <div className="pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
        <div className="mb-5 flex items-center justify-between px-2">
          <h2 className="text-xl font-black tracking-tight text-neutral-800">Meals Today</h2>
          <Link className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-red-500/25 transition-all duration-300 hover:shadow-red-500/40 hover:-translate-y-0.5 active:scale-95" href="/add-food">
            <PlusCircle size={16} className="transition-transform group-hover:rotate-90 duration-300" />
            Log Meal
          </Link>
        </div>

        {meals.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-[2rem] border border-dashed border-red-200/50 bg-white/40 backdrop-blur-xl p-12 text-center shadow-[0_8px_32px_rgba(0,0,0,0.03)]">
            <div className="rounded-3xl bg-gradient-to-br from-red-50 to-orange-50 p-5 text-orange-500 shadow-inner">
              <PlusCircle size={32} strokeWidth={1.5} />
            </div>
            <p className="text-sm font-bold text-neutral-500 leading-relaxed max-w-xs">
              No meals logged yet today.<br/>Log some Dal Bhat, Momo, or Dhido to track!
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {meals.map((meal) => (
              <li key={meal.id} className="group flex items-center justify-between rounded-[1.5rem] border border-white/80 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_12px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-0.5">
                <div className="flex flex-col gap-1">
                  <p className="font-bold text-lg capitalize text-neutral-900">{meal.food_items?.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-neutral-100/80 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-neutral-500 shadow-sm border border-neutral-200/50">
                      {meal.meal_time}
                    </span>
                    <span className="text-xs font-bold text-neutral-400">
                      {meal.portion_size} <span className="uppercase text-[9px] tracking-widest">{meal.food_items?.unit_type}</span>
                    </span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="rounded-[1rem] bg-gradient-to-br from-orange-50 to-red-50 px-4 py-2 text-orange-600 font-black tracking-tight border border-orange-200/50 shadow-inner transition-transform group-hover:scale-105">
                    {Math.round((meal.food_items?.calories_per_unit || 0) * meal.portion_size)} <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500/80 ml-0.5">kcal</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
