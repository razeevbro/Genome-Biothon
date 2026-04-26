"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, User, Calendar, UtensilsCrossed, Droplet, Leaf, Target } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/sign-in");
        return;
      }
      setEmail(user.email || "");

      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      if (data) {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [router]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 p-6 pb-24">
      {/* Background blobs */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-bl from-blue-200/40 to-indigo-200/40 blur-[100px] -z-10 pointer-events-none" />

      <div className="flex items-center gap-3">
        <Link href="/" className="rounded-full p-2 bg-white/50 border border-neutral-200 hover:bg-neutral-100 transition-colors shadow-sm">
          <ChevronLeft size={20} className="text-neutral-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent">My Profile</h1>
          <p className="text-sm font-medium text-neutral-500">Your saved health data and plans.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-3xl border border-white/60 bg-white/60 backdrop-blur-md p-6 sm:p-8 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-4 border-b border-neutral-200/60 pb-5">
          <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-white shadow-inner">
            <User size={32} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-800">{email}</h2>
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">DietSathi Member</p>
          </div>
        </div>

        <div className="mt-2">
          <h3 className="text-xl font-black text-neutral-800 mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-blue-500" /> Saved Diet Plan
          </h3>

          {loading ? (
             <div className="animate-pulse space-y-3">
               <div className="h-20 bg-neutral-200/50 rounded-2xl"></div>
               <div className="h-20 bg-neutral-200/50 rounded-2xl"></div>
             </div>
          ) : profile?.current_plan ? (
            <div className="flex flex-col gap-4">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                Last Updated: {new Date(profile.updated_at || profile.created_at || Date.now()).toLocaleDateString()}
              </p>
              {[
                { id: "breakfast", label: "Breakfast", icon: Droplet, color: "text-blue-500", bg: "bg-blue-50" },
                { id: "lunch", label: "Lunch", icon: UtensilsCrossed, color: "text-emerald-500", bg: "bg-emerald-50" },
                { id: "snack", label: "Khaja (Snack)", icon: Leaf, color: "text-amber-500", bg: "bg-amber-50" },
                { id: "dinner", label: "Dinner", icon: Target, color: "text-indigo-500", bg: "bg-indigo-50" },
              ].map((meal) => {
                const Icon = meal.icon;
                const data = profile.current_plan[meal.id];
                if (!data) return null;
                return (
                  <div key={meal.id} className="group relative flex flex-col gap-2 rounded-2xl border border-neutral-100 bg-white/80 backdrop-blur-sm p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`rounded-lg ${meal.bg} p-1.5 ${meal.color}`}>
                          <Icon size={14} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">{meal.label}</span>
                      </div>
                      <span className="font-extrabold text-neutral-800">{data.calories} <span className="text-[10px] font-semibold text-neutral-400">kcal</span></span>
                    </div>
                    <div className="mt-1">
                      <h3 className="font-bold text-neutral-900">{data.name}</h3>
                      <p className="text-xs font-medium text-neutral-500 mt-1">{data.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center p-8 bg-neutral-50/80 rounded-2xl border border-neutral-200 border-dashed">
              <p className="text-sm font-semibold text-neutral-500 mb-4">You haven't saved any AI diet plan yet.</p>
              <Link href="/planner" className="inline-block bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-105">
                Generate Plan
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
