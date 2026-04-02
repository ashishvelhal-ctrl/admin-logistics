import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin } from "lucide-react";
import type { ChangeEvent } from "react";
import { ZodError } from "zod";

import { FormActionRow } from "@/components/common/FormActionRow";
import PageHeader from "@/components/common/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPromoterUserSchema } from "../schema/promoter.schema";

interface CreateUserFormData {
  name: string;
  phoneNumber: string;
  address: string;
  provideLogistics: boolean;
}

export default function CreateUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateUserFormData>({
    name: "",
    phoneNumber: "",
    address: "",
    provideLogistics: false,
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const handleInputChange =
    (field: keyof CreateUserFormData) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleLogisticsToggle = () => {
    setFormData((prev) => ({
      ...prev,
      provideLogistics: !prev.provideLogistics,
    }));
  };

  const handleCancel = () => {
    navigate({ to: "/dashboardp" });
  };

  const handleContinue = async () => {
    try {
      setValidationErrors({});

      createPromoterUserSchema.parse({
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
      });

      sessionStorage.setItem(
        "promoter_new_user_pending",
        JSON.stringify(formData),
      );
      navigate({ to: "/verifyUserOtp" });
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string> = {};

        error.errors.forEach((err) => {
          if (err.path && err.path.length > 0) {
            const fieldName = err.path[0] as string;
            errors[fieldName] = err.message;
          }
        });

        setValidationErrors(errors);
      }
    }
  };

  return (
    <main className="bg-common-bg pr-4 pl-3 pt-1 pb-3 min-h-full">
      <PageHeader
        title="Add New User"
        description="Enter user details to onboard them into the Verdant Harvest network."
      />

      <section className="mt-4 mx-2 rounded-xl border border-border-stroke bg-white px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-semibold text-heading-color"
            >
              Full Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleInputChange("name")}
              placeholder="Enter User Name"
              className={`h-10 bg-[#F8FAF9] border-border-stroke placeholder:text-gray-400 ${
                validationErrors.name ? "border-red-500" : ""
              }`}
            />
            {validationErrors.name && (
              <p className="text-xs text-red-500 mt-1">
                {validationErrors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="phoneNumber"
              className="text-sm font-semibold text-heading-color"
            >
              Mobile Number
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-inactive-text">
                +91
              </span>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange("phoneNumber")}
                placeholder=""
                className={`h-10 bg-[#F8FAF9] border-border-stroke pl-12 ${
                  validationErrors.phoneNumber ? "border-red-500" : ""
                }`}
              />
            </div>
            {validationErrors.phoneNumber && (
              <p className="text-xs text-red-500 mt-1">
                {validationErrors.phoneNumber}
              </p>
            )}
          </div>

          <div className="space-y-2 md:col-span-1">
            <Label
              htmlFor="address"
              className="text-sm font-semibold text-heading-color"
            >
              Area
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-inactive-text" />
              <Input
                id="address"
                value={formData.address}
                onChange={handleInputChange("address")}
                placeholder="Enter area name"
                className={`h-10 bg-[#F8FAF9] border-border-stroke pl-10 ${
                  validationErrors.address ? "border-red-500" : ""
                }`}
              />
            </div>
            {validationErrors.address && (
              <p className="text-xs text-red-500 mt-1">
                {validationErrors.address}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-border-stroke bg-[#F8FAF9] p-4 sm:p-5">
          <div className="flex flex-row items-center justify-between gap-4 sm:gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-semibold text-heading-color">
                Provide Logistics Services?
              </h3>
              <p className="text-xs sm:text-sm text-inactive-text mt-1">
                I want to register as a courier or Delivery Partner
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogisticsToggle}
              className={`relative inline-flex flex-shrink-0 h-5 w-9 items-center rounded-full transition-colors ${
                formData.provideLogistics ? "bg-icon-1-color" : "bg-gray-300"
              }`}
              aria-label="Toggle logistics services"
            >
              <span
                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                  formData.provideLogistics
                    ? "translate-x-4"
                    : "translate-x-0.5"
                }`}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        <FormActionRow
          primaryType="button"
          primaryLabel="Send OTP"
          onPrimaryClick={handleContinue}
          onCancel={handleCancel}
        />
      </section>
    </main>
  );
}
