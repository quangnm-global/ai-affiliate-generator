"use client";

import { useTranslations } from "next-intl";
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
  const t = useTranslations("settings");
  const tErrors = useTranslations("errors");
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(tErrors("profileUpdated"));
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">{t("displayName")}</Label>
        <Input
          id="fullName"
          name="fullName"
          defaultValue={fullName ?? ""}
          placeholder={t("yourName")}
          className="max-w-md bg-background"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          id="email"
          value={email}
          disabled
          className="max-w-md bg-muted"
        />
        <p className="text-xs text-muted-foreground">{t("emailReadonly")}</p>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? t("saving") : t("saveChanges")}
      </Button>
    </form>
  );
}
