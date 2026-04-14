import { z } from "zod";

export const networkUserSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    phoneNumber: z.string(),
    address: z.string().optional(),
    profileStatus: z.string().optional(),
    drivingLicense: z.string().optional(),
    dateOfBirth: z.string().optional(),
    totalTrips: z.number().optional(),
    requirementPost: z.number().optional(),
    cancellationRate: z.number().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })
  .passthrough();

export const networkPaginationMetaSchema = z.object({
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
  current_page: z.number(),
  total_pages: z.number(),
  has_next_page: z.boolean(),
  has_prev_page: z.boolean(),
});

export const networkUsersResponseSchema = z.object({
  message: z.string(),
  data: z.array(networkUserSchema),
  paginationMeta: networkPaginationMetaSchema,
});

export const getNetworkUsersParamsSchema = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
  search: z.string().optional(),
});

export const createNetworkUserPayloadSchema = z.object({
  name: z.string(),
  phoneNumber: z.string(),
  address: z.string(),
});

export const updateNetworkUserPayloadSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
});

export const userProfileCompletionStatusSchema = z
  .object({
    profileStatus: z.string().optional(),
    completionPercentage: z.number().optional(),
    isComplete: z.boolean().optional(),
    isDrivingLicenseVerified: z.boolean().optional(),
    drivingLicenseVerified: z.boolean().optional(),
  })
  .passthrough();

export const userVehiclesResponseSchema = z.object({
  message: z.string(),
  data: z.array(z.unknown()),
  paginationMeta: networkPaginationMetaSchema,
});

export const userTripSchema = z
  .object({
    id: z.string(),
    date: z.string(),
    time: z.string(),
    price: z.number(),
    startLocation: z.object({
      address: z.string(),
      city: z.string().optional(),
      state: z.string().optional(),
      pincode: z.string().optional(),
      point: z.object({ lat: z.number(), lng: z.number() }),
    }),
    endLocation: z.object({
      address: z.string(),
      city: z.string().optional(),
      state: z.string().optional(),
      pincode: z.string().optional(),
      point: z.object({ lat: z.number(), lng: z.number() }),
    }),
    status: z.string().optional(),
    createdAt: z.string().optional(),
  })
  .passthrough();

export const userTripsResponseSchema = z.object({
  message: z.string(),
  data: z.array(userTripSchema),
  paginationMeta: networkPaginationMetaSchema,
});

export const paginationParamsSchema = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
});

export type NetworkUser = z.infer<typeof networkUserSchema>;
export type NetworkPaginationMeta = z.infer<typeof networkPaginationMetaSchema>;
export type NetworkUsersResponse = z.infer<typeof networkUsersResponseSchema>;
export type GetNetworkUsersParams = z.infer<typeof getNetworkUsersParamsSchema>;
export type CreateNetworkUserPayload = z.infer<
  typeof createNetworkUserPayloadSchema
>;
export type UpdateNetworkUserPayload = z.infer<
  typeof updateNetworkUserPayloadSchema
>;
export type UserProfileCompletionStatus = z.infer<
  typeof userProfileCompletionStatusSchema
>;
export type UserVehiclesResponse = z.infer<typeof userVehiclesResponseSchema>;
export type UserTrip = z.infer<typeof userTripSchema>;
export type UserTripsResponse = z.infer<typeof userTripsResponseSchema>;
export type PaginationParams = z.infer<typeof paginationParamsSchema>;
