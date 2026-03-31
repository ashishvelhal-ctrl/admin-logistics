import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import type { ChangeEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateUserFormData {
  fullName: string;
  mobileNumber: string;
  city: string;
}

export default function CreateUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateUserFormData>({
    fullName: "",
    mobileNumber: "",
    city: "",
  });

  const handleInputChange =
    (field: keyof CreateUserFormData) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleCancel = () => {
    navigate({ to: "/dashboardp" });
  };

  const handleContinue = () => {
    // TODO: Add form validation and submission logic
    navigate({ to: "/drivingLicence" });
  };

  return (
    <main className="bg-common-bg pr-4 pl-3 pt-1 pb-3 min-h-full">
      <section className="px-2 flex flex-col md:flex-row md:items-start md:justify-between gap-2">
        <div>
          <h1 className="text-3xl font-semibold text-heading-color">
            Add New User
          </h1>
          <p className="text-sm text-inactive-text mt-1">
            Enter user details to onboard them into the Verdant Harvest network.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate({ to: "/dashboardp" })}
          className="inline-flex items-center gap-2 text-sm text-icon-text hover:opacity-80 pt-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </section>

      <section className="mt-4 mx-2 rounded-xl border border-border-stroke bg-white px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label
              htmlFor="fullName"
              className="text-sm font-semibold text-heading-color"
            >
              Full Name
            </Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={handleInputChange("fullName")}
              placeholder="Enter User Name"
              className="h-10 bg-[#F8FAF9] border-border-stroke placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="mobileNumber"
              className="text-sm font-semibold text-heading-color"
            >
              Mobile Number
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-inactive-text">
                +91
              </span>
              <Input
                id="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange("mobileNumber")}
                placeholder=""
                className="h-10 bg-[#F8FAF9] border-border-stroke pl-12"
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-1">
            <Label
              htmlFor="city"
              className="text-sm font-semibold text-heading-color"
            >
              Area
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-inactive-text" />
              <Input
                id="city"
                value={formData.city}
                onChange={handleInputChange("city")}
                placeholder="Enter area name"
                className="h-10 bg-[#F8FAF9] border-border-stroke pl-10"
              />
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-end gap-3">
          <Button
            type="button"
            onClick={handleContinue}
            className="h-11 min-w-44 bg-icon-1-color hover:bg-icon-1-color/90 text-white"
          >
            Continue
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="h-11 min-w-24 border-border-stroke text-icon-text hover:bg-gray-50"
          >
            Cancel
          </Button>
        </div>
      </section>
    </main>
  );
}
