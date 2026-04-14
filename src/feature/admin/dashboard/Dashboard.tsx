// import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai/react";
import {
  Clock3,
  Plus,
  RefreshCcw,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

import { authAtom } from "@/atoms/authAtom";
// import { PaginationWrapper as Pagination } from "@/components/common/Pagination";
// import RecentOnboardTable from "@/components/common/RecentOnboardTable";
import StatCard from "@/components/common/StatCard";
import { Button } from "@/components/ui/button";

// interface AdminOnboardItem {
//   id: string;
//   userName: string;
//   mobileNumber: string;
//   date: string;
//   location: string;
// }

// const PAGE_SIZE = 10;

// const recentPromoterOnboards: AdminOnboardItem[] = [];

export default function Dashboard() {
  const navigate = useNavigate();
  const auth = useAtomValue(authAtom);
  const userName = auth?.user || "Admin";
  // const [currentPage, setCurrentPage] = useState(1);

  // const totalPages = Math.max(
  //   1,
  //   Math.ceil(recentPromoterOnboards.length / PAGE_SIZE),
  // );
  // const currentPageData = useMemo(
  //   () =>
  //     recentPromoterOnboards.slice(
  //       (currentPage - 1) * PAGE_SIZE,
  //       currentPage * PAGE_SIZE,
  //     ),
  //   [currentPage],
  // );

  return (
    <main className="min-h-full space-y-4 bg-common-bg pt-2 pr-3 pb-3 pl-3">
      <section className="hidden gap-2 px-2 md:flex md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading-color">
            Hello, {userName} 👋
          </h1>
          <p className="mt-1 text-sm text-inactive-text">
            Here&apos;s your admin activity overview
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate({ to: "/promoterForm" })}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-border-stroke bg-white px-3 text-sm font-medium text-text-color transition-colors hover:bg-gray-50 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Promoter
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: "/usersList" })}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-border-stroke bg-white px-5 text-sm font-medium text-text-color transition-colors hover:bg-gray-50 cursor-pointer"
          >
            Manage Users
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 px-2 md:grid-cols-3">
        <StatCard
          label="Total Promoters"
          value="2,450"
          growth="+12% this month"
          Icon={Users}
        />
        <StatCard
          label="Active Promoters"
          value="1,186"
          growth="+5% this month"
          Icon={ShieldCheck}
        />
        <StatCard
          label="Total Users"
          value="12,324"
          growth="+8% this month"
          Icon={UserRound}
        />
      </section>

      <section className="space-y-2 px-1 md:hidden">
        <h1 className="text-3xl font-semibold text-heading-color">
          Admin Dashboard
        </h1>
        <p className="text-sm text-inactive-text">
          Manage promoters, users, and activity.
        </p>
        <Button
          type="button"
          onClick={() => navigate({ to: "/promoterForm" })}
          className="h-11 w-full justify-center rounded-lg bg-[#2e7d68] text-xl font-semibold text-white hover:bg-[#286d5b] cursor-pointer"
        >
          <Plus className="mr-2 h-5 w-5 cursor-pointer" />
          Add Promoter
        </Button>
        <Button
          type="button"
          onClick={() => navigate({ to: "/usersList" })}
          className="h-11 w-full justify-center rounded-lg bg-[#2e7d68] text-xl font-semibold text-white hover:bg-[#286d5b] cursor-pointer"
        >
          <Users className="mr-2 h-5 w-5 cursor-pointer" />
          Manage Users
        </Button>
      </section>

      <section className="hidden px-2 md:block">
        <article className="overflow-hidden rounded-xl border border-border-stroke bg-white">
          <div className="border-b border-border-stroke px-5 py-4">
            <h2 className="text-[31px] leading-none font-semibold text-heading-color">
              Recent Activity
            </h2>
          </div>

          <div className="flex flex-col items-center px-4 py-14 text-center sm:py-16">
            <div className="relative">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#eef3f1]">
                <Clock3 className="h-8 w-8 text-[#95b3a8]" />
              </span>
              <span className="absolute -right-2 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full border border-[#d4e0db] bg-white text-xs text-[#b4c5be]">
                0
              </span>
            </div>

            <h3 className="mt-5 text-2xl font-semibold text-heading-color">
              No recent admin activity yet.
            </h3>
            <p className="mt-2 max-w-xl text-sm text-inactive-text">
              When promoters are added, users are managed, or verification
              actions occur, activity will appear here.
            </p>

            <button
              type="button"
              className="mt-6 inline-flex h-10 items-center gap-2 rounded-full border border-[#2e7d68] px-5 text-sm font-semibold text-[#2e7d68] transition-colors hover:bg-[#f3faf7] cursor-pointer"
            >
              <RefreshCcw className="h-4 w-4 cursor-pointer" />
              Refresh Dashboard
            </button>
          </div>
        </article>
      </section>

      {/* <section className="px-1 md:px-2">
        <h2 className="mb-2 text-3xl font-semibold text-heading-color md:hidden">
          Recent Promoters
        </h2>
        <RecentOnboardTable data={currentPageData} />
        <div className="flex flex-col gap-2 pt-2 md:flex-row md:items-center md:justify-between md:pt-3 lg:pt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </section> */}
    </main>
  );
}
