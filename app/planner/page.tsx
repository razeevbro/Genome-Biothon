"use client";

import { useState } from "react";
import { Sparkles, Activity, Target, UtensilsCrossed, Leaf, Droplet, Drumstick, Stethoscope, Save, AlertTriangle, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function PlannerPage() {
  const [goal, setGoal] = useState("maintain");
  const [dietType, setDietType] = useState("veg");
  const [region, setRegion] = useState("Hilly");
  const [availability, setAvailability] = useState("standard");
  const [planMeta, setPlanMeta] = useState<null | any>(null);
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [diseases, setDiseases] = useState<string[]>([]);
  // Base states in metric
  const [weightKg, setWeightKg] = useState(70);
  const [heightCm, setHeightCm] = useState(165);
  
  // Units
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm");
  
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<null | any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [aiSummary, setAiSummary] = useState("");

  // BMI always uses metric
  const bmi = weightKg / ((heightCm / 100) ** 2);
  let bmiCategory = "Normal";
  let bmiColor = "text-emerald-600 bg-emerald-100";
  if (bmi < 18.5) {
    bmiCategory = "Underweight";
    bmiColor = "text-blue-600 bg-blue-100";
  } else if (bmi >= 25 && bmi < 29.9) {
    bmiCategory = "Overweight";
    bmiColor = "text-orange-600 bg-orange-100";
  } else if (bmi >= 30) {
    bmiCategory = "Obese";
    bmiColor = "text-red-600 bg-red-100";
  }

  // Display values
  const displayWeight = weightUnit === "kg" ? weightKg : Math.round(weightKg * 2.20462);
  const handleWeightChange = (val: number) => {
    if (weightUnit === "kg") setWeightKg(val);
    else setWeightKg(Math.round(val / 2.20462));
  };

  const totalInches = Math.round(heightCm / 2.54);
  const handleHeightChange = (val: number) => {
    if (heightUnit === "cm") setHeightCm(val);
    else setHeightCm(Math.round(val * 2.54));
  };

  const generatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPlan(null);
    setPlanMeta(null);
    setAiSummary("");

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, dietPref: dietType, weight: weightKg, height: heightCm, gender, region, availability, age, diseases })
      });
      const data = await response.json();
      
      if (data.success) {
        setPlan(data.plan);
        setPlanMeta(data.meta);
        setAiSummary(data.aiSummary || "");
      } else {
        toast.error(data.error || "Failed to generate plan");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const savePlan = async () => {
    if (!plan) return;
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to save your plan.");
        setIsSaving(false);
        return;
      }
      
      const { error } = await supabase
        .from('user_profiles')
        .upsert({ user_id: user.id, current_plan: plan }, { onConflict: 'user_id' });
        
      if (error) throw error;
      toast.success("Plan saved to your profile!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save plan.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 p-6 pb-24 md:pb-6">
      {/* Background blobs */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-bl from-orange-200/40 to-red-200/40 blur-[100px] -z-10 pointer-events-none" />

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-gradient-to-br from-red-500 to-orange-500 p-2 text-white shadow-sm">
            <Sparkles size={20} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-red-800 to-orange-600 bg-clip-text text-transparent">AI Plan</h1>
        </div>
        <p className="text-sm font-medium text-neutral-500 ml-11">Personalized Nepali Diet Planner.</p>
      </div>

      {!plan && (
        <form onSubmit={generatePlan} className="flex flex-col gap-6 rounded-3xl border border-white/60 bg-white/60 backdrop-blur-md p-6 sm:p-8 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)]">
          
          <div className="flex flex-col gap-5 p-4 rounded-2xl bg-white/50 border border-neutral-100 shadow-sm">
            {/* HEIGHT */}
            <label className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-neutral-800 flex items-center gap-2">
                  <Activity size={16} className="text-blue-500" />
                  Your Height
                </span>
                <div className="flex bg-neutral-200/50 rounded-lg p-0.5">
                  <button type="button" onClick={() => setHeightUnit("cm")} className={`text-[10px] font-bold px-2 py-1 rounded-md transition-all ${heightUnit === "cm" ? "bg-white shadow-sm text-blue-600" : "text-neutral-500 hover:text-neutral-700"}`}>CM</button>
                  <button type="button" onClick={() => setHeightUnit("ft")} className={`text-[10px] font-bold px-2 py-1 rounded-md transition-all ${heightUnit === "ft" ? "bg-white shadow-sm text-blue-600" : "text-neutral-500 hover:text-neutral-700"}`}>FT/IN</button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={heightUnit === "cm" ? "100" : "40"}
                  max={heightUnit === "cm" ? "220" : "86"}
                  value={heightUnit === "cm" ? heightCm : totalInches}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <span className="font-black text-blue-600 w-16 text-right text-sm">
                  {heightUnit === "cm" ? `${heightCm} cm` : `${Math.floor(totalInches / 12)}' ${totalInches % 12}"`}
                </span>
              </div>
            </label>

            {/* WEIGHT */}
            <label className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-neutral-800 flex items-center gap-2">
                  <Activity size={16} className="text-red-500" />
                  Your Weight
                </span>
                <div className="flex bg-neutral-200/50 rounded-lg p-0.5">
                  <button type="button" onClick={() => setWeightUnit("kg")} className={`text-[10px] font-bold px-2 py-1 rounded-md transition-all ${weightUnit === "kg" ? "bg-white shadow-sm text-red-600" : "text-neutral-500 hover:text-neutral-700"}`}>KG</button>
                  <button type="button" onClick={() => setWeightUnit("lbs")} className={`text-[10px] font-bold px-2 py-1 rounded-md transition-all ${weightUnit === "lbs" ? "bg-white shadow-sm text-red-600" : "text-neutral-500 hover:text-neutral-700"}`}>LBS</button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={weightUnit === "kg" ? "30" : "66"}
                  max={weightUnit === "kg" ? "150" : "330"}
                  value={displayWeight}
                  onChange={(e) => handleWeightChange(Number(e.target.value))}
                  className="w-full accent-red-500"
                />
                <span className="font-black text-red-600 w-16 text-right text-sm">
                  {displayWeight} {weightUnit}
                </span>
              </div>
            </label>

            {/* AGE */}
            <label className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-neutral-800 flex items-center gap-2">
                  <Activity size={16} className="text-emerald-500" />
                  Your Age
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
                <span className="font-black text-emerald-600 w-16 text-right text-sm">
                  {age} yrs
                </span>
              </div>
            </label>

            {/* GENDER */}
            <label className="flex flex-col gap-3">
              <span className="text-sm font-bold text-neutral-800 flex items-center gap-2">
                <User size={16} className="text-blue-500" />
                Biological Gender
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender("male")}
                  className={`rounded-xl border p-3 text-xs font-bold transition-all ${
                    gender === "male"
                      ? "border-blue-400 bg-blue-50 text-blue-700 shadow-sm"
                      : "border-neutral-200 bg-white/80 text-neutral-500 hover:bg-neutral-50"
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setGender("female")}
                  className={`rounded-xl border p-3 text-xs font-bold transition-all ${
                    gender === "female"
                      ? "border-pink-400 bg-pink-50 text-pink-700 shadow-sm"
                      : "border-neutral-200 bg-white/80 text-neutral-500 hover:bg-neutral-50"
                  }`}
                >
                  Female
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-200/60">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Current BMI</span>
              <div className="flex items-center gap-2">
                <span className="font-black text-neutral-800">{bmi.toFixed(1)}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${bmiColor}`}>
                  {bmiCategory}
                </span>
              </div>
            </div>
          </div>

          <label className="flex flex-col gap-3">
            <span className="text-sm font-bold text-neutral-800 flex items-center gap-2">
              <Target size={16} className="text-red-500" />
              Primary Goal
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "lose", label: "Lose Weight" },
                { id: "maintain", label: "Maintain" },
                { id: "gain", label: "Gain Muscle" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setGoal(opt.id)}
                  className={`rounded-xl border p-3 text-xs font-bold transition-all ${
                    goal === opt.id
                      ? "border-red-400 bg-red-50 text-red-700 shadow-sm"
                      : "border-neutral-200 bg-white/80 text-neutral-500 hover:bg-neutral-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </label>

          <label className="flex flex-col gap-3">
            <span className="text-sm font-bold text-neutral-800 flex items-center gap-2">
              <UtensilsCrossed size={16} className="text-orange-500" />
              Diet Preference
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDietType("veg")}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-bold transition-all ${
                  dietType === "veg"
                    ? "border-orange-400 bg-orange-50 text-orange-700 shadow-sm"
                    : "border-neutral-200 bg-white/80 text-neutral-500 hover:bg-neutral-50"
                }`}
              >
                <Leaf size={16} /> Veg
              </button>
              <button
                type="button"
                onClick={() => setDietType("non-veg")}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-bold transition-all ${
                  dietType === "non-veg"
                    ? "border-orange-400 bg-orange-50 text-orange-700 shadow-sm"
                    : "border-neutral-200 bg-white/80 text-neutral-500 hover:bg-neutral-50"
                }`}
              >
                <Drumstick size={16} /> Non-Veg
              </button>
            </div>
          </label>

          <label className="flex flex-col gap-3">
            <span className="text-sm font-bold text-neutral-800 flex items-center gap-2">
              <Stethoscope size={16} className="text-rose-500" />
              Medical Conditions (Optional)
            </span>
            <div className="grid grid-cols-2 gap-2">
              {["Diabetes", "Hypertension", "Gastritis", "Uric Acid", "High Cholesterol", "Thyroid", "PCOS", "Celiac Disease", "Lactose Intolerance", "Fatty Liver"].map((disease) => {
                const isActive = diseases.includes(disease);
                return (
                  <button
                    key={disease}
                    type="button"
                    onClick={() => {
                      if (isActive) setDiseases(diseases.filter(d => d !== disease));
                      else setDiseases([...diseases, disease]);
                    }}
                    className={`rounded-xl border p-3 text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      isActive
                        ? "border-rose-400 bg-rose-50 text-rose-700 shadow-sm"
                        : "border-neutral-200 bg-white/80 text-neutral-500 hover:bg-neutral-50"
                    }`}
                  >
                    <div className={`w-3 h-3 rounded flex items-center justify-center border ${isActive ? "border-rose-500 bg-rose-500" : "border-neutral-300 bg-white"}`}>
                      {isActive && <div className="w-1.5 h-1.5 bg-white rounded-sm" />}
                    </div>
                    {disease}
                  </button>
                );
              })}
            </div>
          </label>

          <label className="flex flex-col gap-3">
            <span className="text-sm font-bold text-neutral-800 flex items-center gap-2">
              <Leaf size={16} className="text-orange-500" />
              Geographic Region
            </span>
            <div className="grid grid-cols-3 gap-2">
              {["Himalayan", "Hilly", "Terai"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setRegion(opt)}
                  className={`rounded-xl border p-3 text-xs font-bold transition-all ${
                    region === opt
                      ? "border-orange-400 bg-orange-50 text-orange-700 shadow-sm"
                      : "border-neutral-200 bg-white/80 text-neutral-500 hover:bg-neutral-50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </label>

          <label className="flex flex-col gap-3">
            <span className="text-sm font-bold text-neutral-800 flex items-center gap-2">
              <Leaf size={16} className="text-orange-500" />
              Ingredient Availability
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAvailability("standard")}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-bold transition-all ${
                  availability === "standard"
                    ? "border-orange-400 bg-orange-50 text-orange-700 shadow-sm"
                    : "border-neutral-200 bg-white/80 text-neutral-500 hover:bg-neutral-50"
                }`}
              >
                Standard (City)
              </button>
              <button
                type="button"
                onClick={() => setAvailability("limited")}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-bold transition-all ${
                  availability === "limited"
                    ? "border-orange-400 bg-orange-50 text-orange-700 shadow-sm"
                    : "border-neutral-200 bg-white/80 text-neutral-500 hover:bg-neutral-50"
                }`}
              >
                Limited (Rural)
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-4 py-3.5 font-bold text-white shadow-md shadow-red-500/20 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/30 disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <Sparkles size={18} className="animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Sparkles size={18} /> Generate Plan
              </>
            )}
          </button>
        </form>
      )}

      {loading && !plan && (
        <div className="flex flex-col items-center justify-center gap-4 py-12 text-neutral-500">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-20"></div>
            <div className="relative rounded-full bg-gradient-to-tr from-red-100 to-orange-100 p-4 text-red-500">
              <Sparkles size={32} className="animate-pulse" />
            </div>
          </div>
          <p className="text-sm font-bold animate-pulse">Analyzing Nepali ingredients...</p>
        </div>
      )}

      {plan && !loading && (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-neutral-800">Your Nepali Diet Plan</h2>
            <button
              onClick={() => setPlan(null)}
              className="text-xs font-bold text-red-500 hover:underline"
            >
              Regenerate
            </button>
          </div>

          {planMeta && (
            <div className="flex flex-col gap-3 mb-2">
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 px-2 py-1 rounded-md">
                  Region: {planMeta.region}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
                  Availability: {planMeta.availability === "standard" ? "Standard (City)" : "Limited (Rural)"}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md">
                  Age Group: {planMeta.ageGroup === "child" ? "Child (<15)" : planMeta.ageGroup === "senior" ? "Senior (>55)" : "Adult"}
                </span>
                {planMeta.diseases?.length > 0 && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 px-2 py-1 rounded-md">
                    Conditions: {planMeta.diseases.join(", ")}
                  </span>
                )}
              </div>
              <div className="p-3 bg-white/80 rounded-xl border border-neutral-100 text-xs text-neutral-600 font-medium shadow-sm">
                <span className="font-bold text-neutral-800 block mb-1">Why this plan?</span>
                Based on food availability in the {planMeta.region} region. 
                {planMeta.availability === "limited" ? " We selected highly accessible local crops and ingredients." : " Includes a standard variety of ingredients."}
                {planMeta.ageGroup === "senior" ? " Modified with softer, easy-to-digest foods." : ""}
                {planMeta.diseases?.length > 0 ? ` Carefully filtered to avoid triggering ${planMeta.diseases.join(" or ")}.` : ""}
              </div>
              
              {aiSummary && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 text-xs text-blue-800 font-medium shadow-sm relative overflow-hidden">
                  <Sparkles size={40} className="absolute -right-2 -top-2 text-blue-200 opacity-50" />
                  <span className="font-black text-blue-900 flex items-center gap-1.5 mb-1.5"><Sparkles size={14} className="text-blue-500" /> AI Dietitian Summary</span>
                  {aiSummary}
                </div>
              )}

              {planMeta.proteinWarning && (
                <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-xs text-red-700 font-medium">
                  ⚠️ {planMeta.proteinWarning}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {[
              { id: "breakfast", label: "Breakfast", icon: Droplet, color: "text-blue-500", bg: "bg-blue-50" },
              { id: "lunch", label: "Lunch", icon: UtensilsCrossed, color: "text-emerald-500", bg: "bg-emerald-50" },
              { id: "snack", label: "Khaja (Snack)", icon: Leaf, color: "text-amber-500", bg: "bg-amber-50" },
              { id: "dinner", label: "Dinner", icon: Target, color: "text-indigo-500", bg: "bg-indigo-50" },
            ].map((meal) => {
              const Icon = meal.icon;
              const data = plan[meal.id];
              return (
                <div key={meal.id} className="group relative flex flex-col gap-2 rounded-3xl border border-white/60 bg-white/60 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-0.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`rounded-lg ${meal.bg} p-1.5 ${meal.color}`}>
                        <Icon size={16} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">{meal.label}</span>
                    </div>
                    <span className="font-extrabold text-neutral-800">{data.calories} <span className="text-[10px] font-semibold text-neutral-400">kcal</span></span>
                  </div>
                  <div className="mt-1">
                    <h3 className="font-bold text-lg text-neutral-900">{data.name}</h3>
                    <p className="text-xs font-medium text-neutral-500 leading-relaxed mt-1">{data.desc}</p>
                    
                    {data.alternatives && data.alternatives.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-neutral-100/60">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5 block">Alternatives:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {data.alternatives.map((alt: string, i: number) => (
                            <span key={i} className="text-[10px] font-semibold bg-neutral-100/80 text-neutral-600 px-2 py-1 rounded-md">
                              {alt}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
            <AlertTriangle className="text-rose-600 shrink-0 mt-0.5" size={20} />
            <div className="text-xs text-rose-800 leading-relaxed font-medium">
              <strong className="block mb-1">Medical Disclaimer</strong>
              DietSathi is an AI assistant, not a doctor. Always consult a healthcare professional before changing your diet, especially if managing a chronic illness like diabetes or hypertension.
            </div>
          </div>

          <button
            onClick={savePlan}
            disabled={isSaving}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-neutral-800 to-neutral-700 px-4 py-3.5 font-bold text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-70 disabled:hover:scale-100"
          >
            {isSaving ? "Saving..." : <><Save size={18} /> Save Plan to Profile</>}
          </button>
        </div>
      )}
    </main>
  );
}
