import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";

import { FormHeader } from "@/components/common/FormHeader";
import { Button } from "@/components/ui/button";
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

      // Update promoter profile using the API service
      // NOTE: This API is for updating promoter-owned users, not the promoter themselves
      // For now, we'll simulate the update and navigate back
      console.log("Updating profile with data:", {
        userId: "current-user-id", // This should be the actual user ID from auth
        data: { name, address },
      });

      // TODO: Implement proper promoter profile update API
      // The current promoterService.updatePromoterUser is for updating promoter-owned users
      // We need a separate endpoint for updating the promoter's own profile

      // For now, simulate successful update
      console.log("Profile updated successfully (simulated)");

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
    <div className="bg-common-bg pr-10 pl-4">
      <FormHeader
        title="Edit Profile"
        description="Update your profile information"
        onBack={() => navigate({ to: "/myProfile" })}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="mb-6 shadow-sm">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {submitError && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {submitError}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter full name"
                  value={formData.fullName}
                  minLength={5}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedAddress">Assigned Address</Label>
                <Input
                  id="assignedAddress"
                  type="text"
                  placeholder="Enter assigned address"
                  value={formData.assignedAddress}
                  minLength={5}
                  onChange={(e) =>
                    handleInputChange("assignedAddress", e.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input
                  id="mobileNumber"
                  type="tel"
                  placeholder="Enter mobile number"
                  value={formData.mobileNumber}
                  pattern="[0-9+ ]{10,15}"
                  onChange={(e) =>
                    handleInputChange("mobileNumber", e.target.value)
                  }
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-8 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-icon-1-color text-white hover:bg-icon-1-color/90 transition-colors px-8"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: "/myProfile" })}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
