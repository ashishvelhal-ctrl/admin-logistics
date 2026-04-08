import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { promoterApi } from "../services/promoterApi";

interface UsePromoterEditProps {
  promoterId: string | undefined;
  fullName: string | undefined;
  mobileNumber: string | undefined;
  assignedAddress: string | undefined;
}

export function usePromoterEdit({
  promoterId,
  fullName,
  mobileNumber,
  assignedAddress,
}: UsePromoterEditProps) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: fullName ?? "",
    mobileNumber: mobileNumber ?? "",
    assignedAddress: assignedAddress ?? "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      fullName: fullName ?? "",
      mobileNumber: mobileNumber ?? "",
      assignedAddress: assignedAddress ?? "",
    });
  }, [fullName, mobileNumber, assignedAddress]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!promoterId) {
      setSubmitError("Promoter ID is missing.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const name = formData.fullName.trim();
      const address = formData.assignedAddress.trim();

      if (name.length < 5) {
        throw new Error("Name must be at least 5 characters.");
      }

      if (address.length < 5) {
        throw new Error("Address must be at least 5 characters.");
      }

      await promoterApi.updatePromoter(promoterId, {
        name,
        phoneNumber: formData.mobileNumber,
        address,
      });

      navigate({ to: "/promoterList" });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to update promoter",
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
