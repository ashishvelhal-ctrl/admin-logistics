import { apiClient } from "@/lib/api";

export type TripLocationPayload = {
  address: string;
  point: {
    lat: number;
    lng: number;
  };
};

export type CreateTripPayload = {
  userId: string;
  vehicleId: string;
  startLocation: TripLocationPayload;
  endLocation: TripLocationPayload;
  date: string;
  time: string;
  price: number;
  notes?: string;
};

export type CreateTripResponse = {
  id?: string;
  [key: string]: unknown;
};

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

export const tripApi = {
  createTrip: async (
    payload: CreateTripPayload,
  ): Promise<CreateTripResponse> => {
    const response = await apiClient.post(
      "/promoter/user/service-posts",
      payload,
    );
    return unwrapResponse<CreateTripResponse>(response);
  },
};
