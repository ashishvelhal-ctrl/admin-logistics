import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Phone } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { PaginationWrapper as Pagination } from "@/components/common/Pagination";
import { cn } from "@/lib/utils";

type TripStatus = "completed" | "cancelled" | "inProgress";

interface UserTrip {
  tripId: string;
  date: string;
  route: string;
  loadType: string;
  status: TripStatus;
  amount: number;
}

interface UserProfile {
  id: string;
  promoterId: string;
  fullName: string;
  mobileNumber: string;
  address: string;
  isActive: boolean;
  vehicleType: string;
  vehicleNumber: string;
  trips: UserTrip[];
}

const PAGE_SIZE = 4;

const statusStyles: Record<TripStatus, string> = {
  completed: "bg-[#E4F7EC] text-[#2E715F]",
  cancelled: "bg-[#EEF2F6] text-[#64748B]",
  inProgress: "bg-[#FEF3C7] text-[#92400E]",
};

const statusLabel: Record<TripStatus, string> = {
  completed: "COMPLETED",
  cancelled: "CANCELLED",
  inProgress: "IN PROGRESS",
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const userProfiles: Record<string, UserProfile> = {
  "1": {
    id: "1",
    promoterId: "1",
    fullName: "Ramesh Patil",
    mobileNumber: "9876543210",
    address: "Pune",
    isActive: true,
    vehicleType: "Eicher1902",
    vehicleNumber: "MH-12 DJ 1329",
    trips: [
      {
        tripId: "#TR-8821",
        date: "05 Oct 2023",
        route: "Pune -> Mumbai",
        loadType: "Wheat (8T)",
        status: "completed",
        amount: 12000,
      },
      {
        tripId: "#TR-7712",
        date: "28 Sep 2023",
        route: "Nashik -> Pune",
        loadType: "Onions (4T)",
        status: "completed",
        amount: 6500,
      },
      {
        tripId: "#TR-6654",
        date: "15 Sep 2023",
        route: "Mumbai -> Surat",
        loadType: "Logistics",
        status: "cancelled",
        amount: 0,
      },
      {
        tripId: "#TR-6528",
        date: "14 Sep 2023",
        route: "Pune -> Kolhapur",
        loadType: "Sugar (6T)",
        status: "completed",
        amount: 8200,
      },
      {
        tripId: "#TR-6401",
        date: "11 Sep 2023",
        route: "Satara -> Pune",
        loadType: "Rice (5T)",
        status: "inProgress",
        amount: 0,
      },
    ],
  },
  "2": {
    id: "2",
    promoterId: "1",
    fullName: "Suresh Yadav",
    mobileNumber: "9234567890",
    address: "Nashik",
    isActive: true,
    vehicleType: "Tata 912",
    vehicleNumber: "MH-15 AB 9081",
    trips: [
      {
        tripId: "#TR-9120",
        date: "07 Oct 2023",
        route: "Nashik -> Mumbai",
        loadType: "Grapes (3T)",
        status: "completed",
        amount: 7300,
      },
      {
        tripId: "#TR-8978",
        date: "04 Oct 2023",
        route: "Mumbai -> Pune",
        loadType: "Logistics",
        status: "inProgress",
        amount: 0,
      },
    ],
  },
};

function getStaticUserProfile(userId: string, promoterId: string): UserProfile {
  return {
    id: userId,
    promoterId,
    fullName: `User ${userId}`,
    mobileNumber: "9876543210",
    address: "Pune",
    isActive: true,
    vehicleType: "Eicher1902",
    vehicleNumber: `MH-12 DJ ${String(1200 + Number(userId) || 1201)}`,
    trips: userProfiles["1"].trips,
  };
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}

export default function UserDetails() {
  const navigate = useNavigate();
  const { userId, promoterId } = useSearch({ from: "/(admin)/userDetails" });
  const selectedUserId = userId ?? "1";
  const profile =
    userProfiles[selectedUserId] ??
    getStaticUserProfile(selectedUserId, promoterId ?? "1");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [profile?.id]);

  const totalPages = Math.max(1, Math.ceil(profile.trips.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedTrips = useMemo(
    () =>
      profile.trips.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [currentPage, profile.trips],
  );
  return (
    <div className="bg-common-bg pr-10 pl-4 pb-6">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading-color">User Details</h1>
          <p className="text-base text-muted-foreground">
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
          className="inline-flex items-center gap-2 self-start text-sm font-medium text-icon-1-color hover:opacity-80"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Promoter Detail
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
          <Card className="shadow-sm">
            <CardContent className="space-y-5 p-5">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-icon-bg text-2xl font-bold text-icon-1-color">
                  {getInitials(profile.fullName)}
                </div>
                <h2 className="text-2xl font-semibold text-heading-color">
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
                  <Phone className="h-4 w-4 text-icon-1-color" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Phone Number
                    </p>
                    <p className="text-sm font-semibold text-heading-color">
                      {profile.mobileNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-md bg-common-bg px-3 py-2">
                  <MapPin className="h-4 w-4 text-icon-1-color" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Address
                    </p>
                    <p className="text-sm font-semibold text-heading-color">
                      {profile.address}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-5">
              <h3 className="mb-8 text-2xl font-semibold text-heading-color">
                Vehicle Details
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Vehicle Type
                  </p>
                  <div className="rounded-md border border-dashed border-[#CBD5E1] bg-common-bg px-4 py-3 text-base text-heading-color">
                    {profile.vehicleType}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Vehicle Number
                  </p>
                  <div className="rounded-md border border-dashed border-[#CBD5E1] bg-common-bg px-4 py-3 text-base text-heading-color">
                    {profile.vehicleNumber}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-0">
            <div className="border-b bg-common-bg/70 px-5 py-4">
              <h3 className="text-2xl font-semibold text-heading-color">User Trip History</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-common-bg text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3 text-left">Trip ID</th>
                    <th className="px-5 py-3 text-left">Date</th>
                    <th className="px-5 py-3 text-left">Route</th>
                    <th className="px-5 py-3 text-left">Load Type</th>
                    <th className="px-5 py-3 text-left">Status</th>
                    <th className="px-5 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTrips.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-5 text-center text-muted-foreground"
                      >
                        No trip history found.
                      </td>
                    </tr>
                  ) : (
                    paginatedTrips.map((trip) => (
                      <tr key={trip.tripId} className="border-t">
                        <td className="px-5 py-3 font-semibold text-heading-color">
                          {trip.tripId}
                        </td>
                        <td className="px-5 py-3 text-text-color">{trip.date}</td>
                        <td className="px-5 py-3 font-semibold text-heading-color">
                          {trip.route}
                        </td>
                        <td className="px-5 py-3 text-text-color">{trip.loadType}</td>
                        <td className="px-5 py-3">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide",
                              statusStyles[trip.status],
                            )}
                          >
                            {statusLabel[trip.status]}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right font-semibold text-heading-color">
                          {currencyFormatter.format(trip.amount)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <div className="flex flex-col gap-2 pt-2 md:flex-row md:items-center md:justify-between md:pt-3 lg:pt-4">

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}
