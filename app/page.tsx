"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function HomePage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/sign-in");
        return;
      }

      setEmail(user.email ?? null);
      setLoading(false);
    };

    void loadSession();
  }, [router]);

  const onSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/sign-in");
  };

  if (loading) {
    return <main className="p-6">Checking session...</main>;
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-4 p-6">
      <h1 className="text-3xl font-semibold">DietSathi</h1>
      <p className="text-neutral-700">Signed in as {email}</p>
      <div className="flex gap-3">
        <button className="rounded-md bg-black px-4 py-2 text-white" onClick={onSignOut}>
          Sign out
        </button>
        <Link className="rounded-md border px-4 py-2" href="/add-food">
          Log meal
        </Link>
        <Link className="rounded-md border px-4 py-2" href="/sign-up">
          Create another account
        </Link>
      </div>
    </main>
  );
}
