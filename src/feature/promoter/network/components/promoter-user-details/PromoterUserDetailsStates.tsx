import { Button } from "@/components/ui/button";

type StateProps = {
  title: string;
  ctaLabel: string;
  onCtaClick: () => void;
  description?: string;
};

export function PromoterUserDetailsState({
  title,
  ctaLabel,
  onCtaClick,
  description,
}: StateProps) {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-4">
      <div className="text-lg">{title}</div>
      {description ? (
        <div className="text-sm text-gray-500">{description}</div>
      ) : null}
      <Button onClick={onCtaClick}>{ctaLabel}</Button>
    </div>
  );
}
