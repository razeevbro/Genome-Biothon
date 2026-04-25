"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      const code = "code" in signUpError ? String(signUpError.code ?? "") : "";
      const details = code ? ` (${code})` : "";
      setError(`${signUpError.message}${details}`);
      setIsLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { error: profileError } = await supabase
        .from("users")
        .upsert({ id: user.id, email: user.email ?? email }, { onConflict: "id" });

      if (profileError) {
        const details = profileError.code ? ` (${profileError.code})` : "";
        setError(`Profile save failed: ${profileError.message}${details}`);
        setIsLoading(false);
        return;
      }
    }

    setMessage("Account created. If email confirmation is enabled, verify your email before signing in.");
    setIsLoading(false);
    router.push("/sign-in");
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center p-4">
      <form className="w-full space-y-4 rounded-xl border p-6" onSubmit={onSubmit}>
        <h1 className="text-2xl font-semibold">Sign up</h1>
        <input
          className="w-full rounded-md border px-3 py-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <input
          className="w-full rounded-md border px-3 py-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={6}
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {message ? <p className="text-sm text-green-700">{message}</p> : null}
        <button
          className="w-full rounded-md bg-black px-3 py-2 text-white disabled:opacity-60"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create account"}
        </button>
        <p className="text-sm text-neutral-600">
          Already have an account?{" "}
          <Link className="underline" href="/sign-in">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}
