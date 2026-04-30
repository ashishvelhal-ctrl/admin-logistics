import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";

import { FormActionRow } from "@/components/common/FormActionRow";
import { FormHeader } from "@/components/common/FormHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditProfileFormData {
  fullName: string;
  mobileNumber: string;
  assignedAddress: string;
}

export default function EditProfile() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/(promoter)/editProfile" });
  const { fullName, mobileNumber, assignedAddress } = search as {
    fullName?: string;
    mobileNumber?: string;
    assignedAddress?: string;
  };

  const [formData, setFormData] = useState<EditProfileFormData>({
    fullName: fullName ?? "Raj Sharma",
    mobileNumber: mobileNumber ?? "9876543210",
    assignedAddress: assignedAddress ?? "Pune",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      fullName: fullName ?? "Raj Sharma",
      mobileNumber: mobileNumber ?? "9876543210",
      assignedAddress: assignedAddress ?? "Pune",
    });
  }, [fullName, mobileNumber, assignedAddress]);

  const handleInputChange = (
    field: keyof EditProfileFormData,
    value: string,
  ) => {
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
      const address = formData.assignedAddress.trim();

      if (name.length < 5) {
        throw new Error("Name must be at least 5 characters.");
      }

      if (address.length < 5) {
        throw new Error("Address must be at least 5 characters.");
      }

      navigate({ to: "/myProfile" });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to update profile",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-common-bg pr-4 pl-3 md:pr-10 md:pl-4">
      <FormHeader
        title="Edit Profile"
        description="Update your profile information"
        onBack={() => navigate({ to: "/myProfile" })}
        backText="Back to Profile"
      />

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <Card className="mb-4 sm:mb-6 shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6">
            {submitError && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-xs sm:text-sm text-red-700">
                {submitError}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter full name"
                  value={formData.fullName}
                  minLength={5}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  className="h-10 md:h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedAddress" className="text-sm">
                  Assigned Address
                </Label>
                <Input
                  id="assignedAddress"
                  type="text"
                  placeholder="Enter assigned address"
                  value={formData.assignedAddress}
                  minLength={5}
                  onChange={(e) =>
                    handleInputChange("assignedAddress", e.target.value)
                  }
                  className="h-10 md:h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobileNumber" className="text-sm">
                  Mobile Number
                </Label>
                <Input
                  id="mobileNumber"
                  type="tel"
                  placeholder="Enter mobile number"
                  value={formData.mobileNumber}
                  pattern="[0-9+ ]{10,15}"
                  onChange={(e) =>
                    handleInputChange("mobileNumber", e.target.value)
                  }
                  className="h-10 md:h-11"
                  required
                  readOnly
                />
              </div>
            </div>

            <FormActionRow
              primaryType="submit"
              primaryLabel="Save Changes"
              loadingLabel="Saving..."
              isLoading={isSubmitting}
              onCancel={() => navigate({ to: "/myProfile" })}
            />
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
