"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-finflow-light">
      <form
        onSubmit={handleSignIn}
        className="card w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">Welcome Back</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn-primary w-full">Sign In</button>
        <p className="text-sm text-center">
          New to FinFlow?{" "}
          <a href="/signup" className="text-finflow-primary">Sign Up</a>
        </p>
      </form>
    </div>
  );
}
