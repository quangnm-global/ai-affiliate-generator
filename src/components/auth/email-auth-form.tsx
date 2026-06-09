"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import {
  signInSchema,
  signUpSchema,
  type SignInInput,
  type SignUpInput,
} from "@/lib/validations/auth";
import { sanitizeRedirectPath } from "@/lib/auth/routes";

interface EmailAuthFormProps {
  redirectTo: string;
}

type AuthMode = "signin" | "signup";

export function EmailAuthForm({ redirectTo }: EmailAuthFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignIn(data: SignInInput) {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Signed in successfully");
    router.push(sanitizeRedirectPath(redirectTo));
    router.refresh();
  }

  async function handleSignUp(data: SignUpInput) {
    const supabase = createClient();
    const callbackUrl = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(sanitizeRedirectPath(redirectTo))}`;

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: callbackUrl,
      },
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    if (authData.session) {
      toast.success("Account created successfully");
      router.push(sanitizeRedirectPath(redirectTo));
      router.refresh();
      return;
    }

    toast.success("Check your email to confirm your account.");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (mode === "signin") {
      const parsed = signInSchema.safeParse({ email, password });
      if (!parsed.success) {
        toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
        setLoading(false);
        return;
      }
      await handleSignIn(parsed.data);
    } else {
      const parsed = signUpSchema.safeParse({ email, password });
      if (!parsed.success) {
        toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
        setLoading(false);
        return;
      }
      await handleSignUp(parsed.data);
    }

    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex rounded-lg border p-1">
        <Button
          type="button"
          variant={mode === "signin" ? "default" : "ghost"}
          size="sm"
          className="flex-1"
          onClick={() => setMode("signin")}
        >
          Sign in
        </Button>
        <Button
          type="button"
          variant={mode === "signup" ? "default" : "ghost"}
          size="sm"
          className="flex-1"
          onClick={() => setMode("signup")}
        >
          Sign up
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            placeholder={mode === "signup" ? "Min. 8 characters" : "Your password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={mode === "signup" ? 8 : 1}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading
            ? "Please wait..."
            : mode === "signin"
              ? "Sign in with email"
              : "Create account"}
        </Button>
      </form>
    </div>
  );
}
