import { CalendarDays, MapPin } from "lucide-react";
import type { ChangeEvent } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LocationField, TripFormData } from "../../types/trip";
import TripFormSection from "./TripFormSection";

type TripDetailsSectionProps = {
  formData: TripFormData;
  onInputChange: (
    field: keyof TripFormData,
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onOpenMap: (field: LocationField) => void;
};

const FIELD_CLASSNAME =
  "h-12 rounded-xl border-border-stroke bg-[#FBFCFB] text-sm";

export default function TripDetailsSection({
  formData,
  onInputChange,
  onOpenMap,
}: TripDetailsSectionProps) {
  return (
    <TripFormSection title="Trip Details">
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
        <div className="space-y-2.5">
          <Label
            htmlFor="pickupLocation"
            className="text-sm font-semibold text-heading-color"
          >
            Enter Pickup Location
          </Label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-inactive-text" />
            <Input
              id="pickupLocation"
              value={formData.pickupLocation}
              readOnly
              onClick={() => onOpenMap("pickup")}
              placeholder="Enter Pickup Location"
              className={`${FIELD_CLASSNAME} cursor-pointer pl-11 placeholder:text-[#98A2B3]`}
            />
          </div>
        </div>

        <div className="space-y-2.5">
          <Label
            htmlFor="dropLocation"
            className="text-sm font-semibold text-heading-color"
          >
            Drop Location
          </Label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-inactive-text" />
            <Input
              id="dropLocation"
              value={formData.dropLocation}
              readOnly
              onClick={() => onOpenMap("drop")}
              placeholder="Enter Drop Location"
              className={`${FIELD_CLASSNAME} cursor-pointer pl-11 placeholder:text-[#98A2B3]`}
            />
          </div>
        </div>

        <div className="space-y-2.5">
          <Label
            htmlFor="date"
            className="text-sm font-semibold text-heading-color"
          >
            Date
          </Label>
          <div className="relative">
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={onInputChange("date")}
              className={`${FIELD_CLASSNAME} pr-11`}
            />
            <CalendarDays className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-inactive-text" />
          </div>
        </div>

        <div className="space-y-2.5">
          <Label
            htmlFor="time"
            className="text-sm font-semibold text-heading-color"
          >
            Time
          </Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={onInputChange("time")}
            className={FIELD_CLASSNAME}
          />
        </div>

        <div className="space-y-2.5 md:max-w-[360px]">
          <Label
            htmlFor="price"
            className="text-sm font-semibold text-heading-color"
          >
            Price
          </Label>
          <Input
            id="price"
            value={formData.price}
            onChange={onInputChange("price")}
            placeholder="Enter Price"
            className={`${FIELD_CLASSNAME} placeholder:text-[#98A2B3]`}
          />
        </div>

        <div className="space-y-2.5 md:col-span-2">
          <Label
            htmlFor="notes"
            className="text-sm font-semibold text-heading-color"
          >
            Optional Notes
          </Label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={onInputChange("notes")}
            placeholder="E.g. Handle with care, helper needed, fragile items..."
            className="min-h-32 w-full rounded-xl border border-border-stroke bg-[#FBFCFB] px-4 py-3 text-sm text-heading-color outline-none placeholder:text-[#98A2B3]"
          />
        </div>
      </div>
    </TripFormSection>
  );
}
