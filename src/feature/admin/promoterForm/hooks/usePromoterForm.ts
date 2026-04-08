import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { promoterApi } from "../services/promoterApi";

export function usePromoterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    assignedAddress: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const normalizePhoneNumber = (phoneNumber: string) => {
    const digitsOnly = phoneNumber.replace(/\D/g, "");
    return digitsOnly.length >= 10 ? digitsOnly.slice(-10) : digitsOnly;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const name = formData.fullName.trim();
      const phoneNumber = normalizePhoneNumber(formData.mobileNumber);
      const address = formData.assignedAddress.trim();

      if (name.length < 5) {
        throw new Error("Name must be at least 5 characters.");
      }

      if (address.length < 5) {
        throw new Error("Address must be at least 5 characters.");
      }

      if (phoneNumber.length !== 10) {
        throw new Error("Phone number must be exactly 10 digits.");
      }

      await promoterApi.createPromoter({
        name,
        phoneNumber,
        address,
      });

      navigate({ to: "/promoterList" });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to create promoter",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    submitError,
    handleInputChange,
    handleSubmit,
    navigate,
  };
}
