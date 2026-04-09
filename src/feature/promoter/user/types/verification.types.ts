import { z } from "zod";

export const pendingUserDataSchema = z.object({
  name: z.string(),
  phoneNumber: z.string(),
  address: z.string(),
  provideLogistics: z.boolean(),
});

export const existingUserDataSchema = z.object({
  phoneNumber: z.string(),
  name: z.string().optional(),
});

export const dlVerificationPayloadSchema = z.object({
  licenseNumber: z.string(),
  name: z.string(),
  dob: z.string(),
  state: z.string(),
  dateOfIssue: z.string(),
  dateOfExpiry: z.string(),
  gender: z.string(),
  permanentAddress: z.string(),
  temporaryAddress: z.string(),
  fatherOrHusbandName: z.string(),
  citizenship: z.string(),
  olaName: z.string(),
  olaCode: z.string(),
  clientId: z.string(),
  permanentZip: z.string(),
  cityName: z.string().nullable(),
  temporaryZip: z.string(),
  transportDateOfExpiry: z.string(),
  transportDateOfIssue: z.string(),
  bloodGroup: z.string(),
  vehicleClasses: z.array(z.string()),
  additionalCheck: z.array(z.unknown()),
  initialDateOfIssue: z.string(),
  currentStatus: z.unknown(),
  vehicleClassDescription: z.array(z.unknown()),
  status: z.string(),
  verificationSource: z.string(),
});

export const dlVerificationDataSchema = z.object({
  message: z.string(),
  data: dlVerificationPayloadSchema,
});

export const vehicleVerificationPayloadSchema = z.object({
  vehicleNumber: z.string(),
  registrationDate: z.string(),
  registerDate: z.string(),
  owner: z.string(),
  model: z.string(),
  vehicleType: z.string(),
  fuelType: z.string(),
  manufacturer: z.string(),
  bodyType: z.string(),
  engineNumber: z.string(),
  chassisNumber: z.string(),
  fitnessValidTill: z.string(),
  insuranceValidTill: z.string(),
  registrationCertificateNumber: z.string(),
  registrationUpto: z.string(),
  taxValidUpto: z.string(),
  pollutionValidUpto: z.string(),
  manufacturerModel: z.string(),
  manufacturerSlNo: z.string(),
  blackListStatus: z.string(),
  insuranceCompany: z.string(),
  insurancePolicyNumber: z.string(),
  pucNumber: z.string(),
  pucValidUpto: z.string(),
  pucIssuedDate: z.string(),
  status: z.string(),
  verificationSource: z.string(),
});

export const vehicleVerificationDataSchema = z.object({
  message: z.string(),
  data: vehicleVerificationPayloadSchema,
});

export type PendingUserData = z.infer<typeof pendingUserDataSchema>;
export type ExistingUserData = z.infer<typeof existingUserDataSchema>;
export type DLVerificationData = z.infer<typeof dlVerificationDataSchema>;
export type VehicleVerificationData = z.infer<
  typeof vehicleVerificationDataSchema
>;
