"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sanitizeRedirectPath } from "@/lib/auth/routes";
import { createClient } from "@/lib/supabase/client";
import { magicLinkSchema } from "@/lib/validations/auth";

interface MagicLinkFormProps {
  redirectTo: string;
}

export function MagicLinkForm({ redirectTo }: MagicLinkFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const parsed = magicLinkSchema.safeParse({ email });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid email");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const callbackUrl = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(sanitizeRedirectPath(redirectTo))}`;

    const { error } = await supabase.auth.signInWithOtp({
      email: parsed.data.email,
      options: {
        emailRedirectTo: callbackUrl,
        shouldCreateUser: true,
      },
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setSent(true);
    toast.success("Magic link sent! Check your inbox.");
  }

  if (sent) {
    return (
      <div className="rounded-lg border bg-muted/50 p-4 text-center text-sm">
        <p className="font-medium">Check your email</p>
        <p className="mt-1 text-muted-foreground">
          We sent a sign-in link to <strong>{email}</strong>
        </p>
        <Button
          type="button"
          variant="link"
          className="mt-2"
          onClick={() => setSent(false)}
        >
          Use a different email
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="magic-email">Email</Label>
        <Input
          id="magic-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <p className="text-sm text-muted-foreground">
        We&apos;ll email you a secure link to sign in — no password needed.
      </p>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Sending..." : "Send magic link"}
      </Button>
    </form>
  );
}
