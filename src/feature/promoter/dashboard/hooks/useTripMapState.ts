import { useCallback, useState } from "react";

import type {
  Coordinates,
  LocationField,
  LocationFieldState,
} from "../types/trip";
import type { PlacesAutocompleteSuggestion } from "../services/googleLocationApi";

type SuggestionState = Record<LocationField, PlacesAutocompleteSuggestion[]>;
type LoadingState = Record<LocationField, boolean>;
type PickerState = Record<LocationField, LocationFieldState>;

const createFieldState = (
  value = "",
  coordinates: Coordinates | null = null,
): LocationFieldState => ({
  value,
  placeId: "",
  coordinates,
});

export function useTripMapState({
  initialPickup,
  initialDrop,
  initialPickupCoordinates,
  initialDropCoordinates,
}: {
  initialPickup: string;
  initialDrop: string;
  initialPickupCoordinates: Coordinates | null;
  initialDropCoordinates: Coordinates | null;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<Coordinates>({
    lat: 20.5937,
    lng: 78.9629,
  });
  const [isLocating, setIsLocating] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [activeField, setActiveField] = useState<LocationField | null>(null);
  const [fieldLoading, setFieldLoading] = useState<LoadingState>({
    pickup: false,
    drop: false,
  });
  const [suggestions, setSuggestions] = useState<SuggestionState>({
    pickup: [],
    drop: [],
  });
  const [fieldState, setFieldState] = useState<PickerState>({
    pickup: createFieldState(initialPickup, initialPickupCoordinates),
    drop: createFieldState(initialDrop, initialDropCoordinates),
  });

  const setFieldValue = useCallback(
    (field: LocationField, updates: Partial<LocationFieldState>) => {
      setFieldState((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          ...updates,
        },
      }));
    },
    [],
  );

  const setFieldLoadingState = useCallback(
    (field: LocationField, value: boolean) => {
      setFieldLoading((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const resetFieldState = useCallback(() => {
    setFieldState({
      pickup: createFieldState(initialPickup, initialPickupCoordinates),
      drop: createFieldState(initialDrop, initialDropCoordinates),
    });
  }, [
    initialPickup,
    initialDrop,
    initialPickupCoordinates,
    initialDropCoordinates,
  ]);

  return {
    isLoaded,
    setIsLoaded,
    mapError,
    setMapError,
    mapCenter,
    setMapCenter,
    isLocating,
    setIsLocating,
    isInitializing,
    setIsInitializing,
    activeField,
    setActiveField,
    fieldLoading,
    suggestions,
    setSuggestions,
    fieldState,
    setFieldValue,
    setFieldLoadingState,
    resetFieldState,
  };
}
