import { z } from "zod";

const indianPhoneRegex = /[6789]\d{9}$/;

export const createPromoterUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters"),
  phoneNumber: z
    .string()
    .trim()
    .regex(
      indianPhoneRegex,
      "Phone number must be a valid 10-digit Indian mobile number",
    ),
  address: z
    .string()
    .trim()
    .min(5, "Address is required")
    .max(500, "Address cannot exceed 500 characters"),
});

export type CreatePromoterUserInput = z.infer<typeof createPromoterUserSchema>;

export const updatePromoterUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(100, "Name cannot exceed 100 characters")
      .optional(),
    address: z
      .string()
      .trim()
      .min(5, "Address is required")
      .max(500, "Address cannot exceed 500 characters")
      .optional(),
  })
  .refine((data) => data.name !== undefined || data.address !== undefined, {
    message: "At least one of name or address must be provided",
  });

export type UpdatePromoterUserInput = z.infer<typeof updatePromoterUserSchema>;

export const getPromoterUsersQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).optional().default(10),
  offset: z.coerce.number().min(0).optional().default(0),
  search: z.string().optional(),
});

export type GetPromoterUsersQuery = z.infer<typeof getPromoterUsersQuerySchema>;
