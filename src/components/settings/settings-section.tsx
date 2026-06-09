import { Coins, Mail, User } from "lucide-react";

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function SettingsSection({
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <section className="rounded-2xl border bg-card">
      <div className="border-b px-5 py-4 sm:px-6">
        <h2 className="font-medium">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

interface AccountInfoProps {
  email: string;
  credits: number;
  memberSince: string;
}

export function AccountInfo({ email, credits, memberSince }: AccountInfoProps) {
  const items = [
    { icon: Mail, label: "Email", value: email },
    { icon: Coins, label: "Credits", value: `${credits} remaining` },
    { icon: User, label: "Member since", value: memberSince },
  ];

  return (
    <div className="space-y-4">
      {items.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
            <Icon className="size-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-medium">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
