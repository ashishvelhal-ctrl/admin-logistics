import { useState } from "react";
import type { ChangeEvent } from "react";
import { ZodError } from "zod";
import { useNavigate } from "@tanstack/react-router";
import { useCreatePromoterUser } from "./usePromoterUsers";
import { createPromoterUserSchema } from "../schema/promoter.schema";
import { useSuccessMessage } from "@/hooks/useSuccessMessage";

export interface CreateUserFormData {
  name: string;
  phoneNumber: string;
  address: string;
  provideLogistics: boolean;
}

export function useCreateUser() {
  const navigate = useNavigate();
  const createPromoterUser = useCreatePromoterUser();
  const { showSuccess, showError } = useSuccessMessage();

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

      await createPromoterUser.mutateAsync({
        name: formData.name.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        address: formData.address.trim(),
        provideLogistics: formData.provideLogistics,
        hashCode: Math.random().toString(36).slice(2),
      });

      showSuccess("OTP sent successfully");
      navigate({
        to: "/verifyUserOtp",
        search: {
          phone: formData.phoneNumber.replace(/[^\d]/g, "").slice(-10),
          resend: false,
        },
      });
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
        return;
      }

      showError(error instanceof Error ? error.message : "Failed to send OTP");
    }
  };

  return {
    formData,
    validationErrors,
    isPending: createPromoterUser.isPending,
    handleInputChange,
    handleLogisticsToggle,
    handleCancel,
    handleContinue,
  };
}
