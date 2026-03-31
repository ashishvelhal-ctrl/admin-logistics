import { MapPin, Phone } from "lucide-react";

interface PromoterContactInfoProps {
  mobileNumber: string;
  assignedAddress: string;
}

export default function PromoterContactInfo({
  mobileNumber,
  assignedAddress,
}: PromoterContactInfoProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-md bg-common-bg px-3 py-2">
        <Phone className="h-4 w-4 text-icon-1-color" />
        <div>
          <p className="text-xs text-muted-foreground">Phone Number</p>
          <p className="text-sm font-semibold text-heading-color">
            {mobileNumber}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-md bg-common-bg px-3 py-2">
        <MapPin className="h-4 w-4 text-icon-1-color" />
        <div>
          <p className="text-xs text-muted-foreground">Address</p>
          <p className="text-sm font-semibold text-heading-color">
            {assignedAddress}
          </p>
        </div>
      </div>
    </div>
  );
}
