"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CONTENT_TYPE_LABELS, type ContentType } from "@/types/generation";

interface ContentTypeSelectProps {
  value: ContentType;
  onChange: (value: ContentType) => void;
  disabled?: boolean;
}

const contentTypes = Object.keys(CONTENT_TYPE_LABELS) as ContentType[];

export function ContentTypeSelect({
  value,
  onChange,
  disabled,
}: ContentTypeSelectProps) {
  return (
    <div className="space-y-2">
      <Label>Content type</Label>
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
              {CONTENT_TYPE_LABELS[type]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
