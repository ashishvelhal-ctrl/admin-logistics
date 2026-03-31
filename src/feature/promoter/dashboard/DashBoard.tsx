import { useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai/react";
import { Plus, UserRound } from "lucide-react";
import { useState, useMemo } from "react";

import { authAtom } from "@/atoms/authAtom";
import RecentOnboardTable from "@/components/common/RecentOnboardTable";
import { PaginationWrapper as Pagination } from "@/components/common/Pagination";

interface StatItem {
  id: string;
  label: string;
  value: string;
  growth: string;
}

interface OnboardItem {
  id: string;
  userName: string;
  mobileNumber: string;
  date: string;
  location: string;
}

const stats: StatItem[] = [
  {
    id: "onboard",
    label: "Total Onboard",
    value: "2,450",
    growth: "+12% this month",
  },
  {
    id: "active",
    label: "Active Users",
    value: "186",
    growth: "+5% this month",
  },
  { id: "month", label: "This Month", value: "324", growth: "+8% this month" },
];

const recentOnboards: OnboardItem[] = Array.from(
  { length: 20 },
  (_, index) => ({
    id: `onboard-${index + 1}`,
    userName: "Rahul Sharma",
    mobileNumber: "9307141518",
    date: "28-03-2026",
    location: "Pune",
  }),
);

const PAGE_SIZE = 10;

export default function DashBoard() {
  const navigate = useNavigate();
  const auth = useAtomValue(authAtom);
  const userName = auth?.user || "Raj Sharma";
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(recentOnboards.length / PAGE_SIZE));
  const currentPageData = useMemo(
    () =>
      recentOnboards.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
      ),
    [currentPage],
  );

  return (
    <main className="pt-1 pr-4 pl-3 pb-3 space-y-4 bg-common-bg min-h-full">
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 px-2">
        <div>
          <h1 className="text-2xl font-bold text-heading-color">
            Hello, {userName} 👋
          </h1>
          <p className="text-inactive-text mt-1 text-sm">
            Here&apos;s your activity overview
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate({ to: "/addUser" })}
          className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-border-stroke text-text-color bg-white hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add New User
        </button>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 px-2">
        {stats.map((item) => (
          <article
            key={item.id}
            className="bg-white border border-border-stroke rounded-xl px-4 py-3 flex items-start justify-between"
          >
            <div>
              <p className="text-sm text-inactive-text font-medium">
                {item.label}
              </p>
              <p className="text-2xl leading-tight font-semibold text-heading-color mt-1">
                {item.value}
              </p>
              <p className="text-icon-text text-sm font-medium mt-1">
                {item.growth}
              </p>
            </div>
            <span className="w-8 h-8 rounded-lg bg-icon-bg flex items-center justify-center">
              <UserRound className="w-4 h-4 text-icon-text" />
            </span>
          </article>
        ))}
      </section>

      <section className="px-2">
        <RecentOnboardTable data={currentPageData} />
        <div className="flex flex-col gap-2 pt-2 md:flex-row md:items-center md:justify-between md:pt-3 lg:pt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>
    </main>
  );
}
