import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import type { ChangeEvent } from "react";
import { ZodError } from "zod";

import { Button } from "@/components/ui/button";
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

        <div className="mt-8 rounded-xl border border-border-stroke bg-[#F8FAF9] p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-heading-color">
                Provide Logistics Services?
              </h3>
              <p className="text-sm text-inactive-text mt-1">
                I want to register as a courier or Delivery Partner
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogisticsToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.provideLogistics ? "bg-icon-1-color" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.provideLogistics ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-10 flex justify-end gap-3">
          <Button
            type="button"
            onClick={handleContinue}
            className="h-11 min-w-44 bg-icon-1-color hover:bg-icon-1-color/90 text-white"
          >
            Send OTP
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
