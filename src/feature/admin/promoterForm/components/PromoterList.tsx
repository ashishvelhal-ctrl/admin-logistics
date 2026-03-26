import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { PencilLine, Trash2 } from "lucide-react";

// import { useUserManagement } from '../hook'
// import type { UserDetails } from '../types/admin.types'
import type { Column } from "@/components/common/AdminTable";

import { AdminTable } from "@/components/common/AdminTable";
import DeleteModal from "@/components/common/DeleteModal";
import { ListHeader } from "@/components/common/ListHeader";
import { PaginationWrapper as Pagination } from "@/components/common/Pagination";
import { SearchAndFilter } from "@/components/common/SearchAndFilter";
import { Button } from "@/components/ui/button";

export default function PromoterList() {
  const navigate = useNavigate();
  // Mock data for frontend development
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Mock data
  const totalPages = 1;
  const paginatedUsers = [
    {
      id: 1,
      fullName: "A",
      mobileNumber: "+91 1234567890",
      assignedAddress: "Mumbai",
      onboardingCount: 5,
      is_verified: true,
      created_at: "2024-01-15T10:30:00Z",
    },
    {
      id: 2,
      fullName: "B",
      mobileNumber: "+91 1234567899",
      assignedAddress: "Delhi",
      onboardingCount: 0,
      is_verified: false,
      created_at: "2024-01-16T11:30:00Z",
    },
  ];
  const isLoading = false;
  const error = null;
  const roleOptions = [
    { value: "", label: "All Status" },
    { value: "verified", label: "Verified" },
    { value: "unverified", label: "Unverified" },
  ];

  const handleDeleteUser = (_user: any) => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setIsDeleteDialogOpen(false);
    console.log("Delete confirmed");
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
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
                search: { promoterId: user.id },
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
          onSearchChange={setSearch}
          selectLabel="Status"
          selectPlaceholder="All Status"
          selectValue={role}
          onSelectChange={(value) => setRole(value)}
          selectOptions={roleOptions}
        />
        <AdminTable
          data={paginatedUsers}
          columns={columns}
          isLoading={isLoading}
          error={error}
          keyField="id"
          key={page}
          emptyMessage="No promoters found. Add your first promoter to get started."
        />
      </div>
      <div className="pt-2 md:pt-3 lg:pt-12 xl:pt-4">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
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
