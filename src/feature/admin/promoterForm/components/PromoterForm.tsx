import { usePromoterForm } from "../hooks/usePromoterForm";

import { FormHeader } from "@/components/common/FormHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PromoterForm() {
  const {
    formData,
    isSubmitting,
    submitError,
    handleInputChange,
    handleSubmit,
    navigate,
  } = usePromoterForm();

  return (
    <div className="bg-common-bg pr-10 pl-4">
      <FormHeader
        title="Add New Promoter"
        description="Onboard a new promoter to the secure vault network."
        onBack={() => navigate({ to: "/promoterList" })}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="mb-6 shadow-sm">
          <CardHeader>
            <CardTitle>Promoter Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {submitError && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {submitError}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>
            <div className="flex justify-end space-x-2 mt-8 pt-4">
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
                {isSubmitting ? "Creating..." : "Create Promoter"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
