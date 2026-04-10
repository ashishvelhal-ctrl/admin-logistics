import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, PencilLine, Plus, Search, Trash2 } from "lucide-react";

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
import { Button } from "@/components/ui/button";
import { usePromoterList } from "../hooks/usePromoterList";

type StatusFilter = "all" | "active" | "inactive" | "pending";

const STATUS_OPTIONS: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
];

const STATUS_LABELS: Record<Exclude<StatusFilter, "all">, string> = {
  active: "Active",
  inactive: "Inactive",
  pending: "Pending",
};

function getPromoterStatus(promoter: any): Exclude<StatusFilter, "all"> {
  if (promoter?.deletedAt) return "inactive";
  if (typeof promoter?.isActive === "boolean") {
    return promoter.isActive ? "active" : "inactive";
  }

  const rawStatus = String(promoter?.status || promoter?.profileStatus || "")
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

export default function PromoterList() {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [promoterToDelete, setPromoterToDelete] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const {
    promoters,
    isLoading,
    error,
    currentPage,
    search,
    totalPages,
    handleSearch,
    handlePageChange,
    handleDeletePromoter,
  } = usePromoterList();

  const filteredPromoters = useMemo(() => {
    if (statusFilter === "all") return promoters;
    return promoters.filter((promoter: any) => {
      return getPromoterStatus(promoter) === statusFilter;
    });
  }, [promoters, statusFilter]);

  const handleDeleteUser = (user: any) => {
    setPromoterToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (promoterToDelete) {
      const success = await handleDeletePromoter(promoterToDelete.id);
      if (success) {
        setIsDeleteDialogOpen(false);
        setPromoterToDelete(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setPromoterToDelete(null);
  };

  const mobileCardItems: MobileNetworkCardItem[] = useMemo(
    () =>
      filteredPromoters.map((promoter: any) => ({
        id: String(promoter.id),
        name: promoter.fullName ?? promoter.name ?? "Promoter",
        phone: `+91 ${(promoter.phoneNumber ?? promoter.mobileNumber ?? "9876543210").replace(/^\+91/, "")}`,
        dateText: STATUS_LABELS[getPromoterStatus(promoter)].toUpperCase(),
        locationText: promoter.assignedAddress ?? promoter.address ?? "N/A",
      })),
    [filteredPromoters],
  );

  const columns: Array<Column<any>> = [
    {
      key: "fullName",
      title: "Promoter Name",
      render: (value: string) => value || "N/A",
    },
    {
      key: "mobileNumber",
      title: "Mobile Number",
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
      key: "onboardedUsersCount",
      title: "Onboarding",
      render: (value: number) => value || 0,
    },
    {
      key: "actions",
      title: "Actions",
      render: (_: any, user: any) => (
        <div className="flex gap-2 justify-center">
          <Button
            size="sm"
            className="bg-button-1-bg hover:bg-button-1-bg/90 text-icon-1-color"
            onClick={() =>
              navigate({
                to: "/promoterEdit",
                search: {
                  promoterId: user.id,
                  fullName: user.fullName ?? user.name ?? "",
                  mobileNumber: user.phoneNumber ?? user.mobileNumber ?? "",
                  assignedAddress: user.assignedAddress ?? user.address ?? "",
                },
              })
            }
          >
            <PencilLine size={14} />
          </Button>
          <Button
            size="sm"
            className="bg-button-2-bg hover:bg-button-2-bg/90 text-icon-2-color"
            onClick={() => handleDeleteUser(user)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-common-bg pr-4 pl-3 md:pr-10 md:pl-4">
      <section className="pb-16 md:hidden">
        <div className="px-4 py-3">
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard" })}
            className="inline-flex items-center gap-2 text-2xl font-semibold text-[#064E3B]"
          >
            <ArrowLeft className="h-5 w-5" />
            Promoter List
          </button>
        </div>

        <div className="space-y-4 p-4">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-inactive-text" />
            <input
              className="w-full rounded-full border border-border-stroke bg-common-bg py-2 pr-3 pl-10 text-sm"
              placeholder="Search promoter"
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
            editStyle="button"
            emptyMessage="No promoters found. Add your first promoter to get started."
            onRowClick={(item) =>
              navigate({
                to: "/promoterDetails",
                search: { promoterId: item.id },
              })
            }
            onEditClick={(item) => {
              const promoter = filteredPromoters.find(
                (row: any) => String(row.id) === item.id,
              );
              if (!promoter) return;

              navigate({
                to: "/promoterEdit",
                search: {
                  promoterId: promoter.id,
                  fullName: promoter.fullName ?? promoter.name ?? "",
                  mobileNumber:
                    promoter.phoneNumber ?? promoter.mobileNumber ?? "",
                  assignedAddress:
                    promoter.assignedAddress ?? promoter.address ?? "",
                },
              });
            }}
            onDeleteClick={(item) => {
              const promoter = filteredPromoters.find(
                (row: any) => String(row.id) === item.id,
              );
              if (!promoter) return;
              handleDeleteUser(promoter);
            }}
            deleteLabel="Delete promoter"
          />

          <div className="pt-2">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate({ to: "/promoterForm" })}
          className="fixed right-4 bottom-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-icon-1-color text-white shadow-md md:hidden"
          aria-label="Add Promoter"
        >
          <Plus className="h-5 w-5" />
        </button>
      </section>

      <section className="hidden md:block">
        <ListHeader
          title="Promoter Management"
          description="Onboard a new promoter to the secure vault network."
          addButtonText="Add Promoter"
          onAdd={() => navigate({ to: "/promoterForm" })}
        />

        <div className="bg-card rounded-xl shadow-sm border p-6 h-[calc(104vh-250px)] flex flex-col">
          <SearchAndFilter
            searchLabel="Search Promoters"
            searchPlaceholder="Search promoters..."
            searchValue={search}
            onSearchChange={handleSearch}
            selectLabel="Status"
            selectPlaceholder="All Status"
            selectValue={statusFilter}
            onSelectChange={(value) => setStatusFilter(value as StatusFilter)}
            selectOptions={STATUS_OPTIONS}
          />
          <AdminTable
            data={filteredPromoters}
            columns={columns}
            isLoading={isLoading}
            error={error}
            keyField="id"
            key={currentPage}
            onRowClick={(user) =>
              navigate({
                to: "/promoterDetails",
                search: { promoterId: String(user.id) },
              })
            }
            emptyMessage="No promoters found. Add your first promoter to get started."
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
        title="Promoter"
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
