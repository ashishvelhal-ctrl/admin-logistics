import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  growth: string;
  Icon: LucideIcon;
}

export default function StatCard({
  label,
  value,
  growth,
  Icon,
}: StatCardProps) {
  return (
    <div className="bg-[#2E705F] rounded-2xl p-5 flex items-center justify-between shadow-sm">
      <div>
        <p className="text-sm font-medium text-white/80">{label}</p>
        <p className="text-3xl font-bold text-white mt-1">{value}</p>
        <p className="text-xs text-[#7ADB93] mt-1">{growth}</p>
      </div>

      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  );
}
