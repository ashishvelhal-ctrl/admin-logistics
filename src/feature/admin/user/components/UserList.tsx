import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Search } from "lucide-react";
import { useUserList } from "../hooks/useUserList";

import type { UserObject } from "../services/userApi";
import type { Column } from "@/components/common/AdminTable";

import { AdminTable } from "@/components/common/AdminTable";
import DeleteModal from "@/components/common/DeleteModal";
import { ListHeader } from "@/components/common/ListHeader";
import {
  MobileNetworkCardList,
  type MobileNetworkCardItem,
} from "@/components/common/MobileNetworkCardList";
import { PaginationWrapper as Pagination } from "@/components/common/Pagination";
import { SearchAndFilter } from "@/components/common/SearchAndFilter";

type StatusFilter = "all" | "active" | "inactive" | "pending";

const STATUS_OPTIONS: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
];

const STATUS_BADGE_CLASSES: Record<Exclude<StatusFilter, "all">, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-red-100 text-red-800",
  pending: "bg-orange-100 text-orange-800",
};

const STATUS_LABELS: Record<Exclude<StatusFilter, "all">, string> = {
  active: "Active",
  inactive: "Inactive",
  pending: "Pending",
};

function getUserStatus(user: UserObject): Exclude<StatusFilter, "all"> {
  if ((user as any).deletedAt) return "inactive";
  if (typeof (user as any).isActive === "boolean") {
    return (user as any).isActive ? "active" : "inactive";
  }

  const rawStatus = String(user.status || user.profileStatus || "")
    .trim()
    .toLowerCase();

  if (rawStatus.includes("inactive")) return "inactive";
  if (rawStatus.includes("pending")) return "pending";
  if (
    rawStatus === "active" ||
    rawStatus === "verified" ||
    rawStatus.includes("verified") ||
    rawStatus.includes("completed")
  ) {
    return "active";
  }

  return "pending";
}

export default function UserManagement() {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const {
    users,
    isLoading,
    error,
    currentPage,
    search,
    totalPages,
    handleSearch,
    handlePageChange,
    handleDeleteUser,
  } = useUserList();

  const filteredUsers = useMemo(() => {
    if (statusFilter === "all") return users;
    return users.filter((user) => getUserStatus(user) === statusFilter);
  }, [users, statusFilter]);

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      const success = await handleDeleteUser(userToDelete.id);
      if (success) {
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const mobileCardItems: MobileNetworkCardItem[] = useMemo(
    () =>
      filteredUsers.map((user) => ({
        id: String(user.id),
        name: user.fullName ?? user.name ?? "User",
        phone: `+91 ${(user.phoneNumber ?? user.mobileNumber ?? "9876543210").replace(/^\+91/, "")}`,
        dateText: STATUS_LABELS[getUserStatus(user)].toUpperCase(),
        locationText: user.assignedAddress ?? user.address ?? "N/A",
      })),
    [filteredUsers],
  );

  const columns: Array<Column<UserObject>> = [
    {
      key: "fullName",
      title: "User Name",
      render: (value: string) => value || "N/A",
    },
    {
      key: "mobileNumber",
      title: "Phone Number",
      render: (value: string) => {
        const number = value || "";
        if (number.startsWith("+91")) {
          return `+91 ${number.slice(3)}`;
        }
        return number;
      },
    },
    {
      key: "assignedAddress",
      title: "Area",
      className: "max-w-[250px] truncate whitespace-nowrap overflow-hidden",
      render: (value: string) => value || "N/A",
    },
    {
      key: "status",
      title: "Status",
      render: (_: string, user: UserObject) => {
        const status = getUserStatus(user);
        return (
          <span
            className={`rounded-full px-2 py-1 text-sm font-medium ${STATUS_BADGE_CLASSES[status]}`}
          >
            {STATUS_LABELS[status]}
          </span>
        );
      },
    },
  ];

  return (
    <div className="bg-common-bg pr-4 pl-3 md:pr-10 md:pl-4">
      <section className="pb-8 md:hidden">
        <div className="px-4 py-3">
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard" })}
            className="inline-flex items-center gap-2 text-2xl font-semibold text-[#064E3B]"
          >
            <ArrowLeft className="h-5 w-5" />
            User List
          </button>
        </div>

        <div className="space-y-4 p-4">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-inactive-text" />
            <input
              className="w-full rounded-full border border-border-stroke bg-common-bg py-2 pr-3 pl-10 text-sm"
              placeholder="Search user"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold tracking-[0.12em] text-inactive-text uppercase">
              Status Filter
            </p>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="h-10 w-full rounded-lg border border-border-stroke bg-common-bg px-3 text-sm text-heading-color"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <MobileNetworkCardList
            items={mobileCardItems}
            size="compact"
            emptyMessage="No users found. Add your first user to get started."
            onRowClick={(item) =>
              navigate({ to: "/userDetails", search: { userId: item.id } })
            }
          />

          <div className="pt-2">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </section>

      <section className="hidden md:block">
        <ListHeader
          title="User Management"
          description="Manage and view user accounts"
        />

        <div className="bg-card rounded-xl shadow-sm border p-6 h-[calc(104vh-250px)] flex flex-col">
          <SearchAndFilter
            searchLabel="Search Users"
            searchPlaceholder="Search users..."
            searchValue={search}
            onSearchChange={handleSearch}
            selectLabel="Status"
            selectPlaceholder="All Status"
            selectValue={statusFilter}
            onSelectChange={(value) => setStatusFilter(value as StatusFilter)}
            selectOptions={STATUS_OPTIONS}
          />
          <AdminTable
            data={filteredUsers}
            columns={columns}
            isLoading={isLoading}
            error={error}
            keyField="id"
            key={currentPage}
            onRowClick={(user) =>
              navigate({ to: "/userDetails", search: { userId: user.id } })
            }
            emptyMessage="No users found. Add your first user to get started."
          />
        </div>
        <div className="pt-2 md:pt-3 lg:pt-12 xl:pt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </section>

      <DeleteModal
        open={isDeleteDialogOpen}
        title="User"
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
