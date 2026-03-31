import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Phone } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { PaginationWrapper as Pagination } from "@/components/common/Pagination";
import RecentOnboardTable from "@/components/common/RecentOnboardTable";
import { cn } from "@/lib/utils";

type TripStatus = "completed" | "cancelled" | "inProgress";

interface UserTrip {
  tripId: string;
  date: string;
  route: string;
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

const statusLabel: Record<TripStatus, string> = {
  completed: "COMPLETED",
  cancelled: "CANCELLED",
  inProgress: "IN PROGRESS",
};

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
        status: "completed",
        amount: 12000,
      },
      {
        tripId: "#TR-7712",
        date: "28 Sep 2023",
        route: "Nashik -> Pune",
        status: "completed",
        amount: 6500,
      },
      {
        tripId: "#TR-6654",
        date: "15 Sep 2023",
        route: "Mumbai -> Surat",
        status: "cancelled",
        amount: 0,
      },
      {
        tripId: "#TR-6528",
        date: "14 Sep 2023",
        route: "Pune -> Kolhapur",
        status: "completed",
        amount: 8200,
      },
      {
        tripId: "#TR-6401",
        date: "11 Sep 2023",
        route: "Satara -> Pune",
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
        status: "completed",
        amount: 7300,
      },
      {
        tripId: "#TR-8978",
        date: "04 Oct 2023",
        route: "Mumbai -> Pune",
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

// Transform vehicle details to table format
function getVehicleDetailsData(profile: UserProfile) {
  return [
    {
      id: "vehicle-type",
      userName: "Vehicle Type",
      mobileNumber: profile.vehicleType,
      date: "",
      location: "",
    },
    {
      id: "vehicle-number",
      userName: "Vehicle Number",
      mobileNumber: profile.vehicleNumber,
      date: "",
      location: "",
    },
  ];
}

// Transform trip history to table format
function getTripHistoryData(trips: UserTrip[]) {
  return trips.map((trip) => ({
    id: trip.tripId,
    userName: trip.tripId,
    mobileNumber: trip.route,
    date: trip.date,
    location: statusLabel[trip.status],
  }));
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
      profile.trips.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
      ),
    [currentPage, profile.trips],
  );
  return (
    <div className="bg-common-bg pr-10 pl-4 pb-6">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading-color">
            User Details
          </h1>
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
            <CardContent className="p-0">
              <div className="border-b bg-[#F8FAF9] px-5 py-4">
                <h3 className="text-2xl font-semibold text-heading-color">
                  Vehicle Details
                </h3>
              </div>
              <RecentOnboardTable data={getVehicleDetailsData(profile)} />
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-0">
            <div className="border-b bg-[#F8FAF9] px-5 py-4">
              <h3 className="text-2xl font-semibold text-heading-color">
                User Trip History
              </h3>
            </div>
            <RecentOnboardTable data={getTripHistoryData(paginatedTrips)} />
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
