import { useMutation } from "@tanstack/react-query";

import { tripApi, type CreateTripPayload } from "../services/tripApi";

export function useCreateTrip() {
  return useMutation({
    mutationFn: (payload: CreateTripPayload) => tripApi.createTrip(payload),
  });
}
