import { useEffect, useMemo, useState } from "react";
import type {
  PromoterNetworkMember,
  NetworkStatus,
} from "../components/PromoterNetworkTable";

const PAGE_SIZE = 10;

export function usePromoterNetwork(networkMembers: PromoterNetworkMember[]) {
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | NetworkStatus>(
    "all",
  );
  const [page, setPage] = useState(1);

  const filteredNetwork = useMemo(() => {
    return networkMembers.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        member.phone.includes(searchValue.trim());
      const matchesStatus =
        statusFilter === "all" || member.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [networkMembers, searchValue, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredNetwork.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    setPage(1);
  }, [searchValue, statusFilter]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedMembers = filteredNetwork.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return {
    searchValue,
    setSearchValue,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    currentPage,
    totalPages,
    paginatedMembers,
    filteredCount: filteredNetwork.length,
  };
}
