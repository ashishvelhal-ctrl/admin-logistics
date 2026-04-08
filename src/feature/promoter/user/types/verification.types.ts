export interface PendingUserData {
  name: string;
  phoneNumber: string;
  address: string;
  provideLogistics: boolean;
}

export interface ExistingUserData {
  phoneNumber: string;
  name?: string;
}

export interface DLVerificationData {
  message: string;
  data: {
    licenseNumber: string;
    name: string;
    dob: string;
    state: string;
    dateOfIssue: string;
    dateOfExpiry: string;
    gender: string;
    permanentAddress: string;
    temporaryAddress: string;
    fatherOrHusbandName: string;
    citizenship: string;
    olaName: string;
    olaCode: string;
    clientId: string;
    permanentZip: string;
    cityName: string | null;
    temporaryZip: string;
    transportDateOfExpiry: string;
    transportDateOfIssue: string;
    bloodGroup: string;
    vehicleClasses: string[];
    additionalCheck: any[];
    initialDateOfIssue: string;
    currentStatus: any;
    vehicleClassDescription: any[];
    status: string;
    verificationSource: string;
  };
}

export interface VehicleVerificationData {
  message: string;
  data: {
    vehicleNumber: string;
    registrationDate: string;
    registerDate: string;
    owner: string;
    model: string;
    vehicleType: string;
    fuelType: string;
    manufacturer: string;
    bodyType: string;
    engineNumber: string;
    chassisNumber: string;
    fitnessValidTill: string;
    insuranceValidTill: string;
    registrationCertificateNumber: string;
    registrationUpto: string;
    taxValidUpto: string;
    pollutionValidUpto: string;
    manufacturerModel: string;
    manufacturerSlNo: string;
    blackListStatus: string;
    insuranceCompany: string;
    insurancePolicyNumber: string;
    pucNumber: string;
    pucValidUpto: string;
    pucIssuedDate: string;
    status: string;
    verificationSource: string;
  };
}
