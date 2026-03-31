import { useNavigate } from "@tanstack/react-router";

import { useMyNetworkList } from "../hooks/useMyNetworkList";

import type { Column } from "@/components/common/AdminTable";
import type { NetworkUser } from "../services/networkApi";

import { AdminTable } from "@/components/common/AdminTable";
import { ListHeader } from "@/components/common/ListHeader";
import { PaginationWrapper as Pagination } from "@/components/common/Pagination";

export default function MyNetworkList() {
  const navigate = useNavigate();
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
  ];

  return (
    <div className="bg-common-bg pr-4 pl-3 md:pr-10 md:pl-4 h-[calc(100vh-250px)]">
      <ListHeader
        title="My Network"
        description="View and manage users added under your network."
        addButtonText="Add User"
        onAdd={() => navigate({ to: "/addUser" })}
      />

      <div className="bg-card rounded-xl shadow-sm border p-4 md:p-6 h-[calc(104vh-250px)] flex flex-col">
        <div className="mb-4">
          <label className="text-sm text-muted-foreground">Search Users</label>
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
        />
      </div>

      <div className="pt-2 md:pt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
