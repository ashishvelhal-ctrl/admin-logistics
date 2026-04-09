import type { Dispatch, MutableRefObject, SetStateAction } from "react";

import {
  googleLocationApi,
  type PlacesAutocompleteSuggestion,
} from "../services/googleLocationApi";
import type {
  Coordinates,
  LocationField,
  TripMapApplyPayload,
} from "../types/trip";

export function createTripMapActions({
  mapRef,
  pickupMarkerRef,
  dropMarkerRef,
  currentLocationMarkerRef,
  directionsRendererRef,
  activeRequestRef,
  autocompleteTimeoutRef,
  fieldState,
  setFieldValue,
  setFieldLoadingState,
  setSuggestions,
  setMapCenter,
  setMapError,
  setActiveField,
  setIsLocating,
  onApply,
  onOpenChange,
}: {
  mapRef: MutableRefObject<any>;
  pickupMarkerRef: MutableRefObject<any>;
  dropMarkerRef: MutableRefObject<any>;
  currentLocationMarkerRef: MutableRefObject<any>;
  directionsRendererRef: MutableRefObject<any>;
  activeRequestRef: MutableRefObject<{ pickup: number; drop: number }>;
  autocompleteTimeoutRef: MutableRefObject<{
    pickup: ReturnType<typeof setTimeout> | null;
    drop: ReturnType<typeof setTimeout> | null;
  }>;
  fieldState: {
    pickup: { value: string; coordinates: Coordinates | null };
    drop: { value: string; coordinates: Coordinates | null };
  };
  setFieldValue: (field: LocationField, updates: Record<string, any>) => void;
  setFieldLoadingState: (field: LocationField, value: boolean) => void;
  setSuggestions: Dispatch<
    SetStateAction<Record<LocationField, PlacesAutocompleteSuggestion[]>>
  >;
  setMapCenter: (coords: Coordinates) => void;
  setMapError: (value: string | null) => void;
  setActiveField: (field: LocationField | null) => void;
  setIsLocating: (value: boolean) => void;
  onApply: (payload: TripMapApplyPayload) => void;
  onOpenChange: (open: boolean) => void;
}) {
  const clearDirections = () => {
    directionsRendererRef.current?.setDirections({ routes: [] });
  };

  const fitMapToPoints = (points: Coordinates[]) => {
    const googleMaps = (window as any).google;
    if (!googleMaps?.maps || !mapRef.current || points.length === 0) return;

    if (points.length === 1) {
      mapRef.current.panTo(points[0]);
      mapRef.current.setZoom(14);
      return;
    }

    const bounds = new googleMaps.maps.LatLngBounds();
    points.forEach((point) => bounds.extend(point));
    mapRef.current.fitBounds(bounds, 120);
  };

  const clearFieldLocation = (field: LocationField) => {
    const markerRef = field === "pickup" ? pickupMarkerRef : dropMarkerRef;
    markerRef.current?.setMap(null);
    markerRef.current = null;
    setFieldValue(field, { value: "", placeId: "", coordinates: null });
    setSuggestions((prev) => ({ ...prev, [field]: [] }));
  };

  const handleMarkerDragEnd = async (
    field: LocationField,
    event: any,
    placeId = "",
  ) => {
    const latLng = event.latLng;
    if (!latLng) return;

    const coordinates = { lat: latLng.lat(), lng: latLng.lng() };
    setMapCenter(coordinates);
    setMapError(null);
    setFieldLoadingState(field, true);

    try {
      const reverseGeocodeResponse = await googleLocationApi.reverseGeocode(
        coordinates.lat,
        coordinates.lng,
      );

      setFieldValue(field, {
        value:
          reverseGeocodeResponse.results[0]?.formatted_address ??
          `${coordinates.lat}, ${coordinates.lng}`,
        placeId,
        coordinates,
      });
    } catch (error) {
      setMapError(
        error instanceof Error
          ? error.message
          : "Failed to reverse geocode marker position.",
      );
      setFieldValue(field, { placeId, coordinates });
    } finally {
      setFieldLoadingState(field, false);
    }
  };

  const updateMarker = (
    field: LocationField,
    coordinates: Coordinates,
    placeId = "",
  ) => {
    const googleMaps = (window as any).google;
    if (!googleMaps?.maps || !mapRef.current) return;

    const markerRef = field === "pickup" ? pickupMarkerRef : dropMarkerRef;
    markerRef.current?.setMap(null);

    markerRef.current = new googleMaps.maps.Marker({
      position: coordinates,
      map: mapRef.current,
      title: field === "pickup" ? "Pickup Location" : "Drop Location",
      draggable: true,
      icon: {
        url:
          field === "pickup"
            ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
            : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
      },
    });

    markerRef.current.addListener("dragend", (event: any) => {
      handleMarkerDragEnd(field, event, placeId);
    });
    markerRef.current.addListener("dblclick", () => clearFieldLocation(field));
  };

  const applyResolvedLocation = (
    field: LocationField,
    address: string,
    coordinates: Coordinates,
    placeId = "",
  ) => {
    setFieldValue(field, { value: address, placeId, coordinates });
    updateMarker(field, coordinates, placeId);
  };

  const restoreFromCurrentLocation = async () => {
    if (!navigator.geolocation) return;

    setIsLocating(true);

    await new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          const coordinates = { lat: coords.latitude, lng: coords.longitude };
          setMapCenter(coordinates);

          const googleMaps = (window as any).google;
          if (googleMaps?.maps && mapRef.current) {
            currentLocationMarkerRef.current?.setMap(null);
            currentLocationMarkerRef.current = new googleMaps.maps.Marker({
              position: coordinates,
              map: mapRef.current,
              title: "Current Location",
            });
          }

          try {
            const reverseGeocodeResponse =
              await googleLocationApi.reverseGeocode(
                coords.latitude,
                coords.longitude,
              );
            const address =
              reverseGeocodeResponse.results[0]?.formatted_address;
            if (address) {
              applyResolvedLocation("pickup", address, coordinates);
            }
          } finally {
            resolve();
          }
        },
        () => resolve(),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    });

    setIsLocating(false);
  };

  const restoreSavedField = async (
    field: LocationField,
    value: string,
    coordinates: Coordinates | null,
  ) => {
    if (!value.trim()) return;

    if (coordinates) {
      applyResolvedLocation(field, value, coordinates);
      if (field === "pickup") {
        setMapCenter(coordinates);
      }
      return;
    }

    const response = await googleLocationApi.geocode(value);
    const result = response.results[0];
    if (!result) return;

    applyResolvedLocation(
      field,
      result.formatted_address,
      {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
      },
      result.place_id,
    );
  };

  const fetchSuggestions = async (field: LocationField, value: string) => {
    setFieldValue(field, { value, placeId: "" });

    if (autocompleteTimeoutRef.current[field]) {
      clearTimeout(autocompleteTimeoutRef.current[field]!);
      autocompleteTimeoutRef.current[field] = null;
    }

    if (value.trim().length < 3) {
      setSuggestions((prev) => ({ ...prev, [field]: [] }));
      setFieldLoadingState(field, false);
      return;
    }

    setFieldLoadingState(field, true);
    autocompleteTimeoutRef.current[field] = setTimeout(async () => {
      const requestId = activeRequestRef.current[field] + 1;
      activeRequestRef.current[field] = requestId;
      setMapError(null);

      try {
        const response = await googleLocationApi.getPlacesAutocomplete(
          value.trim(),
        );
        if (activeRequestRef.current[field] !== requestId) return;
        setSuggestions((prev) => ({
          ...prev,
          [field]: response.suggestions ?? [],
        }));
      } catch (error) {
        if (activeRequestRef.current[field] === requestId) {
          setMapError(
            error instanceof Error
              ? error.message
              : "Failed to fetch location suggestions.",
          );
          setSuggestions((prev) => ({ ...prev, [field]: [] }));
        }
      } finally {
        if (activeRequestRef.current[field] === requestId) {
          setFieldLoadingState(field, false);
        }
        autocompleteTimeoutRef.current[field] = null;
      }
    }, 300);
  };

  const handleSuggestionSelect = async (
    field: LocationField,
    suggestion: PlacesAutocompleteSuggestion,
  ) => {
    const placeId = suggestion.placePrediction.placeId;
    setFieldLoadingState(field, true);
    setMapError(null);

    try {
      const details = await googleLocationApi.getPlaceDetails(placeId);
      const coordinates = {
        lat: details.location.latitude,
        lng: details.location.longitude,
      };

      applyResolvedLocation(
        field,
        details.formattedAddress,
        coordinates,
        placeId,
      );
      setSuggestions((prev) => ({ ...prev, [field]: [] }));
      setActiveField(null);
      setMapCenter(coordinates);
    } catch (error) {
      setMapError(
        error instanceof Error
          ? error.message
          : "Failed to fetch place details.",
      );
    } finally {
      setFieldLoadingState(field, false);
    }
  };

  const applyRoute = () => {
    const pickupLocation = fieldState.pickup.value.trim();
    const dropLocation = fieldState.drop.value.trim();

    if (!pickupLocation || !dropLocation) {
      setMapError("Please select both pickup and drop before applying.");
      return;
    }

    onApply({
      pickupLocation,
      dropLocation,
      pickupCoordinates: fieldState.pickup.coordinates,
      dropCoordinates: fieldState.drop.coordinates,
    });
    onOpenChange(false);
  };

  return {
    clearDirections,
    fitMapToPoints,
    applyResolvedLocation,
    restoreFromCurrentLocation,
    restoreSavedField,
    fetchSuggestions,
    handleSuggestionSelect,
    applyRoute,
  };
}
