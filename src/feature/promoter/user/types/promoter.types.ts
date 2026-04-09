import { z } from "zod";

export const profileStatusEnum = z.enum([
  "pending",
  "verified",
  "rejected",
  "dl_verified",
  "active",
  "deactivated",
]);

export const paginationMetaSchema = z.object({
  limit: z.number(),
  offset: z.number(),
  total: z.number(),
  current_page: z.number(),
  total_pages: z.number(),
  has_next_page: z.boolean(),
  has_prev_page: z.boolean(),
});

export const promoterUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  phoneNumber: z.string(),
  address: z.string().optional(),
  promoter: z.string().optional(),
  roles: z.array(z.string()),
  profileStatus: profileStatusEnum,
  provideLogistics: z.boolean().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const promoterUsersListResponseSchema = z.object({
  message: z.string(),
  data: z.array(promoterUserSchema),
  paginationMeta: paginationMetaSchema,
});

export const createPromoterUserRequestSchema = z.object({
  name: z.string(),
  phoneNumber: z.string(),
  address: z.string(),
  provideLogistics: z.boolean(),
  hashCode: z.string(),
});

export const updatePromoterUserRequestSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
});

export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    message: z.string(),
    data: dataSchema,
  });

export const verifyPromoterUserOtpRequestSchema = z.object({
  phoneNumber: z.string(),
  otpCode: z.string(),
});

export const verifyDrivingLicenseRequestSchema = z.object({
  userId: z.string(),
  dlNumber: z.string(),
  dateOfBirth: z.string(),
});

export const vehicleCreateRequestSchema = z.object({
  userId: z.string(),
  rcNumber: z.string(),
  loadCapacity: z.string(),
  specialCapabilities: z.array(z.string()),
  thumbnailImage: z.any().optional(),
  additionalImages: z.array(z.any()).optional(),
});

export const vehicleObjectSchema = z
  .object({
    id: z.string(),
    rcNumber: z.string().optional(),
    loadCapacity: z.string().optional(),
    specialCapabilities: z.array(z.string()).optional(),
    createdAt: z.string().optional(),
  })
  .passthrough();

export const paginatedApiResponseSchema = <T extends z.ZodTypeAny>(
  itemSchema: T,
) =>
  apiResponseSchema(
    z.object({
      data: z.array(itemSchema),
      paginationMeta: paginationMetaSchema,
    }),
  );

export type PromoterUser = z.infer<typeof promoterUserSchema>;
export type PromoterUsersListResponse = z.infer<
  typeof promoterUsersListResponseSchema
>;
export type CreatePromoterUserRequest = z.infer<
  typeof createPromoterUserRequestSchema
>;
export type UpdatePromoterUserRequest = z.infer<
  typeof updatePromoterUserRequestSchema
>;
export type ApiResponse<T = unknown> = { message: string; data: T };
export type VerifyPromoterUserOtpRequest = z.infer<
  typeof verifyPromoterUserOtpRequestSchema
>;
export type VerifyDrivingLicenseRequest = z.infer<
  typeof verifyDrivingLicenseRequestSchema
>;
export type VehicleCreateRequest = z.infer<typeof vehicleCreateRequestSchema>;
export type VehicleObject = z.infer<typeof vehicleObjectSchema>;
export type PaginatedApiResponse<T> = {
  message: string;
  data: {
    data: T[];
    paginationMeta: z.infer<typeof paginationMetaSchema>;
  };
};
