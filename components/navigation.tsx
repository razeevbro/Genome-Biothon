"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Target, BarChart2, PlusCircle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function Navigation() {
  const pathname = usePathname();
  const [session, setSession] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(!!data.session));
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(!!session);
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (!session) return null;
  if (pathname === "/sign-in" || pathname === "/sign-up") return null;

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/planner", label: "AI Plan", icon: Sparkles },
    { href: "/goals", label: "Goals", icon: Target },
    { href: "/add-food", label: "Add", icon: PlusCircle },
    { href: "/analysis", label: "Analysis", icon: BarChart2 },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[90%] max-w-[400px] -translate-x-1/2 md:sticky md:top-4 md:w-full md:max-w-2xl md:translate-x-0">
      <nav className="flex justify-between rounded-[2rem] border border-white/20 bg-white/70 px-4 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl md:justify-start md:gap-8 md:bg-white/80">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group relative flex flex-col items-center gap-1 p-2 transition-all duration-300 md:flex-row md:px-4 ${
                isActive ? "scale-110 text-red-600" : "text-neutral-400 hover:text-neutral-800"
              }`}
            >
              <div className={`relative flex items-center justify-center transition-all duration-300 ${isActive ? "drop-shadow-[0_4px_8px_rgba(220,38,38,0.3)]" : ""}`}>
                <Icon size={22} className={isActive ? "fill-red-500/10 text-red-600" : "stroke-[1.5px]"} />
              </div>
              <span className={`text-[10px] font-bold tracking-wide transition-all md:text-sm ${isActive ? "opacity-100" : "opacity-0 md:opacity-100 h-0 md:h-auto overflow-hidden"}`}>
                {link.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 h-1 w-1 rounded-full bg-red-500 md:hidden" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
