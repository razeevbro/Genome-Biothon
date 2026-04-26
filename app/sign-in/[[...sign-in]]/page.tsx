"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("users").upsert({ id: user.id, email: user.email ?? email }, { onConflict: "id" });
    }

    router.push("/");
    router.refresh();
  };

  return (
    <main className="mx-auto flex min-h-screen w-full flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-bl from-orange-200/40 to-red-200/40 blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-amber-200/30 to-rose-200/30 blur-[120px] -z-10 pointer-events-none" />

      <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center text-center mb-8 gap-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 shadow-xl shadow-red-500/20 text-white mb-2 rotate-3 hover:rotate-6 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m11 12 2-2"/><path d="M12 20a4 4 0 0 0 4-4v-1a4 4 0 0 0-4-4 4 4 0 0 0-4 4v1a4 4 0 0 0 4 4Z"/><path d="M12 4a4 4 0 0 0-4 4v1a4 4 0 0 0 4 4 4 4 0 0 0 4-4V8a4 4 0 0 0-4-4Z"/></svg>
          </div>
          <h1 className="text-3xl font-black tracking-tighter bg-gradient-to-br from-red-800 via-orange-600 to-amber-600 bg-clip-text text-transparent">DietSathi</h1>
          <p className="text-sm font-semibold text-neutral-500">Welcome back to your nutrition journey</p>
        </div>

        <form className="flex flex-col gap-5 rounded-[2rem] border border-white/60 bg-white/60 backdrop-blur-xl p-8 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)]" onSubmit={onSubmit}>
          
          <label className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 ml-1">Email Address</span>
            <input
              className="w-full rounded-2xl border-2 border-white bg-white/50 px-4 py-3.5 text-sm font-medium text-neutral-800 placeholder:text-neutral-400 focus:border-orange-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm"
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 ml-1">Password</span>
            <input
              className="w-full rounded-2xl border-2 border-white bg-white/50 px-4 py-3.5 text-sm font-medium text-neutral-800 placeholder:text-neutral-400 focus:border-orange-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error && (
            <div className="rounded-xl bg-red-50/80 border border-red-100 p-3 text-center">
              <p className="text-xs font-bold text-red-600">{error}</p>
            </div>
          )}

          <button
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 px-4 py-4 font-bold text-white shadow-lg shadow-red-500/25 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-red-500/30 disabled:opacity-70 disabled:hover:scale-100 disabled:shadow-none"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="mt-2 text-center text-sm font-medium text-neutral-500">
            Don't have an account?{" "}
            <Link className="font-bold text-orange-600 hover:text-red-600 hover:underline underline-offset-4 transition-colors" href="/sign-up">
              Create one now
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
