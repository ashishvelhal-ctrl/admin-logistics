import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";

import { useUpdatePromoterUser } from "@/feature/promoter/user/hooks/usePromoterUsers";

import { FormHeader } from "@/components/common/FormHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditUserFormData {
  name: string;
  address: string;
  mobileNumber?: string;
}

export default function EditUser() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/(promoter)/editUser" });
  const { userId, name, address, mobileNumber } = search as {
    userId?: string;
    name?: string;
    address?: string;
    mobileNumber?: string;
  };

  const [formData, setFormData] = useState<EditUserFormData>({
    name: name ?? "",
    address: address ?? "",
    mobileNumber: mobileNumber ?? "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateUser = useUpdatePromoterUser();

  useEffect(() => {
    setFormData({
      name: name ?? "",
      address: address ?? "",
      mobileNumber: mobileNumber ?? "",
    });
  }, [name, address, mobileNumber]);

  const handleInputChange = (field: keyof EditUserFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userId) {
      setSubmitError("User ID is missing.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const name = formData.name.trim();
      const address = formData.address.trim();

      if (name.length < 5) {
        throw new Error("Name must be at least 5 characters.");
      }

      if (address.length < 5) {
        throw new Error("Address must be at least 5 characters.");
      }

      updateUser.mutate({
        userId,
        updateData: {
          name,
          address,
          // mobileNumber: formData.mobileNumber // Temporarily comment out to test
        },
      });

      navigate({ to: "/myNetwork" });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to update user",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-common-bg pr-10 pl-4">
      <FormHeader
        title="Edit User"
        description="Update user information"
        onBack={() => navigate({ to: "/myNetwork" })}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="mb-6 shadow-sm">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {submitError && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {submitError}
              </div>
            )}
            {!userId && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                User ID is missing.
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter full name"
                  value={formData.name}
                  minLength={5}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Enter address"
                  value={formData.address}
                  minLength={5}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-8 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: "/myNetwork" })}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !userId}
                className="bg-icon-1-color text-white hover:bg-icon-1-color/90 transition-colors px-8"
              >
                {isSubmitting ? "Updating..." : "Update User"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
