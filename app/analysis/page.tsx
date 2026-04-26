"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { BarChart, Activity, TrendingUp, CalendarDays } from "lucide-react";

type DailySummary = {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

export default function AnalysisPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [summaries, setSummaries] = useState<DailySummary[]>([]);
  const [goals, setGoals] = useState({ calories: 2000, protein: 150, carbs: 250, fats: 65 });

  useEffect(() => {
    const savedGoals = localStorage.getItem("dietsathi_goals");
    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals));
      } catch (e) {}
    }

    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/sign-in");
        return;
      }

      // Fetch last 7 days of meals
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const startDate = sevenDaysAgo.toISOString().slice(0, 10);

      const { data, error } = await supabase
        .from("meals")
        .select(`
          portion_size,
          date,
          food_items (
            calories_per_unit,
            protein_per_unit,
            carbs_per_unit,
            fats_per_unit
          )
        `)
        .eq("user_id", user.id)
        .gte("date", startDate)
        .order("date", { ascending: false });

      if (!error && data) {
        // Group by date
        const grouped = data.reduce((acc: Record<string, DailySummary>, meal: any) => {
          const d = meal.date;
          if (!acc[d]) {
            acc[d] = { date: d, calories: 0, protein: 0, carbs: 0, fats: 0 };
          }
          const p = meal.portion_size;
          const f = meal.food_items;
          if (f) {
            acc[d].calories += (f.calories_per_unit || 0) * p;
            acc[d].protein += (f.protein_per_unit || 0) * p;
            acc[d].carbs += (f.carbs_per_unit || 0) * p;
            acc[d].fats += (f.fats_per_unit || 0) * p;
          }
          return acc;
        }, {});

        setSummaries(Object.values(grouped).sort((a, b) => b.date.localeCompare(a.date)));
      }

      setLoading(false);
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <div className="h-8 w-48 animate-pulse rounded-md bg-neutral-200"></div>
        <div className="mt-8 space-y-4">
          <div className="h-24 w-full animate-pulse rounded-2xl bg-neutral-200"></div>
          <div className="h-24 w-full animate-pulse rounded-2xl bg-neutral-200"></div>
        </div>
      </main>
    );
  }

  const avgCalories = summaries.length 
    ? Math.round(summaries.reduce((a, b) => a + b.calories, 0) / summaries.length) 
    : 0;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 p-6 pb-24 md:pb-6">
      {/* Background blobs */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-bl from-teal-200/30 to-emerald-200/30 blur-[100px] -z-10 pointer-events-none" />
      <div className="fixed bottom-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tr from-blue-200/30 to-indigo-200/30 blur-[80px] -z-10 pointer-events-none" />

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-2 text-white shadow-sm">
            <BarChart size={20} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent">Analysis</h1>
        </div>
        <p className="text-sm font-medium text-neutral-500 ml-11">Your nutrition trends over the last 7 days.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="group overflow-hidden relative flex flex-col gap-2 rounded-3xl border border-white/60 bg-white/60 backdrop-blur-md p-5 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center gap-2 text-neutral-500">
            <div className="rounded-lg bg-orange-100 p-1.5 text-orange-600">
              <Activity size={16} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Avg Calories</span>
          </div>
          <span className="text-3xl font-extrabold text-neutral-900">{avgCalories} <span className="text-sm font-semibold text-neutral-400">kcal</span></span>
        </div>
        
        <div className="group overflow-hidden relative flex flex-col gap-2 rounded-3xl border border-white/60 bg-white/60 backdrop-blur-md p-5 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center gap-2 text-neutral-500">
            <div className="rounded-lg bg-blue-100 p-1.5 text-blue-600">
              <TrendingUp size={16} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Logged Days</span>
          </div>
          <span className="text-3xl font-extrabold text-neutral-900">{summaries.length} <span className="text-sm font-semibold text-neutral-400">days</span></span>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        <h2 className="text-xl font-extrabold text-neutral-800 flex items-center gap-2">
          <CalendarDays size={20} className="text-neutral-400" />
          History
        </h2>
        {summaries.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-neutral-300 bg-white/50 backdrop-blur-sm p-12 text-center shadow-sm">
            <div className="rounded-full bg-gradient-to-br from-emerald-50 to-teal-50 p-4 text-emerald-400 shadow-inner">
              <BarChart size={32} />
            </div>
            <p className="text-sm font-semibold text-neutral-600 leading-relaxed">No data available yet.<br/>Log meals to see your analysis!</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {summaries.map((day) => {
              const calPercentage = Math.min(100, (day.calories / goals.calories) * 100);
              const isOver = day.calories > goals.calories;
              
              return (
                <li key={day.date} className="group relative flex flex-col gap-3 rounded-3xl border border-white/60 bg-white/60 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900">{new Date(day.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    <span className="font-extrabold text-lg">{Math.round(day.calories)} <span className="text-xs font-semibold text-neutral-400">kcal</span></span>
                  </div>
                  
                  <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100 shadow-inner">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r ${isOver ? "from-red-500 to-rose-600" : "from-emerald-400 to-teal-500"}`}
                      style={{ width: `${calPercentage}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs font-bold text-neutral-500 mt-1 px-1">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>{Math.round(day.protein)}g P</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{Math.round(day.carbs)}g C</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>{Math.round(day.fats)}g F</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
