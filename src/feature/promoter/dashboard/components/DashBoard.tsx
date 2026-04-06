import { useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai/react";
import {
  ChartNoAxesCombined,
  Clock3,
  Plus,
  RefreshCcw,
  Truck,
  UserRound,
} from "lucide-react";
import { useState, useMemo } from "react";

import { authAtom } from "@/atoms/authAtom";
import RecentOnboardTable from "@/components/common/RecentOnboardTable";
import StatCard from "@/components/common/StatCard";
import { PaginationWrapper as Pagination } from "@/components/common/Pagination";

interface OnboardItem {
  id: string;
  userName: string;
  mobileNumber: string;
  date: string;
  location: string;
}

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
    <main className="pt-2 pr-3 pl-3 pb-3 space-y-4 bg-common-bg min-h-full">
      <section className="hidden md:flex flex-col md:flex-row md:items-center md:justify-between gap-2 px-2">
        <div>
          <h1 className="text-2xl font-bold text-heading-color">
            Hello, {userName} 👋
          </h1>
          <p className="text-inactive-text mt-1 text-sm">
            Here&apos;s your activity overview
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate({ to: "/addUser" })}
            className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-border-stroke text-text-color bg-white hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add New User
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: "/createTrip" })}
            className="inline-flex items-center gap-2 h-9 px-7 rounded-lg border border-border-stroke text-text-color bg-white hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Create Trip
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 px-2">
        <StatCard
          label="Total Onboard"
          value="2,450"
          growth="+12% this month"
          Icon={UserRound}
        />
        <StatCard
          label="Trips Created"
          value="186"
          growth="+5% this month"
          Icon={Truck}
        />
        <StatCard
          label="Total Earnings"
          value="₹12,000"
          growth="+8% this month"
          Icon={ChartNoAxesCombined}
        />
      </section>

      <section className="px-1 md:hidden space-y-2">
        <button
          type="button"
          onClick={() => navigate({ to: "/createTrip" })}
          className="w-full inline-flex items-center justify-center gap-2 h-11 px-3 rounded-lg text-white bg-[#2e7d68] hover:bg-[#286d5b] transition-colors text-xl font-semibold"
        >
          <Truck className="w-5 h-5" />
          Create Trip
        </button>
        <button
          type="button"
          onClick={() => navigate({ to: "/addUser" })}
          className="w-full inline-flex items-center justify-center gap-2 h-11 px-3 rounded-lg text-white bg-[#2e7d68] hover:bg-[#286d5b] transition-colors text-xl font-semibold"
        >
          <Plus className="w-5 h-5" />
          Add New User
        </button>
      </section>

      <section className="hidden md:block px-2">
        <article className="rounded-xl border border-border-stroke bg-white overflow-hidden">
          <div className="px-5 py-4 border-b border-border-stroke">
            <h2 className="text-[31px] leading-none font-semibold text-heading-color">
              Recent Activity
            </h2>
          </div>

          <div className="px-4 py-14 sm:py-16 flex flex-col items-center text-center">
            <div className="relative">
              <span className="w-16 h-16 rounded-full bg-[#eef3f1] flex items-center justify-center">
                <Clock3 className="w-8 h-8 text-[#95b3a8]" />
              </span>
              <span className="absolute -right-2 -bottom-1 w-6 h-6 rounded-full border border-[#d4e0db] bg-white flex items-center justify-center text-[#b4c5be] text-xs">
                0
              </span>
            </div>

            <h3 className="text-2xl font-semibold text-heading-color mt-5">
              No recent activity yet.
            </h3>
            <p className="text-sm text-inactive-text mt-2 max-w-xl">
              When users join your network or complete tasks, their activity
              will appear here in real-time.
            </p>

            <button
              type="button"
              className="mt-6 inline-flex items-center gap-2 h-10 px-5 rounded-full border border-[#2e7d68] text-[#2e7d68] text-sm font-semibold hover:bg-[#f3faf7] transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              Refresh Dashboard
            </button>
          </div>
        </article>
      </section>

      <section className="px-1 md:px-2">
        <h2 className="text-3xl md:hidden font-semibold text-heading-color mb-2">
          Recent Onboarded
        </h2>
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
