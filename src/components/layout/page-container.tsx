interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "wide" | "full";
}

const sizeClasses = {
  default: "max-w-3xl",
  wide: "max-w-5xl",
  full: "max-w-6xl",
};

export function PageContainer({
  children,
  className = "",
  size = "default",
}: PageContainerProps) {
  return (
    <div
      className={`mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 ${sizeClasses[size]} ${className}`}
    >
      {children}
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="mt-2 shrink-0 sm:mt-0">{action}</div>}
    </div>
  );
}
