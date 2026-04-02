import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, PencilLine, Plus, Search } from "lucide-react";
import { useMemo, useState, useEffect } from "react";

import { useMyNetworkList } from "../hooks/useMyNetworkList";

import type { Column } from "@/components/common/AdminTable";
import type { NetworkUser } from "../services/networkApi";

import { AdminTable } from "@/components/common/AdminTable";
import { ListHeader } from "@/components/common/ListHeader";
import {
  MobileNetworkCardList,
  type MobileNetworkCardItem,
} from "@/components/common/MobileNetworkCardList";
import { PaginationWrapper as Pagination } from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";

export default function MyNetworkList() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [userTypeFilter, setUserTypeFilter] = useState<
    "farmer" | "transporter"
  >("farmer");
  const [mobilePage, setMobilePage] = useState(1);
  const {
    users,
    isLoading,
    error,
    currentPage,
    totalPages,
    search,
    handleSearch,
    handlePageChange,
  } = useMyNetworkList();

  const getUserType = (user: NetworkUser): "farmer" | "transporter" => {
    const logisticsLike = (user as any).provideLogistics;
    const rawType = String((user as any).userType || "").toLowerCase();
    if (logisticsLike === true || rawType === "transporter")
      return "transporter";
    return "farmer";
  };

  const filteredMobileUsers = useMemo(() => {
    return users.filter((user) => {
      const status = String(user.profileStatus || "active").toLowerCase();
      const statusMatches =
        statusFilter === "all" ? true : status.includes(statusFilter);
      const userTypeMatches = getUserType(user) === userTypeFilter;
      return statusMatches && userTypeMatches;
    });
  }, [users, statusFilter, userTypeFilter]);

  // Mobile pagination logic
  const MOBILE_PAGE_SIZE = 6;
  const mobileTotalPages = Math.max(
    1,
    Math.ceil(filteredMobileUsers.length / MOBILE_PAGE_SIZE),
  );
  const safeMobilePage = Math.min(mobilePage, mobileTotalPages);
  const pagedMobileUsers = filteredMobileUsers.slice(
    (safeMobilePage - 1) * MOBILE_PAGE_SIZE,
    safeMobilePage * MOBILE_PAGE_SIZE,
  );
  const mobileCardItems: MobileNetworkCardItem[] = pagedMobileUsers.map(
    (row) => ({
      id: String(row.id),
      name: row.name || "Arjun Mehta",
      phone: `+91 ${(row.phoneNumber || "9876543210").replace(/^\+91/, "")}`,
      dateText: formatMobileDate(row.createdAt),
      locationText: row.address || "Maharashtra",
    }),
  );

  useEffect(() => {
    setMobilePage(1);
  }, [statusFilter, userTypeFilter, users]);

  function formatMobileDate(date?: string) {
    if (!date) return "OCT 24, 2023";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "OCT 24, 2023";
    return parsed
      .toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
      .toUpperCase();
  }

  const columns: Array<Column<NetworkUser>> = [
    {
      key: "name",
      title: "User Name",
      render: (value: string) => value || "N/A",
    },
    {
      key: "phoneNumber",
      title: "Mobile Number",
      render: (value: string) => {
        const number = value || "";
        return number.startsWith("+91") ? `+91 ${number.slice(3)}` : number;
      },
    },
    {
      key: "address",
      title: "Area",
      className: "max-w-[220px] truncate whitespace-nowrap overflow-hidden",
      render: (value: string) => value || "N/A",
    },
    {
      key: "profileStatus",
      title: "Status",
      render: (value: string) => value || "pending",
    },
    {
      key: "actions",
      title: "Action",
      render: (_: any, row: NetworkUser) => (
        <div className="flex gap-2 justify-center">
          <Button
            size="sm"
            className="bg-button-1-bg hover:bg-button-1-bg/90 text-icon-1-color"
            onClick={() =>
              navigate({
                to: "/editUser",
                search: {
                  userId: String(row.id),
                  name: row.name,
                  address: row.address,
                  mobileNumber: row.phoneNumber,
                },
              })
            }
          >
            <PencilLine size={14} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-common-bg pr-4 pl-3 md:pr-10 md:pl-4">
      {/* Mobile View */}
      <section className="md:hidden pb-16">
        <div className="px-4 py-3">
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboardp" })}
            className="inline-flex items-center gap-2 text-[#064E3B] font-semibold text-2xl"
          >
            <ArrowLeft className="w-5 h-5" />
            MyNetwork
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-inactive-text absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              className="w-full bg-common-bg border border-border-stroke rounded-full pl-10 pr-3 py-2 text-sm"
              placeholder="Search User"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div>
            <p className="text-xs tracking-[0.12em] uppercase text-inactive-text font-semibold mb-2">
              User Status
            </p>
            <div className="grid grid-cols-3 gap-1">
              {(["all", "active", "inactive"] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`h-7 rounded-full text-xs font-semibold border transition-colors pr-2 ${
                    statusFilter === status
                      ? "bg-icon-1-color text-white border-icon-1-color"
                      : "bg-[#f3f5f5] text-heading-color border-transparent"
                  }`}
                >
                  {status.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs tracking-[0.12em] uppercase text-inactive-text font-semibold mb-2">
              User Type
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(["farmer", "transporter"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setUserTypeFilter(type)}
                  className={`h-9 rounded-lg text-sm font-semibold border transition-colors ${
                    userTypeFilter === type
                      ? "bg-icon-1-color text-white border-icon-1-color"
                      : "bg-[#f3f5f5] text-heading-color border-transparent"
                  }`}
                >
                  {type === "farmer" ? "Farmer" : "Transporter"}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-1">
            <MobileNetworkCardList
              items={mobileCardItems}
              size="compact"
              editStyle="button"
              emptyMessage="No users found in your network."
              onRowClick={(item) =>
                navigate({
                  to: "/userDetails",
                  search: { userId: item.id, promoterId: "1" },
                })
              }
              onEditClick={(item) => {
                const original = pagedMobileUsers.find(
                  (user) => String(user.id) === item.id,
                );
                if (!original) return;
                navigate({
                  to: "/editUser",
                  search: {
                    userId: String(original.id),
                    name: original.name,
                    address: original.address,
                    mobileNumber: original.phoneNumber,
                  },
                });
              }}
            />
          </div>

          <div className="pt-2">
            <Pagination
              currentPage={safeMobilePage}
              totalPages={mobileTotalPages}
              onPageChange={setMobilePage}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate({ to: "/addUser" })}
          className="fixed md:hidden right-4 bottom-4 w-12 h-12 rounded-full bg-icon-1-color text-white shadow-md inline-flex items-center justify-center"
          aria-label="Add User"
        >
          <Plus className="w-5 h-5" />
        </button>
      </section>

      {/* Desktop View */}
      <section className="hidden md:block">
        <ListHeader
          title="My Network"
          description="View and manage users added under your network."
          addButtonText="Add User"
          onAdd={() => navigate({ to: "/addUser" })}
        />

        <div className="bg-card rounded-xl shadow-sm border p-4 md:p-6 h-[calc(104vh-250px)] flex flex-col">
          <div className="mb-4">
            <label className="text-sm text-muted-foreground">
              Search Users
            </label>
            <input
              className="mt-1 w-full bg-common-bg border-2 border-border-stroke rounded-md px-3 py-2 text-sm"
              placeholder="Search users..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <AdminTable
            data={users}
            columns={columns}
            isLoading={isLoading}
            error={error}
            keyField="id"
            key={currentPage}
            emptyMessage="No users found in your network."
            onRowClick={(row) =>
              navigate({
                to: "/userDetails",
                search: {
                  userId: String(row.id),
                  promoterId: "1",
                },
              })
            }
          />
        </div>

        <div className="pt-2 md:pt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </section>
    </div>
  );
}
