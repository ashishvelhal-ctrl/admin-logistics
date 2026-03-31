import { useNavigate } from "@tanstack/react-router";
import { UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import type { ChangeEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loadCapacityOptions = ["05-4T", "4-10T", "10-20T", "25+T"];

const capabilityOptions = [
  "Cold Storage / Reefer",
  "Open Truck / Flatbed",
  "Hazardous Materials",
  "Livestock Transport",
  "Oversized Cargo",
  "GPS Tracked Fleet",
];

export default function CreateVehical() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rcNumber, setRcNumber] = useState("");
  const [loadCapacity, setLoadCapacity] = useState("4-10T");
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>(
    [],
  );
  const [photoName, setPhotoName] = useState("");

  const toggleCapability = (capability: string) => {
    setSelectedCapabilities((prev) =>
      prev.includes(capability)
        ? prev.filter((item) => item !== capability)
        : [...prev, capability],
    );
  };

  const handlePickPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setPhotoName(file?.name || "");
  };

  return (
    <main className="bg-common-bg pr-4 pl-3 pt-1 pb-3 min-h-full">
      <section className="px-2">
        <h1 className="text-3xl font-semibold text-heading-color">
          Add Vehicles
        </h1>
        <p className="text-sm text-inactive-text mt-1">
          Add your vehicle details to offer transport services across the
          industrial agricultural network.
        </p>
      </section>

      <section className="mt-4 mx-2 rounded-xl border border-border-stroke bg-white px-8 py-7">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="rcNumber"
                className="text-sm font-semibold text-heading-color"
              >
                RC Number
              </Label>
              <Input
                id="rcNumber"
                value={rcNumber}
                onChange={(e) => setRcNumber(e.target.value)}
                placeholder="Enter RC Number"
                className="h-11 bg-[#F8FAF9] border-border-stroke placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-heading-color">
                Special Capabilities
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 rounded-lg bg-[#F8FAF9] p-3 border border-border-stroke max-h-44 overflow-y-auto">
                {[...capabilityOptions, ...capabilityOptions].map(
                  (capability, index) => (
                    <label
                      key={`${capability}-${index}`}
                      className="inline-flex items-center gap-2 text-sm text-text-color cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCapabilities.includes(
                          `${capability}-${index}`,
                        )}
                        onChange={() =>
                          toggleCapability(`${capability}-${index}`)
                        }
                        className="h-4 w-4 rounded border-border-stroke text-icon-1-color focus:ring-icon-1-color"
                      />
                      {capability}
                    </label>
                  ),
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-heading-color">
                Load Capacity
              </Label>
              <div className="flex flex-wrap gap-2">
                {loadCapacityOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setLoadCapacity(option)}
                    className={`h-9 px-5 rounded-full text-sm font-medium transition-colors ${
                      loadCapacity === option
                        ? "bg-icon-1-color text-white"
                        : "bg-gray-100 text-inactive-text hover:bg-gray-200"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-heading-color">
                Vehicle Photo
              </Label>
              <button
                type="button"
                onClick={handlePickPhoto}
                className="w-full h-44 border-2 border-dashed border-border-stroke rounded-lg bg-[#F8FAF9] flex flex-col items-center justify-center text-center px-4 hover:bg-gray-100 transition-colors"
              >
                <UploadCloud className="w-8 h-8 text-icon-text mb-3 bg-[#F8FAF9]" />
                <p className="text-sm font-medium text-heading-color">
                  Click or drag to upload
                </p>
                <p className="text-xs text-inactive-text mt-1">
                  High-resolution JPG or PNG. Ensure all text and the photo are
                  clearly visible.
                </p>
                {photoName ? (
                  <p className="text-xs text-icon-text mt-2">{photoName}</p>
                ) : null}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-start gap-3">
          <Button
            type="button"
            onClick={() => navigate({ to: "/verificationVehical" })}
            className="h-11 min-w-72 bg-icon-1-color hover:bg-icon-1-color/90 text-white"
          >
            Continue
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: "/addUser" })}
            className="h-11 min-w-28 border-border-stroke text-icon-text hover:bg-gray-50"
          >
            Cancel
          </Button>
        </div>
      </section>
    </main>
  );
}
