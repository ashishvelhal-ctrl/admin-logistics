import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTripMapPicker } from "../hooks/useTripMapPicker";
import type {
  Coordinates,
  LocationField,
  TripMapApplyPayload,
} from "../types/trip";
import TripMapSearchField from "./TripMapSearchField";

type TripMapPickerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetField: LocationField;
  initialPickup?: string;
  initialDrop?: string;
  initialPickupCoordinates?: Coordinates | null;
  initialDropCoordinates?: Coordinates | null;
  onApply: (payload: TripMapApplyPayload) => void;
};

export default function TripMapPicker(props: TripMapPickerProps) {
  const {
    mapContainerRef,
    isLoaded,
    mapError,
    isLocating,
    isInitializing,
    activeField,
    fieldLoading,
    suggestions,
    fieldState,
    setActiveField,
    fetchSuggestions,
    handleSuggestionSelect,
    applyRoute,
  } = useTripMapPicker(props);

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="h-[92vh] w-[96vw] max-w-7xl overflow-hidden rounded-2xl border border-border-stroke bg-white p-0">
        <div className="relative flex h-full flex-col">
          <div className="border-b border-border-stroke bg-[#F8FAF9] px-6 py-4">
            <DialogHeader className="space-y-1 text-left">
              <DialogTitle className="text-xl font-semibold text-heading-color">
                Select Route On Map
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Search, drag pins, click to place, and double-click a pin to
                remove it.
              </p>
              <p className="text-xs font-medium text-[#2E7D68]">
                Editing {props.targetField === "pickup" ? "pickup" : "drop"}{" "}
                location
              </p>
            </DialogHeader>
          </div>

          <div className="relative flex-1">
            <div ref={mapContainerRef} className="h-full w-full bg-[#EEF2F5]" />

            <div className="absolute left-1/2 top-3 z-20 w-[calc(100%-1rem)] -translate-x-1/2 rounded-2xl border border-border-stroke bg-white/95 p-3 shadow-xl backdrop-blur-sm md:top-4 md:w-[min(820px,calc(100%-2rem))] md:p-4">
              <div className="grid grid-cols-1 gap-3 overflow-visible md:grid-cols-[1fr_1fr_auto]">
                <TripMapSearchField
                  field="pickup"
                  value={fieldState.pickup.value}
                  loading={fieldLoading.pickup}
                  activeField={activeField}
                  suggestions={suggestions.pickup}
                  placeholder="Pickup location"
                  onChange={fetchSuggestions}
                  onFocus={setActiveField}
                  onSelect={handleSuggestionSelect}
                />

                <TripMapSearchField
                  field="drop"
                  value={fieldState.drop.value}
                  loading={fieldLoading.drop}
                  activeField={activeField}
                  suggestions={suggestions.drop}
                  placeholder="Drop location"
                  onChange={fetchSuggestions}
                  onFocus={setActiveField}
                  onSelect={handleSuggestionSelect}
                />

                <Button
                  type="button"
                  onClick={applyRoute}
                  className="h-11 shrink-0 bg-icon-1-color px-5 text-white hover:bg-icon-1-color/90"
                >
                  Use This Route
                </Button>
              </div>

              {isLocating ? (
                <p className="mt-3 text-sm text-heading-color">
                  Detecting current location and preparing the map...
                </p>
              ) : null}

              {isInitializing ? (
                <p className="mt-3 text-sm text-heading-color">
                  Restoring saved pickup and drop locations...
                </p>
              ) : null}

              {mapError ? (
                <p className="mt-3 text-sm font-medium text-red-600">
                  {mapError}
                </p>
              ) : null}
            </div>

            {!isLoaded && !mapError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                <div className="inline-flex items-center gap-2 rounded-full border border-border-stroke bg-white px-4 py-2 text-sm font-medium text-heading-color shadow-sm">
                  <LoaderCircle className="h-4 w-4 animate-spin text-icon-1-color" />
                  Loading Google Maps...
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
