import { CheckCircle2, MapPin, Phone } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SidebarProps = {
  userId: string;
  userDetails: any;
  profileStatusData: any;
  isVerified: boolean;
  isDrivingLicenseVerified: boolean;
  onVerifyPhone: (phoneNumber: string) => void;
  onViewDrivingLicense: () => void;
  onVerifyDrivingLicense: () => void;
};

export default function PromoterUserSidebar({
  userDetails,
  profileStatusData,
  isVerified,
  isDrivingLicenseVerified,
  onVerifyPhone,
  onViewDrivingLicense,
  onVerifyDrivingLicense,
}: SidebarProps) {
  return (
    <div className="space-y-5">
      <Card className="border-border-stroke shadow-sm">
        <CardContent className="p-4 md:p-5">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-icon-bg text-xl font-bold text-icon-1-color md:h-20 md:w-20 md:text-2xl">
              {userDetails.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <h2 className="text-xl font-semibold text-heading-color md:text-2xl">
              {userDetails.name}
            </h2>
            <span
              className={cn(
                "mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
                isVerified
                  ? "bg-[#E5F4EC] text-[#2F7D60]"
                  : "bg-[#FEF3C7] text-[#92400E]",
              )}
            >
              {isVerified ? "Active" : "Pending"}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-md bg-common-bg px-3 py-2">
              <div className="flex items-center gap-3">
                <Phone className="h-3.5 w-3.5 text-icon-1-color md:h-4 md:w-4" />
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    Phone Number
                  </p>
                  <p className="text-sm font-semibold text-heading-color">
                    {userDetails.phoneNumber}
                  </p>
                </div>
              </div>
              {profileStatusData?.steps?.phoneVerified?.completed ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2F7D60]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  VERIFIED
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onVerifyPhone(userDetails.phoneNumber)}
                  className="inline-flex items-center rounded-md bg-icon-1-color px-2 py-1 text-xs font-semibold text-white transition-colors hover:bg-icon-1-color/90"
                >
                  VERIFY NOW
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 rounded-md bg-common-bg px-3 py-2">
              <MapPin className="h-3.5 w-3.5 text-icon-1-color md:h-4 md:w-4" />
              <div>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Address
                </p>
                <p className="text-sm font-semibold text-heading-color">
                  {userDetails.address || "Pune"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border-stroke shadow-sm">
        <CardContent className="p-4 md:p-5">
          <h3 className="text-lg font-semibold text-heading-color">
            Verification
          </h3>
          <div className="mt-4 rounded-md bg-common-bg px-3 py-4">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-heading-color">
                <CheckCircle2 className="h-4 w-4 text-icon-1-color" />
                Driving License
              </div>
              {isDrivingLicenseVerified ? (
                <button
                  type="button"
                  onClick={onViewDrivingLicense}
                  className="inline-flex items-center rounded-md bg-[#2F7D60] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#2F7D60]/90"
                >
                  VIEW
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onVerifyDrivingLicense}
                  disabled={!profileStatusData?.steps?.phoneVerified?.completed}
                  className={cn(
                    "inline-flex items-center rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                    profileStatusData?.steps?.phoneVerified?.completed
                      ? "bg-icon-1-color text-white hover:bg-icon-1-color/90"
                      : "cursor-not-allowed bg-gray-300 text-gray-500",
                  )}
                >
                  VERIFY
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
