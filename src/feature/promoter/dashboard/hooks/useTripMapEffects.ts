import {
  useEffect,
  useRef,
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
} from "react";
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

import { env } from "@/env";
import {
  googleLocationApi,
  type PlacesAutocompleteSuggestion,
} from "../services/googleLocationApi";
import type { Coordinates, LocationField } from "../types/trip";

const DEFAULT_ZOOM = 14;

type UseTripMapEffectsParams = {
  open: boolean;
  targetField: LocationField;
  initialPickup: string;
  initialDrop: string;
  initialPickupCoordinates: Coordinates | null;
  initialDropCoordinates: Coordinates | null;
  isLoaded: boolean;
  isInitializing: boolean;
  mapCenter: Coordinates;
  activeField: LocationField | null;
  fieldState: {
    pickup: { coordinates: Coordinates | null };
    drop: { coordinates: Coordinates | null };
  };
  mapContainerRef: MutableRefObject<HTMLDivElement | null>;
  mapRef: MutableRefObject<any>;
  currentLocationMarkerRef: MutableRefObject<any>;
  pickupMarkerRef: MutableRefObject<any>;
  dropMarkerRef: MutableRefObject<any>;
  directionsServiceRef: MutableRefObject<any>;
  directionsRendererRef: MutableRefObject<any>;
  setIsLoaded: (value: boolean) => void;
  setMapError: (value: string | null) => void;
  setIsLocating: (value: boolean) => void;
  setIsInitializing: (value: boolean) => void;
  setActiveField: (field: LocationField | null) => void;
  setSuggestions: Dispatch<
    SetStateAction<Record<LocationField, PlacesAutocompleteSuggestion[]>>
  >;
  setFieldLoadingState: (field: LocationField, value: boolean) => void;
  setMapCenter: (coords: Coordinates) => void;
  resetFieldState: () => void;
  clearDirections: () => void;
  fitMapToPoints: (points: Coordinates[]) => void;
  applyResolvedLocation: (
    field: LocationField,
    address: string,
    coordinates: Coordinates,
    placeId?: string,
  ) => void;
  restoreFromCurrentLocation: () => Promise<void>;
  restoreSavedField: (
    field: LocationField,
    value: string,
    coordinates: Coordinates | null,
  ) => Promise<void>;
};

export function useTripMapEffects({
  open,
  targetField,
  initialPickup,
  initialDrop,
  initialPickupCoordinates,
  initialDropCoordinates,
  isLoaded,
  isInitializing,
  mapCenter,
  activeField,
  fieldState,
  mapContainerRef,
  mapRef,
  currentLocationMarkerRef,
  pickupMarkerRef,
  dropMarkerRef,
  directionsServiceRef,
  directionsRendererRef,
  setIsLoaded,
  setMapError,
  setIsLocating,
  setIsInitializing,
  setActiveField,
  setSuggestions,
  setFieldLoadingState,
  setMapCenter,
  resetFieldState,
  clearDirections,
  fitMapToPoints,
  applyResolvedLocation,
  restoreFromCurrentLocation,
  restoreSavedField,
}: UseTripMapEffectsParams) {
  const hasInitializedOpenRef = useRef(false);

  useEffect(() => {
    if (open) {
      setActiveField(targetField);
    }
  }, [open, targetField, setActiveField]);

  useEffect(() => {
    resetFieldState();
  }, [
    initialPickup,
    initialDrop,
    initialPickupCoordinates,
    initialDropCoordinates,
    open,
    resetFieldState,
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
  }, [open, setIsLoaded, setMapError]);

  useEffect(() => {
    if (!open || !isLoaded || !mapContainerRef.current || mapRef.current) {
      return;
    }

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
  }, [
    open,
    isLoaded,
    mapCenter,
    mapContainerRef,
    mapRef,
    directionsServiceRef,
    directionsRendererRef,
  ]);

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
  }, [
    fieldState,
    open,
    isLoaded,
    isInitializing,
    directionsServiceRef,
    directionsRendererRef,
    clearDirections,
    fitMapToPoints,
  ]);

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
  }, [
    open,
    isLoaded,
    activeField,
    targetField,
    mapRef,
    setFieldLoadingState,
    setMapError,
    applyResolvedLocation,
    setMapCenter,
  ]);

  useEffect(() => {
    if (!open || !isLoaded || !mapRef.current) return;
    if (hasInitializedOpenRef.current) return;

    let cancelled = false;
    hasInitializedOpenRef.current = true;

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
    setIsInitializing,
    setMapError,
    setIsLocating,
    restoreSavedField,
    restoreFromCurrentLocation,
  ]);

  useEffect(() => {
    if (open) return;

    hasInitializedOpenRef.current = false;
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
  }, [
    open,
    setMapError,
    setIsLoaded,
    setIsLocating,
    setIsInitializing,
    setSuggestions,
    setActiveField,
    mapRef,
    directionsServiceRef,
    directionsRendererRef,
    currentLocationMarkerRef,
    pickupMarkerRef,
    dropMarkerRef,
  ]);
}
