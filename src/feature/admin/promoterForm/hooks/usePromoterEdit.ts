import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    fullName: fullName ?? "",
    mobileNumber: mobileNumber ?? "",
    assignedAddress: assignedAddress ?? "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updatePromoterMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { name: string; phoneNumber: string; address: string };
    }) => promoterApi.updatePromoter(id, payload),
    onSuccess: async (_, variables) => {
      queryClient.setQueriesData(
        { queryKey: ["promoters"] },
        (oldData: any) => {
          if (!oldData || !Array.isArray(oldData.data)) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((item: any) =>
              (item.id || item._id) === variables.id
                ? {
                    ...item,
                    name: variables.payload.name,
                    fullName: variables.payload.name,
                    address: variables.payload.address,
                    assignedAddress: variables.payload.address,
                    phoneNumber: variables.payload.phoneNumber,
                    mobileNumber: variables.payload.phoneNumber,
                  }
                : item,
            ),
          };
        },
      );

      queryClient.setQueryData(
        ["promoterDetails", variables.id],
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            name: variables.payload.name,
            fullName: variables.payload.name,
            address: variables.payload.address,
            assignedAddress: variables.payload.address,
            phoneNumber: variables.payload.phoneNumber,
            mobileNumber: variables.payload.phoneNumber,
          };
        },
      );

      await queryClient.invalidateQueries({ queryKey: ["promoters"] });
      await queryClient.invalidateQueries({
        queryKey: ["promoterDetails", variables.id],
      });
    },
  });

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

      await updatePromoterMutation.mutateAsync({
        id: promoterId,
        payload: {
          name,
          phoneNumber: formData.mobileNumber,
          address,
        },
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
