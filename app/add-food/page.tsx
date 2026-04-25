"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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
        setError(foodError.message);
        return;
      }

      const list = (data ?? []) as FoodItem[];
      setFoods(list);
      if (list[0]) {
        setFoodItemId(list[0].id);
      }
    };

    void bootstrap();
  }, [router]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!userId) {
      setError("Please sign in first.");
      return;
    }

    const parsedPortion = Number(portionSize);
    if (!Number.isFinite(parsedPortion) || parsedPortion <= 0) {
      setError("Portion size must be greater than 0.");
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
      setError(insertError.message);
      setIsSaving(false);
      return;
    }

    setSuccess("Meal logged successfully.");
    setIsSaving(false);
    router.push("/");
    router.refresh();
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-4 p-6">
      <h1 className="text-3xl font-semibold">Log Your Meal</h1>
      <p className="text-sm text-neutral-600">Add one food entry for your selected meal time.</p>

      <form className="space-y-4 rounded-xl border p-4" onSubmit={onSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium">Food item</span>
          <select
            className="w-full rounded-md border px-3 py-2"
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

        <label className="block space-y-2">
          <span className="text-sm font-medium">Meal time</span>
          <select
            className="w-full rounded-md border px-3 py-2"
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

        <label className="block space-y-2">
          <span className="text-sm font-medium">Portion size</span>
          <input
            className="w-full rounded-md border px-3 py-2"
            type="number"
            step="0.1"
            min="0.1"
            value={portionSize}
            onChange={(event) => setPortionSize(event.target.value)}
            required
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium">Date</span>
          <input
            className="w-full rounded-md border px-3 py-2"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
          />
        </label>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {success ? <p className="text-sm text-green-700">{success}</p> : null}

        <div className="flex gap-3">
          <button
            className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
            type="submit"
            disabled={isSaving || !foodItemId}
          >
            {isSaving ? "Saving..." : "Save meal"}
          </button>
          <button className="rounded-md border px-4 py-2" type="button" onClick={() => router.push("/")}>
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
