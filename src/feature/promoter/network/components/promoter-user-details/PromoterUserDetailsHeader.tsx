import { ArrowLeft } from "lucide-react";

type HeaderProps = {
  onBack: () => void;
};

export default function PromoterUserDetailsHeader({ onBack }: HeaderProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div>
        <h1 className="text-xl font-bold text-heading-color md:text-2xl">
          User Profile
        </h1>
        <p className="text-sm text-muted-foreground md:text-base">
          View onboarding progress and user information
        </p>
      </div>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 self-start text-xs font-medium text-icon-1-color hover:opacity-80 md:text-sm"
      >
        <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" />
        Back to Promoter Detail
      </button>
    </div>
  );
}
