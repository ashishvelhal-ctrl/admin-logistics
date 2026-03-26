import {
  Image,
  ImageMinus,
  MapPin,
  UserPlus,
  Users,
  Wheat,
} from "lucide-react";

import type { FC } from "react";

interface StatCardProps {
  id: string;
  label: string;
  value: string;
  change: string;
  icon: FC<{ className?: string }>;
}

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: string;
  icon: FC<{ className?: string }>;
}

const activities: ActivityItem[] = [
  {
    id: "1",
    title: "New user registered",
    description: "Ramesh Kumar joined as a farmer",
    time: "5 min ago",
    type: "Farmer",
    icon: UserPlus,
  },
  {
    id: "2",
    title: "New crop added",
    description: "Wheat (Durum) added to catalog",
    time: "5 min ago",
    type: "Crop",
    icon: Wheat,
  },
  {
    id: "3",
    title: "Banner published",
    description: "New Season Sale is now active",
    time: "5 min ago",
    type: "Banner",
    icon: Image,
  },
  {
    id: "4",
    title: "New crop added",
    description: "Wheat (Durum) added to catalog",
    time: "5 min ago",
    type: "Crop",
    icon: Wheat,
  },
];

const dashboardStats: StatCardProps[] = [
  {
    id: "users",
    label: "Total Users",
    value: "2,450",
    change: "+12% this month",
    icon: Users,
  },
  {
    id: "crops",
    label: "Crops Listed",
    value: "186",
    change: "+5% this month",
    icon: Wheat,
  },
  {
    id: "banners",
    label: "Active Banners",
    value: "324",
    change: "+8% this month",
    icon: ImageMinus,
  },
  {
    id: "locations",
    label: "Locations",
    value: "1,248",
    change: "+3% this month",
    icon: MapPin,
  },
];

const StatCard: FC<Omit<StatCardProps, "id">> = ({
  label,
  value,
  change,
  icon: Icon,
}) => (
  <article className="group bg-white border border-border-stroke rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
    <header className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-icon-1-bg">{label}</p>
        <p className="text-2xl font-semibold text-heading-color tracking-tight">
          {value}
        </p>
        <p className="text-sm font-medium text-icon-text">{change}</p>
      </div>

      <span className="bg-icon-bg p-3 rounded-lg group-hover:scale-105 transition">
        <Icon className="w-5 h-5 text-icon-text" />
      </span>
    </header>
  </article>
);

const RecentActivity: FC = () => (
  <section className="bg-white border border-border-stroke rounded-xl shadow-sm p-6 h-[calc(85vh-100px)] flex flex-col">
    <header className="mb-4">
      <h2 className="text-lg font-semibold text-heading-color">
        Recent Activity
      </h2>
      <p className="text-sm text-text-color mt-1">
        Track the latest updates and actions across the platform.
      </p>
    </header>

    <ul className="space-y-4">
      {activities.map(({ id, title, description, time, type, icon: Icon }) => (
        <li
          key={id}
          className="flex justify-between border-b border-border-stroke pb-3 last:border-none"
        >
          <div className="flex gap-3">
            <span className="bg-icon-bg p-2 rounded-lg">
              <Icon className="size-sm text-icon-text" />
            </span>

            <div>
              <p className="text-sm font-medium text-heading-color">{title}</p>
              <p className="text-sm text-inactive-text">{description}</p>
            </div>
          </div>

          <div className="text-right text-xs text-inactive-text">
            <p>{time}</p>
            <p>{type}</p>
          </div>
        </li>
      ))}
    </ul>
  </section>
);

const Dashboard: FC = () => (
  <main className="pt-1 pr-10 pl-4 space-y-6">
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {dashboardStats.map((stat) => (
        <StatCard key={stat.id} {...stat} />
      ))}
    </section>

    <RecentActivity />
  </main>
);

export default Dashboard;
