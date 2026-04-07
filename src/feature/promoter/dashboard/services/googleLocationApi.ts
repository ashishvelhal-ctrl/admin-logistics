import { apiClient } from "@/lib/api";

interface PlacesAutocompleteMatch {
  endOffset: number;
}

interface PlacesAutocompleteSuggestion {
  placePrediction: {
    place: string;
    placeId: string;
    text: {
      text: string;
      matches: PlacesAutocompleteMatch[];
    };
    structuredFormat: {
      mainText: {
        text: string;
        matches: PlacesAutocompleteMatch[];
      };
      secondaryText: {
        text: string;
      };
    };
    types: string[];
  };
}

interface PlacesAutocompleteResponse {
  suggestions: PlacesAutocompleteSuggestion[];
}

interface PlaceDetailsResponse {
  formattedAddress: string;
  location: {
    latitude: number;
    longitude: number;
  };
  displayName: {
    text: string;
    languageCode: string;
  };
}

interface ReverseGeocodeResponse {
  results: Array<{
    formatted_address: string;
  }>;
  status: string;
}

interface GeocodeResponse {
  results: Array<{
    formatted_address: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    place_id: string;
  }>;
  status: string;
}

const unwrapResponse = <T>(response: any): T => {
  if (
    response &&
    typeof response === "object" &&
    response.data &&
    typeof response.data === "object"
  ) {
    return (response.data.data ?? response.data) as T;
  }

  return response as T;
};

export const googleLocationApi = {
  getPlacesAutocomplete: async (
    query: string,
  ): Promise<PlacesAutocompleteResponse> => {
    const params = new URLSearchParams({ q: query });
    const response = await apiClient.get(
      `/location/places/autocomplete?${params.toString()}`,
    );

    return unwrapResponse<PlacesAutocompleteResponse>(response);
  },

  getPlaceDetails: async (placeId: string): Promise<PlaceDetailsResponse> => {
    const response = await apiClient.get(`/location/places/${placeId}`);
    return unwrapResponse<PlaceDetailsResponse>(response);
  },

  reverseGeocode: async (
    latitude: number,
    longitude: number,
  ): Promise<ReverseGeocodeResponse> => {
    const params = new URLSearchParams({
      lat: String(latitude),
      lng: String(longitude),
    });
    const response = await apiClient.get(
      `/location/reverse-geocode?${params.toString()}`,
    );

    return unwrapResponse<ReverseGeocodeResponse>(response);
  },

  geocode: async (query: string): Promise<GeocodeResponse> => {
    const params = new URLSearchParams({ q: query });
    const response = await apiClient.get(
      `/location/geocode?${params.toString()}`,
    );

    return unwrapResponse<GeocodeResponse>(response);
  },
};

export type {
  GeocodeResponse,
  PlaceDetailsResponse,
  PlacesAutocompleteSuggestion,
};
