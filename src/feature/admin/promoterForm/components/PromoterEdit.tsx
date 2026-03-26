import { useState, useEffect } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";

import { FormHeader } from "@/components/common/FormHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PromoterEdit() {
  const navigate = useNavigate();
  const { promoterId } = useSearch({ from: "/(admin)/promoterEdit" });

  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    assignedAddress: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data fetch - replace with actual API call
  useEffect(() => {
    const fetchPromoter = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with actual API call
        // const promoter = await getPromoterById(promoterId)

        // Mock data for now
        const mockPromoter = {
          id: promoterId,
          fullName: "A",
          mobileNumber: "+91 1234567890",
          assignedAddress: "State",
        };

        setFormData({
          fullName: mockPromoter.fullName,
          mobileNumber: mockPromoter.mobileNumber,
          assignedAddress: mockPromoter.assignedAddress,
        });
      } catch (error) {
        console.error("Failed to fetch promoter:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (promoterId) {
      fetchPromoter();
    }
  }, [promoterId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Add your API call here to update promoter
      console.log("Updating promoter:", { id: promoterId, ...formData });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to promoter list after successful update
      navigate({ to: "/promoterList" });
    } catch (error) {
      console.error("Failed to update promoter:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-common-bg pr-10 pl-4">
      <FormHeader
        title="Edit Promoter"
        description="Update promoter information"
        onBack={() => navigate({ to: "/promoterList" })}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="mb-6 shadow-sm">
          <CardHeader>
            <CardTitle>Promoter Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
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
                onChange={(e) =>
                  handleInputChange("mobileNumber", e.target.value)
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
                onChange={(e) =>
                  handleInputChange("assignedAddress", e.target.value)
                }
                required
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: "/promoterList" })}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="outline"
                disabled={isSubmitting}
                className="hover:bg-icon-1-color hover:text-white hover:border-icon-1-color transition-colors"
              >
                {isSubmitting ? "Updating..." : "Update Promoter"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
