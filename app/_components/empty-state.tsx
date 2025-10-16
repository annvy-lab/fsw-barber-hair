import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title?: string;
  description?: string;
}

const EmptyState = ({ icon: Icon, title, description }: EmptyStateProps) => {
  return (
    <div className="w-full max-w-full flex flex-col gap-0 items-center text-center">
      <Icon size={55} strokeWidth={1.2} className="mb-2 text-foreground/60" />
      <p className="text-xl font-semibold text-foreground">{title}</p>
      {description && (
        <p className="text-sm text-foreground/70 max-w-[85%]">{description}</p>
      )}
    </div>
  );
};

export default EmptyState;
