"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { updateProfile } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileFormProps {
  fullName: string | null;
  email: string;
}

export function ProfileForm({ fullName, email }: ProfileFormProps) {
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Profile updated");
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Display name</Label>
        <Input
          id="fullName"
          name="fullName"
          defaultValue={fullName ?? ""}
          placeholder="Your name"
          className="max-w-md bg-background"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={email}
          disabled
          className="max-w-md bg-muted"
        />
        <p className="text-xs text-muted-foreground">
          Email cannot be changed here.
        </p>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
