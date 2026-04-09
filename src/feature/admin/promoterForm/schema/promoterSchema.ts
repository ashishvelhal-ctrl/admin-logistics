import { z } from "zod";

export const userObjectSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    fullName: z.string().optional(),
    phoneNumber: z.string(),
    mobileNumber: z.string().optional(),
    roles: z.array(z.string()),
    address: z.string().optional(),
    assignedAddress: z.string().optional(),
    provideLogistics: z.boolean().optional(),
    profileStatus: z.string().optional(),
    is_verified: z.boolean().optional(),
    onboardingCount: z.number().optional(),
    drivingLicense: z.string().optional(),
    drivingLicenseData: z.unknown().optional(),
    deviceTokens: z.array(z.string()).optional(),
    createdAt: z.string(),
    created_at: z.string().optional(),
    updatedAt: z.string(),
  })
  .passthrough();

export const paginationMetaSchema = z.object({
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
  current_page: z.number(),
  total_pages: z.number(),
  has_next_page: z.boolean(),
  has_prev_page: z.boolean(),
});

export const promoterListResponseSchema = z.object({
  message: z.string(),
  data: z.array(userObjectSchema),
  paginationMeta: paginationMetaSchema,
});

export const promoterListParamsSchema = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
  search: z.string().optional(),
  role: z.string().optional(),
});

export const roleOptionSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  hierarchy: z.number(),
  isActive: z.boolean(),
});

export const rolesResponseSchema = z.object({
  roles: z.array(roleOptionSchema).optional(),
  data: z.array(roleOptionSchema).optional(),
});

export const promoterMutationPayloadSchema = z.object({
  name: z.string(),
  phoneNumber: z.string(),
  address: z.string().optional(),
});

export type UserObject = z.infer<typeof userObjectSchema>;
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
export type PromoterListResponse = z.infer<typeof promoterListResponseSchema>;
export type PromoterListParams = z.infer<typeof promoterListParamsSchema>;
export type RolesResponse = z.infer<typeof rolesResponseSchema>;
export type PromoterMutationPayload = z.infer<
  typeof promoterMutationPayloadSchema
>;
