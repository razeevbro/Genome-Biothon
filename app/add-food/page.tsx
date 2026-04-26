"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { ChevronLeft, Save, Utensils } from "lucide-react";
import Link from "next/link";

type FoodItem = {
  id: string;
  name: string;
  unit_type: string;
};

const mealOptions = ["breakfast", "lunch", "dinner", "snack"] as const;

export default function AddFoodPage() {
  const router = useRouter();
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [foodItemId, setFoodItemId] = useState("");
  const [portionSize, setPortionSize] = useState("1");
  const [mealTime, setMealTime] = useState<(typeof mealOptions)[number]>("breakfast");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/sign-in");
        return;
      }

      setUserId(user.id);

      const { data, error: foodError } = await supabase
        .from("food_items")
        .select("id,name,unit_type")
        .order("name");

      if (foodError) {
        toast.error(foodError.message);
        setLoading(false);
        return;
      }

      const list = (data ?? []) as FoodItem[];
      setFoods(list);
      if (list[0]) {
        setFoodItemId(list[0].id);
      }
      setLoading(false);
    };

    void bootstrap();
  }, [router]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!userId) {
      toast.error("Please sign in first.");
      return;
    }

    const parsedPortion = Number(portionSize);
    if (!Number.isFinite(parsedPortion) || parsedPortion <= 0) {
      toast.error("Portion size must be greater than 0.");
      return;
    }

    setIsSaving(true);

    const { error: insertError } = await supabase.from("meals").insert({
      user_id: userId,
      food_item_id: foodItemId,
      portion_size: parsedPortion,
      meal_time: mealTime,
      date,
    });

    if (insertError) {
      toast.error(insertError.message);
      setIsSaving(false);
      return;
    }

    toast.success("Meal logged successfully!");
    setIsSaving(false);
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-xl p-6">
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
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-6 p-6 pb-24">
      {/* Background blobs */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-bl from-rose-200/40 to-orange-200/40 blur-[100px] -z-10 pointer-events-none" />

      <div className="flex items-center gap-3">
        <Link href="/" className="rounded-full p-2 bg-white/50 border border-neutral-200 hover:bg-neutral-100 transition-colors shadow-sm">
          <ChevronLeft size={20} className="text-neutral-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent">Log Meal</h1>
          <p className="text-sm font-medium text-neutral-500">Track what you eat to stay on top of your goals.</p>
        </div>
      </div>

      <form className="flex flex-col gap-5 rounded-3xl border border-white/60 bg-white/60 backdrop-blur-md p-6 sm:p-8 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)]" onSubmit={onSubmit}>
        <label className="flex flex-col gap-2 relative">
          <span className="text-sm font-bold text-neutral-800 flex items-center gap-2">
            <Utensils size={16} className="text-orange-500" />
            Food item
          </span>
          <select
            className="w-full rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 font-semibold text-neutral-800 outline-none transition-all focus:border-orange-400 focus:ring-4 focus:ring-orange-400/10"
            value={foodItemId}
            onChange={(event) => setFoodItemId(event.target.value)}
            required
          >
            {foods.map((food) => (
              <option key={food.id} value={food.id}>
                {food.name} ({food.unit_type})
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold text-neutral-800">Portion size</span>
            <input
              className="w-full rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 font-semibold text-neutral-800 outline-none transition-all focus:border-orange-400 focus:ring-4 focus:ring-orange-400/10"
              type="number"
              step="0.1"
              min="0.1"
              value={portionSize}
              onChange={(event) => setPortionSize(event.target.value)}
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold text-neutral-800">Meal time</span>
            <select
              className="w-full rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 font-semibold capitalize text-neutral-800 outline-none transition-all focus:border-orange-400 focus:ring-4 focus:ring-orange-400/10"
              value={mealTime}
              onChange={(event) => setMealTime(event.target.value as (typeof mealOptions)[number])}
            >
              {mealOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-bold text-neutral-800">Date</span>
          <input
            className="w-full rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 font-semibold text-neutral-800 outline-none transition-all focus:border-orange-400 focus:ring-4 focus:ring-orange-400/10"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
          />
        </label>

        <button
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-3.5 font-bold text-white shadow-md shadow-orange-500/20 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/30 disabled:opacity-60 disabled:hover:scale-100"
          type="submit"
          disabled={isSaving || !foodItemId}
        >
          {isSaving ? "Saving..." : <><Save size={18} /> Save meal</>}
        </button>
      </form>
    </main>
  );
}
