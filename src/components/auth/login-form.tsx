"use client";

import { useState } from "react";

import { EmailAuthForm } from "@/components/auth/email-auth-form";
import { MagicLinkForm } from "@/components/auth/magic-link-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface LoginFormProps {
  redirectTo: string;
}

type LoginMethod = "email" | "magic-link";

export function LoginForm({ redirectTo }: LoginFormProps) {
  const [method, setMethod] = useState<LoginMethod>("email");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex rounded-lg border p-1">
        <Button
          type="button"
          variant={method === "email" ? "default" : "ghost"}
          size="sm"
          className="flex-1"
          onClick={() => setMethod("email")}
        >
          Email & password
        </Button>
        <Button
          type="button"
          variant={method === "magic-link" ? "default" : "ghost"}
          size="sm"
          className="flex-1"
          onClick={() => setMethod("magic-link")}
        >
          Magic link
        </Button>
      </div>

      {method === "email" ? (
        <EmailAuthForm redirectTo={redirectTo} />
      ) : (
        <MagicLinkForm redirectTo={redirectTo} />
      )}

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">
          {method === "email" ? "Passwordless option" : "Prefer a password?"}
        </span>
        <Separator className="flex-1" />
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          setMethod(method === "email" ? "magic-link" : "email")
        }
      >
        {method === "email"
          ? "Sign in with magic link instead"
          : "Sign in with email & password instead"}
      </Button>
    </div>
  );
}
