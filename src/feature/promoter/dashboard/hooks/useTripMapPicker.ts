import { useEffect, useRef } from "react";

import { createTripMapActions } from "./tripMapActions";
import { useTripMapEffects } from "./useTripMapEffects";
import { useTripMapState } from "./useTripMapState";
import type {
  Coordinates,
  LocationField,
  TripMapApplyPayload,
} from "../types/trip";

type UseTripMapPickerParams = {
  open: boolean;
  targetField: LocationField;
  initialPickup: string;
  initialDrop: string;
  initialPickupCoordinates: Coordinates | null;
  initialDropCoordinates: Coordinates | null;
  onApply: (payload: TripMapApplyPayload) => void;
  onOpenChange: (open: boolean) => void;
};

export function useTripMapPicker({
  open,
  targetField,
  initialPickup,
  initialDrop,
  initialPickupCoordinates,
  initialDropCoordinates,
  onApply,
  onOpenChange,
}: UseTripMapPickerParams) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const currentLocationMarkerRef = useRef<any>(null);
  const pickupMarkerRef = useRef<any>(null);
  const dropMarkerRef = useRef<any>(null);
  const directionsServiceRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);
  const activeRequestRef = useRef({ pickup: 0, drop: 0 });
  const autocompleteTimeoutRef = useRef<{
    pickup: ReturnType<typeof setTimeout> | null;
    drop: ReturnType<typeof setTimeout> | null;
  }>({
    pickup: null,
    drop: null,
  });

  const state = useTripMapState({
    initialPickup,
    initialDrop,
    initialPickupCoordinates,
    initialDropCoordinates,
  });

  const actions = createTripMapActions({
    mapRef,
    pickupMarkerRef,
    dropMarkerRef,
    currentLocationMarkerRef,
    directionsRendererRef,
    activeRequestRef,
    autocompleteTimeoutRef,
    fieldState: state.fieldState,
    setFieldValue: state.setFieldValue,
    setFieldLoadingState: state.setFieldLoadingState,
    setSuggestions: state.setSuggestions,
    setMapCenter: state.setMapCenter,
    setMapError: state.setMapError,
    setActiveField: state.setActiveField,
    setIsLocating: state.setIsLocating,
    onApply,
    onOpenChange,
  });

  useTripMapEffects({
    open,
    targetField,
    initialPickup,
    initialDrop,
    initialPickupCoordinates,
    initialDropCoordinates,
    isLoaded: state.isLoaded,
    isInitializing: state.isInitializing,
    mapCenter: state.mapCenter,
    activeField: state.activeField,
    fieldState: state.fieldState,
    mapContainerRef,
    mapRef,
    currentLocationMarkerRef,
    pickupMarkerRef,
    dropMarkerRef,
    directionsServiceRef,
    directionsRendererRef,
    setIsLoaded: state.setIsLoaded,
    setMapError: state.setMapError,
    setIsLocating: state.setIsLocating,
    setIsInitializing: state.setIsInitializing,
    setActiveField: state.setActiveField,
    setSuggestions: state.setSuggestions,
    setFieldLoadingState: state.setFieldLoadingState,
    setMapCenter: state.setMapCenter,
    resetFieldState: state.resetFieldState,
    clearDirections: actions.clearDirections,
    fitMapToPoints: actions.fitMapToPoints,
    applyResolvedLocation: actions.applyResolvedLocation,
    restoreFromCurrentLocation: actions.restoreFromCurrentLocation,
    restoreSavedField: actions.restoreSavedField,
  });

  useEffect(() => {
    if (open) return;

    if (autocompleteTimeoutRef.current.pickup) {
      clearTimeout(autocompleteTimeoutRef.current.pickup);
      autocompleteTimeoutRef.current.pickup = null;
    }

    if (autocompleteTimeoutRef.current.drop) {
      clearTimeout(autocompleteTimeoutRef.current.drop);
      autocompleteTimeoutRef.current.drop = null;
    }
  }, [open]);

  return {
    mapContainerRef,
    isLoaded: state.isLoaded,
    mapError: state.mapError,
    isLocating: state.isLocating,
    isInitializing: state.isInitializing,
    activeField: state.activeField,
    fieldLoading: state.fieldLoading,
    suggestions: state.suggestions,
    fieldState: state.fieldState,
    setActiveField: state.setActiveField,
    fetchSuggestions: actions.fetchSuggestions,
    handleSuggestionSelect: actions.handleSuggestionSelect,
    applyRoute: actions.applyRoute,
  };
}
