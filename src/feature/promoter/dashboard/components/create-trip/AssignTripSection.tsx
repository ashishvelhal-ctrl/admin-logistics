import { CheckIcon, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import TripFormSection from "./TripFormSection";

type Option = {
  value: string;
  label: string;
};

type AssignTripSectionProps = {
  userOpen: boolean;
  vehicleOpen: boolean;
  setUserOpen: (open: boolean) => void;
  setVehicleOpen: (open: boolean) => void;
  userQuery: string;
  setUserQuery: (value: string) => void;
  userOptions: Option[];
  vehicleOptions: Option[];
  selectedUserLabel?: string;
  selectedVehicleLabel?: string;
  selectedUserId: string;
  selectedVehicleId: string;
  onUserSelect: (value: string) => void;
  onVehicleSelect: (value: string) => void;
};

const BUTTON_CLASSNAME =
  "h-12 w-full justify-between rounded-xl border-border-stroke bg-[#FBFCFB] px-4 text-sm font-normal text-[#667085]";

export default function AssignTripSection({
  userOpen,
  vehicleOpen,
  setUserOpen,
  setVehicleOpen,
  userQuery,
  setUserQuery,
  userOptions,
  vehicleOptions,
  selectedUserLabel,
  selectedVehicleLabel,
  selectedUserId,
  selectedVehicleId,
  onUserSelect,
  onVehicleSelect,
}: AssignTripSectionProps) {
  return (
    <TripFormSection title="Assign Trip" allowOverflow>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="w-full space-y-2.5">
          <Label className="text-sm font-semibold text-heading-color">
            Select User
          </Label>
          <Popover open={userOpen} onOpenChange={setUserOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className={BUTTON_CLASSNAME}>
                <span className="truncate">
                  {selectedUserLabel ?? "Search User by name or mobile number"}
                </span>
                <ChevronDown className="h-4 w-4 text-inactive-text" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              side="bottom"
              sideOffset={8}
              className="z-50 w-[var(--radix-popover-trigger-width)] rounded-xl border-border-stroke p-0"
            >
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
                        onSelect={() => onUserSelect(user.value)}
                      >
                        <CheckIcon
                          className={`mr-2 size-4 ${
                            selectedUserId === user.value
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

        <div className="w-full space-y-2.5">
          <Label className="text-sm font-semibold text-heading-color">
            Vehicle Select
          </Label>
          <Popover open={vehicleOpen} onOpenChange={setVehicleOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                disabled={!selectedUserId}
                className={`${BUTTON_CLASSNAME} disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <span className="truncate">
                  {selectedVehicleLabel ?? "Choose Vehicle"}
                </span>
                <ChevronDown className="h-4 w-4 text-inactive-text" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              side="bottom"
              sideOffset={8}
              className="z-50 w-[var(--radix-popover-trigger-width)] rounded-xl border-border-stroke p-0"
            >
              <Command>
                <CommandList>
                  <CommandEmpty>No vehicles found for this user</CommandEmpty>
                  <CommandGroup>
                    {vehicleOptions.map((vehicle) => (
                      <CommandItem
                        key={vehicle.value}
                        value={vehicle.label}
                        onSelect={() => onVehicleSelect(vehicle.value)}
                      >
                        <CheckIcon
                          className={`mr-2 size-4 ${
                            selectedVehicleId === vehicle.value
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
    </TripFormSection>
  );
}
