"use client";

import { useTranslations } from "next-intl";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CONTENT_TYPE_KEYS } from "@/lib/i18n/labels";
import type { ContentType } from "@/types/generation";

interface ContentTypeSelectProps {
  value: ContentType;
  onChange: (value: ContentType) => void;
  disabled?: boolean;
}

const contentTypes = Object.keys(CONTENT_TYPE_KEYS) as ContentType[];

export function ContentTypeSelect({
  value,
  onChange,
  disabled,
}: ContentTypeSelectProps) {
  const t = useTranslations("generate");
  const tTypes = useTranslations("contentTypes");

  return (
    <div className="space-y-2">
      <Label>{t("contentType")}</Label>
      <Select
        value={value}
        onValueChange={(v) => onChange(v as ContentType)}
        disabled={disabled}
      >
        <SelectTrigger className="w-full bg-background">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {contentTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {tTypes(CONTENT_TYPE_KEYS[type])}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
