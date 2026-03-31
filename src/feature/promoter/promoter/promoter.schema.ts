import z from 'zod';

const indianPhoneRegex = /[6789]\d{9}$/;

const paginatedListQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).optional().default(10),
  offset: z.coerce.number().min(0).optional().default(0),
});

const createIdParamSchema = (label: string) =>
  z.object({
    params: z.object({
      id: z.string().min(1, `${label} ID is required`),
    }),
  });

export const getPromoterUsersReqSchema = z.object({
  query: paginatedListQuerySchema.extend({
    search: z.string().optional(),
  }),
});
export type GetPromoterUsersReq = z.infer<typeof getPromoterUsersReqSchema>;

export const promoterOwnedUserIdParamSchema = createIdParamSchema('User');
export type PromoterOwnedUserIdParamReq = z.infer<
  typeof promoterOwnedUserIdParamSchema
>;

export const createPromoterUserReqSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(1, 'Name is required')
        .max(100, 'Name cannot exceed 100 characters'),
      phoneNumber: z
        .string()
        .trim()
        .regex(
          indianPhoneRegex,
          'Phone number must be a valid 10-digit Indian mobile number'
        ),
      address: z
        .string()
        .trim()
        .min(5, 'Address is required')
        .max(500, 'Address cannot exceed 500 characters'),
    })
    .strict(),
});
export type CreatePromoterUserReq = z.infer<typeof createPromoterUserReqSchema>;

export const updatePromoterUserReqSchema = z.object({
  params: promoterOwnedUserIdParamSchema.shape.params,
  body: createPromoterUserReqSchema.shape.body
    .pick({ name: true, address: true })
    .partial()
    .strict()
    .refine(data => data.name !== undefined || data.address !== undefined, {
      message: 'At least one of name or address must be provided',
    }),
});
export type UpdatePromoterUserReq = z.infer<typeof updatePromoterUserReqSchema>;
