import { useNavigate } from "@tanstack/react-router";
import { CalendarDays, ChevronDown, MapPin, CheckIcon } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { networkApi } from "@/feature/promoter/network/services/networkApi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import PageHeader from "@/components/common/PageHeader";
import { FormActionRow } from "@/components/common/FormActionRow";

interface TripFormData {
  userSearch: string;
  selectedUserId: string;
  vehicle: string;
  pickupLocation: string;
  dropLocation: string;
  date: string;
  time: string;
  price: string;
  notes: string;
}

export default function CreateTrip() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TripFormData>({
    userSearch: "",
    selectedUserId: "",
    vehicle: "",
    pickupLocation: "",
    dropLocation: "",
    date: "",
    time: "",
    price: "",
    notes: "",
  });

  const [userQuery, setUserQuery] = useState("");
  const { data: usersResponse } = useQuery({
    queryKey: ["trip-create-users", userQuery],
    queryFn: () =>
      networkApi.getUsers({ limit: 100, offset: 0, search: userQuery }),
    enabled: true,
  });

  const [open, setOpen] = useState(false);
  const [vehicleOpen, setVehicleOpen] = useState(false);

  // Fetch vehicles when user is selected
  const { data: vehiclesResponse } = useQuery({
    queryKey: ["user-vehicles", formData.selectedUserId],
    queryFn: () =>
      networkApi.getUserVehicles(formData.selectedUserId, {
        limit: 100,
        offset: 0,
      }),
    enabled: !!formData.selectedUserId,
  });

  const vehicleOptions = (vehiclesResponse?.data ?? []).map((vehicle: any) => ({
    value: String(vehicle.id),
    label: `${vehicle.rcNumberData?.makerModel || "Unknown Vehicle"} (${vehicle.rcNumber || "N/A"})`,
  }));

  const selectedVehicle = vehicleOptions.find(
    (vehicle) => vehicle.value === formData.vehicle,
  );

  const handleVehicleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, vehicle: value }));
    setVehicleOpen(false);
  };

  const userOptions = (usersResponse?.data ?? []).map((user) => ({
    value: String(user.id),
    label: `${user.name} (${user.phoneNumber})`,
  }));

  const selectedUser = userOptions.find(
    (user) => user.value === formData.selectedUserId,
  );

  const handleChange =
    (field: keyof TripFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleUserSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, selectedUserId: value }));
    setOpen(false);
  };

  const handleCreateTrip = () => {
    console.log("Create Trip payload:", formData);
  };

  return (
    <main className="bg-common-bg pr-4 pl-3 pt-1 pb-3 min-h-full">
      <PageHeader
        title="Create Trip"
        description="Assign a trip between a customer and a driver"
      />

      <section className="mt-4 mx-2 space-y-4">
        <article className="rounded-xl border border-border-stroke bg-white overflow-visible">
          <div className="px-5 py-3 border-b border-border-stroke bg-[#F8FAF9]">
            <h2 className="text-lg font-semibold text-heading-color ">
              Assign Trip
            </h2>
          </div>
          <div className="p-4 md:p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-heading-color">
                Select User
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-10 justify-between bg-[#F8FAF9] border-border-stroke rounded-md px-3 text-text-color font-medium text-sm"
                  >
                    {selectedUser?.label ?? "Choose User"}
                    <ChevronDown className="w-4 h-4 text-inactive-text" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="z-50 p-0 w-full">
                  <Command>
                    <CommandInput
                      placeholder="Search user by name or mobile number..."
                      value={userQuery}
                      onValueChange={setUserQuery}
                    />
                    <CommandList>
                      <CommandEmpty>No users found</CommandEmpty>
                      <CommandGroup>
                        {userOptions.map((user) => (
                          <CommandItem
                            key={user.value}
                            value={user.label}
                            onSelect={() => handleUserSelectChange(user.value)}
                          >
                            <CheckIcon
                              className={`mr-2 size-4 ${
                                formData.selectedUserId === user.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                            />
                            {user.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-heading-color">
                Vehicle Select
              </Label>
              <Popover open={vehicleOpen} onOpenChange={setVehicleOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-10 justify-between bg-[#F8FAF9] border-border-stroke rounded-md px-3 text-text-color font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!formData.selectedUserId}
                  >
                    {selectedVehicle?.label ??
                      (formData.selectedUserId
                        ? "Choose Vehicle"
                        : "Select User First")}
                    <ChevronDown className="w-4 h-4 text-inactive-text" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="z-50 p-0 w-full">
                  <Command>
                    <CommandList>
                      <CommandEmpty>
                        No vehicles found for this user
                      </CommandEmpty>
                      <CommandGroup>
                        {vehicleOptions.map((vehicle) => (
                          <CommandItem
                            key={vehicle.value}
                            value={vehicle.label}
                            onSelect={() =>
                              handleVehicleSelectChange(vehicle.value)
                            }
                          >
                            <CheckIcon
                              className={`mr-2 size-4 ${
                                formData.vehicle === vehicle.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                            />
                            {vehicle.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-border-stroke bg-white overflow-hidden">
          <div className="px-5 py-3 border-b border-border-stroke bg-[#F8FAF9]">
            <h2 className="text-lg font-semibold text-heading-color">
              Trip Details
            </h2>
          </div>
          <div className="p-4 md:p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="pickupLocation"
                  className="text-xs font-semibold text-heading-color"
                >
                  Enter Pickup Location
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-inactive-text" />
                  <Input
                    id="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={handleChange("pickupLocation")}
                    placeholder="Enter Pickup Location"
                    className="h-10 bg-[#F8FAF9] border-border-stroke text-sm pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="dropLocation"
                  className="text-xs font-semibold text-heading-color"
                >
                  Drop Location
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-inactive-text" />
                  <Input
                    id="dropLocation"
                    value={formData.dropLocation}
                    onChange={handleChange("dropLocation")}
                    placeholder="Enter Drop Location"
                    className="h-10 bg-[#F8FAF9] border-border-stroke text-sm pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="date"
                  className="text-xs font-semibold text-heading-color"
                >
                  Date
                </Label>
                <div className="relative">
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange("date")}
                    className="h-10 bg-[#F8FAF9] border-border-stroke text-sm"
                  />
                  <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-inactive-text pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="time"
                  className="text-xs font-semibold text-heading-color"
                >
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange("time")}
                  className="h-10 bg-[#F8FAF9] border-border-stroke text-sm"
                />
              </div>
            </div>

            <div className="space-y-2 md:max-w-md">
              <Label
                htmlFor="price"
                className="text-xs font-semibold text-heading-color"
              >
                Price
              </Label>
              <Input
                id="price"
                value={formData.price}
                onChange={handleChange("price")}
                placeholder="Enter Price"
                className="h-10 bg-[#F8FAF9] border-border-stroke text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="notes"
                className="text-lg font-semibold text-heading-color"
              >
                Optional Notes
              </Label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={handleChange("notes")}
                placeholder="E.g. Handle with care, helper needed, fragile items..."
                className="w-full h-24 rounded-md border border-border-stroke bg-[#F8FAF9] px-3 py-2 text-sm text-heading-color outline-none"
              />
            </div>

            <FormActionRow
              primaryType="button"
              primaryLabel="Create Trip"
              onPrimaryClick={handleCreateTrip}
              onCancel={() => navigate({ to: "/dashboardp" })}
            />
          </div>
        </article>
      </section>
    </main>
  );
}
