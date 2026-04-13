import { ArrowLeft, CheckCircle2, Clock } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format-utils";
import { useVehicleDetailsPage } from "../hooks/useVehicleDetailsPage";

export default function VehicleDetailsPage() {
  const {
    userId,
    vehicleId,
    userDetails,
    selectedVehicle,
    statusInfo,
    vehicleImages,
    metadataRows,
    additionalInfo,
    displayModel,
    isLoading,
    error,
    goBack,
    emptyValue,
  } = useVehicleDetailsPage();

  if (!userId || !vehicleId) {
    return (
      <div className="bg-common-bg px-3 pb-6 md:pr-10 md:pl-4">
        <Button variant="ghost" onClick={goBack} className="mb-4 px-0">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to User Profile
        </Button>
        <Card className="border-border-stroke shadow-sm">
          <CardContent className="py-8 text-center text-muted-foreground">
            Vehicle details are not available.
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-common-bg px-3 pb-6 md:pr-10 md:pl-4">
        <Button variant="ghost" onClick={goBack} className="mb-4 px-0">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to User Profile
        </Button>
        <div className="flex h-64 flex-col items-center justify-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-icon-1-color"></div>
          <div className="text-lg">Loading vehicle details...</div>
        </div>
      </div>
    );
  }

  if (error || !selectedVehicle) {
    return (
      <div className="bg-common-bg px-3 pb-6 md:pr-10 md:pl-4">
        <Button variant="ghost" onClick={goBack} className="mb-4 px-0">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to User Profile
        </Button>
        <Card className="border-border-stroke shadow-sm">
          <CardContent className="py-8 text-center text-muted-foreground">
            Vehicle not found.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-common-bg px-3 pb-6 md:pr-10 md:pl-4">
      <Button
        variant="ghost"
        onClick={goBack}
        className="mb-4 px-0 text-icon-1-color"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to User Profile
      </Button>

      <div className="mb-5">
        <h1 className="text-3xl font-bold text-heading-color">
          Vehicle Details
        </h1>
        <p className="text-sm text-muted-foreground">
          Complete details for {userDetails?.name || "selected user"}'s vehicle.
        </p>
      </div>

      <Card className="overflow-hidden border-border-stroke shadow-sm">
        <CardContent className="grid gap-0 p-0 md:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-5 px-5 py-5 md:px-6 md:py-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8A98A8]">
                Vehicle Number
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <h2 className="text-3xl font-bold text-heading-color">
                  {selectedVehicle.vehicleNumber ||
                    selectedVehicle.rcNumber ||
                    emptyValue}
                </h2>
                <span
                  className={
                    statusInfo.verified
                      ? "inline-flex items-center gap-1 rounded-full bg-[#E8F5EE] px-2.5 py-1 text-xs font-semibold text-[#2F7D60]"
                      : "inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2.5 py-1 text-xs font-semibold text-[#92400E]"
                  }
                >
                  {statusInfo.verified ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <Clock className="h-3.5 w-3.5" />
                  )}
                  {statusInfo.label}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8A98A8]">
                Model
              </p>
              <p className="mt-2 text-2xl font-semibold text-heading-color">
                {displayModel}
              </p>
            </div>
          </div>

          <div className="border-t border-border-stroke bg-[#F8FAF9] p-4 md:border-t-0 md:border-l">
            {vehicleImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {vehicleImages.map((url, index) => (
                  <img
                    key={`${url}-${index}`}
                    src={url}
                    alt={`Vehicle ${index + 1}`}
                    className="h-24 w-full rounded-md border border-border-stroke object-cover"
                  />
                ))}
              </div>
            ) : (
              <div className="flex h-full min-h-[130px] items-center justify-center rounded-md border border-dashed border-border-stroke text-sm text-muted-foreground">
                No vehicle images available
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <Card className="border-border-stroke shadow-sm">
          <CardContent className="p-0">
            <div className="border-b border-border-stroke bg-[#F8FAF9] px-5 py-4">
              <h3 className="text-xl font-semibold text-heading-color">
                Documents & Compliance
              </h3>
            </div>
            <div className="space-y-4 px-5 py-5">
              <div className="grid grid-cols-3 gap-3 rounded-md border border-border-stroke px-4 py-3 text-sm">
                <p className="font-semibold text-heading-color">RC Document</p>
                <p
                  className={
                    statusInfo.verified
                      ? "font-semibold text-[#2F7D60]"
                      : "font-semibold text-[#92400E]"
                  }
                >
                  {statusInfo.label.toUpperCase()}
                </p>
                <p className="text-muted-foreground">
                  {selectedVehicle?.updatedAt
                    ? formatDate(selectedVehicle.updatedAt)
                    : selectedVehicle?.createdAt
                      ? formatDate(selectedVehicle.createdAt)
                      : emptyValue}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border-stroke shadow-sm">
          <CardContent className="p-0">
            <div className="border-b border-border-stroke bg-[#F8FAF9] px-5 py-4">
              <h3 className="text-xl font-semibold text-heading-color">
                Vehicle Specs
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-5 px-5 py-5">
              {metadataRows.map((row) => (
                <div key={row.label}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#8A98A8]">
                    {row.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-heading-color">
                    {row.value}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {additionalInfo.length > 0 ? (
        <Card className="mt-5 border-border-stroke shadow-sm">
          <CardContent className="p-0">
            <div className="border-b border-border-stroke bg-[#F8FAF9] px-5 py-4">
              <h3 className="text-xl font-semibold text-heading-color">
                Additional Information
              </h3>
            </div>
            <div className="grid gap-4 px-5 py-5 sm:grid-cols-2 lg:grid-cols-3">
              {additionalInfo.map((field) => (
                <div key={`${field.label}-${field.value}`}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#8A98A8]">
                    {field.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-heading-color">
                    {field.value}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
