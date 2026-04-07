import { useEffect, useRef, useState } from "react";
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

import { env } from "@/env";
import {
  googleLocationApi,
  type PlacesAutocompleteSuggestion,
} from "../services/googleLocationApi";
import type {
  Coordinates,
  LocationField,
  LocationFieldState,
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

type SuggestionState = Record<LocationField, PlacesAutocompleteSuggestion[]>;
type LoadingState = Record<LocationField, boolean>;
type PickerState = Record<LocationField, LocationFieldState>;

const DEFAULT_CENTER: Coordinates = { lat: 20.5937, lng: 78.9629 };
const DEFAULT_ZOOM = 14;

const createFieldState = (
  value = "",
  coordinates: Coordinates | null = null,
): LocationFieldState => ({
  value,
  placeId: "",
  coordinates,
});

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

  const [isLoaded, setIsLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<Coordinates>(DEFAULT_CENTER);
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

  const setFieldValue = (
    field: LocationField,
    updates: Partial<LocationFieldState>,
  ) => {
    setFieldState((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        ...updates,
      },
    }));
  };

  const setFieldLoadingState = (field: LocationField, value: boolean) => {
    setFieldLoading((prev) => ({ ...prev, [field]: value }));
  };

  const clearDirections = () => {
    directionsRendererRef.current?.setDirections({ routes: [] });
  };

  const fitMapToPoints = (points: Coordinates[]) => {
    const googleMaps = (window as any).google;
    if (!googleMaps?.maps || !mapRef.current || points.length === 0) return;

    if (points.length === 1) {
      mapRef.current.panTo(points[0]);
      mapRef.current.setZoom(DEFAULT_ZOOM);
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
    setFieldValue(field, createFieldState());
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

    if (value.trim().length < 3) {
      setSuggestions((prev) => ({ ...prev, [field]: [] }));
      return;
    }

    const requestId = activeRequestRef.current[field] + 1;
    activeRequestRef.current[field] = requestId;
    setFieldLoadingState(field, true);
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
    }
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

  useEffect(() => {
    if (open) {
      setActiveField(targetField);
    }
  }, [open, targetField]);

  useEffect(() => {
    setFieldState({
      pickup: createFieldState(initialPickup, initialPickupCoordinates),
      drop: createFieldState(initialDrop, initialDropCoordinates),
    });
  }, [
    initialPickup,
    initialDrop,
    initialPickupCoordinates,
    initialDropCoordinates,
    open,
  ]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const loadGoogleMaps = async () => {
      try {
        setOptions({ key: env.VITE_GOOGLE_MAPS_API_KEY });
        await importLibrary("maps");
        if (!cancelled) {
          setIsLoaded(true);
          setMapError(null);
        }
      } catch (error) {
        if (!cancelled) {
          setMapError(
            error instanceof Error
              ? error.message
              : "Failed to load Google Maps",
          );
        }
      }
    };

    loadGoogleMaps();

    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open || !isLoaded || !mapContainerRef.current || mapRef.current)
      return;

    const googleMaps = (window as any).google;
    if (!googleMaps?.maps) return;

    mapRef.current = new googleMaps.maps.Map(mapContainerRef.current, {
      center: mapCenter,
      zoom: DEFAULT_ZOOM,
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
    });

    directionsServiceRef.current = new googleMaps.maps.DirectionsService();
    directionsRendererRef.current = new googleMaps.maps.DirectionsRenderer({
      map: mapRef.current,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "#2E7D68",
        strokeOpacity: 0.85,
        strokeWeight: 5,
      },
    });
  }, [open, isLoaded, mapCenter]);

  useEffect(() => {
    if (!open || !isLoaded || !mapRef.current || isInitializing) return;

    const pickup = fieldState.pickup.coordinates;
    const drop = fieldState.drop.coordinates;

    if (pickup && drop) {
      directionsServiceRef.current?.route(
        {
          origin: pickup,
          destination: drop,
          travelMode: (window as any).google.maps.TravelMode.DRIVING,
        },
        (result: any, status: string) => {
          if (status === "OK" && result) {
            directionsRendererRef.current?.setDirections(result);
          } else {
            clearDirections();
            fitMapToPoints([pickup, drop]);
          }
        },
      );
      return;
    }

    clearDirections();
    fitMapToPoints([pickup, drop].filter(Boolean) as Coordinates[]);
  }, [fieldState, open, isLoaded, isInitializing]);

  useEffect(() => {
    if (!open || !isLoaded || !mapRef.current) return;

    const clickListener = mapRef.current.addListener(
      "click",
      async (event: any) => {
        const latLng = event.latLng;
        if (!latLng) return;

        const field = activeField ?? targetField;
        const coordinates = { lat: latLng.lat(), lng: latLng.lng() };

        setFieldLoadingState(field, true);
        setMapError(null);

        try {
          const reverseGeocodeResponse = await googleLocationApi.reverseGeocode(
            coordinates.lat,
            coordinates.lng,
          );

          applyResolvedLocation(
            field,
            reverseGeocodeResponse.results[0]?.formatted_address ??
              `${coordinates.lat}, ${coordinates.lng}`,
            coordinates,
          );
          setMapCenter(coordinates);
        } catch (error) {
          setMapError(
            error instanceof Error
              ? error.message
              : "Failed to reverse geocode selected map location.",
          );
        } finally {
          setFieldLoadingState(field, false);
        }
      },
    );

    return () => {
      clickListener?.remove();
    };
  }, [open, isLoaded, activeField, targetField]);

  useEffect(() => {
    if (!open || !isLoaded || !mapRef.current) return;

    let cancelled = false;

    const initializeMapState = async () => {
      setIsInitializing(true);
      setMapError(null);

      try {
        await restoreSavedField(
          "pickup",
          initialPickup,
          initialPickupCoordinates,
        );

        if (!initialPickup.trim()) {
          await restoreFromCurrentLocation();
        }

        await restoreSavedField("drop", initialDrop, initialDropCoordinates);
      } catch (error) {
        if (!cancelled) {
          setMapError(
            error instanceof Error
              ? error.message
              : "Failed to initialize saved route locations.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsInitializing(false);
          setIsLocating(false);
        }
      }
    };

    initializeMapState();

    return () => {
      cancelled = true;
    };
  }, [
    open,
    isLoaded,
    initialPickup,
    initialDrop,
    initialPickupCoordinates,
    initialDropCoordinates,
  ]);

  useEffect(() => {
    if (!open) {
      setMapError(null);
      setIsLoaded(false);
      setIsLocating(false);
      setIsInitializing(false);
      setSuggestions({ pickup: [], drop: [] });
      setActiveField(null);
      directionsRendererRef.current?.setMap(null);
      mapRef.current = null;
      directionsServiceRef.current = null;
      directionsRendererRef.current = null;
      currentLocationMarkerRef.current?.setMap(null);
      pickupMarkerRef.current?.setMap(null);
      dropMarkerRef.current?.setMap(null);
      currentLocationMarkerRef.current = null;
      pickupMarkerRef.current = null;
      dropMarkerRef.current = null;
    }
  }, [open]);

  return {
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
  };
}
