import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { PencilLine, Trash2 } from "lucide-react";

import type { Column } from "@/components/common/AdminTable";
import { AdminTable } from "@/components/common/AdminTable";
import DeleteModal from "@/components/common/DeleteModal";
import { ListHeader } from "@/components/common/ListHeader";
import { PaginationWrapper as Pagination } from "@/components/common/Pagination";
import { SearchAndFilter } from "@/components/common/SearchAndFilter";
import { Button } from "@/components/ui/button";
import { usePromoterList } from "../hooks/usePromoterList";

export default function PromoterList() {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [promoterToDelete, setPromoterToDelete] = useState<any>(null);

  const {
    promoters,
    isLoading,
    error,
    currentPage,
    search,
    role,
    totalPages,
    roleOptions,
    handleSearch,
    handleRoleChange,
    handlePageChange,
    handleDeletePromoter,
  } = usePromoterList();

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
      key: "onboardingCount",
      title: "Onboarding",
      render: (value: number) => value || 0,
    },
    {
      key: "is_verified",
      title: "Status",
      render: (value: boolean) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {value ? "Verified" : "Unverified"}
        </span>
      ),
    },
    {
      key: "created_at",
      title: "Created At",
      render: (value: string) => {
        return new Date(value).toLocaleDateString();
      },
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
    <div className="bg-common-bg pr-10 pl-4 h-[calc(100vh-250px)]">
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
          selectLabel="Role"
          selectPlaceholder="All Roles"
          selectValue={role}
          onSelectChange={handleRoleChange}
          selectOptions={roleOptions.map((role) => ({
            value: role._id,
            label: role.title,
          }))}
        />
        <AdminTable
          data={promoters}
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
      <DeleteModal
        open={isDeleteDialogOpen}
        title="Promoter"
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
