import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { PencilLine, Trash2 } from "lucide-react";

import { useUserList } from "../hooks/useUserList";

import type { UserObject } from "../services/userApi";
import type { Column } from "@/components/common/AdminTable";

import { AdminTable } from "@/components/common/AdminTable";
import DeleteModal from "@/components/common/DeleteModal";
import { ListHeader } from "@/components/common/ListHeader";
import { PaginationWrapper as Pagination } from "@/components/common/Pagination";
import { SearchAndFilter } from "@/components/common/SearchAndFilter";
import { Button } from "@/components/ui/button";

export default function UserManagement() {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  const {
    users,
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
    handleDeleteUser,
  } = useUserList();

  const handleDeleteUserClick = (user: any) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

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
      key: "roles",
      title: "Role",
      className: "max-w-[250px] truncate whitespace-nowrap overflow-hidden",
      render: (value?: string[]) =>
        value?.length ? value.join(", ") : "No roles",
    },
    {
      key: "is_verified",
      title: "Verified",
      render: (value: boolean) => (value ? "Yes" : "No"),
    },
    {
      key: "created_at",
      title: "Joined",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: "actions",
      title: "Action",
      render: (_: any, user: UserObject) => (
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
                  mobileNumber: user.mobileNumber ?? user.phoneNumber ?? "",
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
            onClick={() => handleDeleteUserClick(user)}
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
        title="User Management"
        description="Manage and view user accounts"
        addButtonText="Add User"
        onAdd={() => navigate({ to: "/promoterForm" })}
      />

      <div className="bg-card rounded-xl shadow-sm border p-6 h-[calc(104vh-250px)] flex flex-col">
        <SearchAndFilter
          searchLabel="Search Users"
          searchPlaceholder="Search users..."
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
          data={users}
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
      <DeleteModal
        open={isDeleteDialogOpen}
        title="User"
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
