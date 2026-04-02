import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description: string;
  backTo?: string;
}

export default function PageHeader({
  title,
  description,
  backTo = "/dashboardp",
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <section className="px-2 flex flex-col md:flex-row md:items-start md:justify-between gap-2">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-heading-color">
          {title}
        </h1>
        <p className="text-xs md:text-sm text-inactive-text mt-1">
          {description}
        </p>
      </div>
      <button
        type="button"
        onClick={() => navigate({ to: backTo })}
        className="inline-flex items-center gap-2 text-xs md:text-sm text-icon-text hover:opacity-80 pt-2 md:pt-3"
      >
        <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
        Back to Dashboard
      </button>
    </section>
  );
}
