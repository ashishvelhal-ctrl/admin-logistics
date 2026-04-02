interface MobileStat {
  label: string;
  value: string;
  change: string;
}

interface MobileThreeStatsProps {
  stats: [MobileStat, MobileStat, MobileStat];
}

export function MobileThreeStats({ stats }: MobileThreeStatsProps) {
  return (
    <section className="grid grid-cols-3 gap-2">
      {stats.map((stat) => (
        <article
          key={stat.label}
          className="bg-white border border-border-stroke rounded-xl p-2.5 min-h-24"
        >
          <p className="text-[11px] text-inactive-text font-medium">
            {stat.label}
          </p>
          <p className="text-[28px] font-semibold text-heading-color mt-1 leading-none">
            {stat.value}
          </p>
          <p className="text-[10px] text-icon-text mt-0.5">{stat.change}</p>
        </article>
      ))}
    </section>
  );
}
