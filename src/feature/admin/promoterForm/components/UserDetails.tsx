import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Phone, Loader2, Ban } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Card, CardContent } from "@/components/ui/card";
import { PaginationWrapper as Pagination } from "@/components/common/Pagination";
import { AdminTable, type Column } from "@/components/common/AdminTable";
import { cn } from "@/lib/utils";
import {
  networkApi,
  type UserTrip,
} from "@/feature/promoter/network/services/networkApi";

const PAGE_SIZE = 4;

const statusLabel: Record<string, string> = {
  completed: "COMPLETED",
  cancelled: "CANCELLED",
  inProgress: "IN PROGRESS",
  pending: "PENDING",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}

// Transform trip history to table format
interface TripHistoryItem {
  id: string;
  tripId: string;
  date: string;
  route: string;
  status: string;
  amount: number;
}

function getTripHistoryData(trips: UserTrip[]): TripHistoryItem[] {
  return trips.map((trip) => ({
    id: trip.id,
    tripId: trip.id.slice(-6).toUpperCase(),
    date: new Date(trip.date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    route: `${trip.startLocation?.address || "-"} -> ${trip.endLocation?.address || "-"}`,
    status: statusLabel[trip.status || "pending"] || "PENDING",
    amount: trip.price || 0,
  }));
}

const tripColumns: Array<Column<TripHistoryItem>> = [
  {
    key: "tripId",
    title: "Trip ID",
  },
  {
    key: "date",
    title: "Date",
  },
  {
    key: "route",
    title: "Route",
  },
  {
    key: "status",
    title: "Status",
  },
  {
    key: "amount",
    title: "Amount",
    render: (value: number) => `₹${value.toLocaleString()}`,
  },
];

export default function UserDetails() {
  const navigate = useNavigate();
  const { userId, promoterId } = useSearch({ from: "/(admin)/userDetails" });
  const selectedUserId = userId ?? "1";
  const [page, setPage] = useState(1);

  // Fetch user details from API
  const {
    data: userData,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    queryKey: ["userDetails", selectedUserId],
    queryFn: () => networkApi.getUserById(selectedUserId),
    enabled: !!selectedUserId,
  });

  // Fetch user trips from API
  const {
    data: tripsData,
    isLoading: isLoadingTrips,
    error: tripsError,
  } = useQuery({
    queryKey: ["userTrips", selectedUserId, page],
    queryFn: () =>
      networkApi.getUserTrips(selectedUserId, {
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
      }),
    enabled: !!selectedUserId,
  });

  const trips = tripsData?.data || [];
  const totalTrips = tripsData?.paginationMeta?.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalTrips / PAGE_SIZE));

  // Transform trips for display
  const tripHistoryData = useMemo(() => getTripHistoryData(trips), [trips]);

  // Reset page when user changes
  useEffect(() => {
    setPage(1);
  }, [selectedUserId]);

  // Build user profile from API data
  const profile = useMemo(() => {
    if (!userData) {
      return {
        id: selectedUserId,
        promoterId: promoterId ?? "1",
        fullName: `User ${selectedUserId}`,
        mobileNumber: "-",
        address: "-",
        isActive: true,
        vehicleType: "-",
        vehicleNumber: "-",
      };
    }

    return {
      id: userData.id,
      promoterId: promoterId ?? "1",
      fullName: userData.name || `User ${selectedUserId}`,
      mobileNumber: userData.phoneNumber || "-",
      address: userData.address || "-",
      isActive:
        userData.profileStatus === "verified" || userData.isActive !== false,
      vehicleType: userData.vehicleType || "-",
      vehicleNumber: userData.vehicleNumber || "-",
    };
  }, [userData, selectedUserId, promoterId]);

  const isLoading = isLoadingUser || isLoadingTrips;
  const hasError = userError || tripsError;

  if (isLoading) {
    return (
      <div className="bg-common-bg pr-4 pl-3 md:pr-10 md:pl-4 pb-6">
        <div className="flex h-64 flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-icon-1-color" />
          <div className="text-lg text-heading-color">
            Loading user details...
          </div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="bg-common-bg pr-4 pl-3 md:pr-10 md:pl-4 pb-6">
        <div className="flex h-64 flex-col items-center justify-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
            <Ban className="h-7 w-7" />
          </div>
          <div className="text-lg text-red-600">Error loading user data</div>
          <button
            type="button"
            onClick={() =>
              navigate({
                to: "/promoterDetails",
                search: { promoterId: promoterId ?? "1" },
              })
            }
            className="inline-flex items-center gap-2 text-sm font-medium text-icon-1-color hover:opacity-80"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Promoter Detail
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-common-bg pr-4 pl-3 md:pr-10 md:pl-4 pb-6">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-heading-color">
            User Details
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            View onboarding progress and user information
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate({
              to: "/promoterDetails",
              search: { promoterId: promoterId ?? profile.promoterId },
            })
          }
          className="inline-flex items-center gap-2 self-start text-xs md:text-sm font-medium text-icon-1-color hover:opacity-80"
        >
          <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" />
          Back to Promoter Detail
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 md:gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
          <Card className="shadow-sm">
            <CardContent className="space-y-4 md:space-y-5 p-4 md:p-5">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-icon-bg text-xl md:text-2xl font-bold text-icon-1-color">
                  {getInitials(profile.fullName)}
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-heading-color">
                  {profile.fullName}
                </h2>
                <span
                  className={cn(
                    "mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
                    profile.isActive
                      ? "bg-icon-bg text-icon-1-color"
                      : "bg-button-2-bg text-icon-2-color",
                  )}
                >
                  {profile.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-md bg-common-bg px-3 py-2">
                  <Phone className="h-3.5 w-3.5 md:h-4 md:w-4 text-icon-1-color" />
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Phone Number
                    </p>
                    <p className="text-xs md:text-sm font-semibold text-heading-color">
                      {profile.mobileNumber}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/addUser" })}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-icon-1-color hover:bg-icon-1-color/90 rounded-lg transition-colors"
                  >
                    Click to Verify
                  </button>
                </div>

                <div className="flex items-center gap-3 rounded-md bg-common-bg px-3 py-2">
                  <MapPin className="h-3.5 w-3.5 md:h-4 md:w-4 text-icon-1-color" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Address
                    </p>
                    <p className="text-xs md:text-sm font-semibold text-heading-color">
                      {profile.address}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="border-b bg-[#F8FAF9] px-5 py-4">
                <h3 className="text-xl md:text-2xl font-semibold text-heading-color">
                  Vehicle Details
                </h3>
              </div>

              <div className="md:hidden p-4">
                <div className="rounded-lg border border-border-stroke bg-white overflow-hidden">
                  <div className="grid grid-cols-2 bg-[#F8FAF9] border-b">
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                      Vehicle Type
                    </div>
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                      Vehicle Number
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-3 py-2.5 text-sm font-semibold text-heading-color border-b">
                      {profile.vehicleType}
                    </div>
                    <div className="px-3 py-2.5 text-sm font-semibold text-heading-color border-b">
                      {profile.vehicleNumber}
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden md:block p-5">
                <div className="rounded-lg border border-border-stroke bg-white overflow-hidden">
                  <div className="grid grid-cols-2 bg-[#F8FAF9] border-b">
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                      Vehicle Type
                    </div>
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                      Vehicle Number
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-3 py-2.5 text-sm font-semibold text-heading-color border-b">
                      {profile.vehicleType}
                    </div>
                    <div className="px-3 py-2.5 text-sm font-semibold text-heading-color border-b">
                      {profile.vehicleNumber}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="border-b bg-[#F8FAF9] px-5 py-4">
              <h3 className="text-xl md:text-2xl font-semibold text-heading-color">
                User Trip History
              </h3>
            </div>

            <div className="md:hidden p-4 space-y-2">
              {tripHistoryData.map((trip) => (
                <article
                  key={trip.id}
                  className="rounded-lg border border-border-stroke bg-white px-3 py-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-heading-color">
                        {trip.tripId}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {trip.date}
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-common-bg text-heading-color">
                      {trip.status}
                    </span>
                  </div>
                  <p className="text-xs text-heading-color mt-2">
                    {trip.route}
                  </p>
                  <p className="text-xs font-semibold text-icon-1-color mt-1">
                    ₹{trip.amount.toLocaleString()}
                  </p>
                </article>
              ))}
            </div>

            <div className="hidden md:block">
              <AdminTable
                data={tripHistoryData}
                columns={tripColumns}
                keyField="id"
                emptyMessage="No trip history available."
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-2 pt-2 md:flex-row md:items-center md:justify-between md:pt-3 lg:pt-4">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}
