import { useNavigate } from "@tanstack/react-router";
import { useAtom } from "jotai";
import type { DLVerificationData } from "../types/verification.types";
import { authAtom } from "@/atoms/authAtom";
import { ADMIN_ROLES } from "@/routes/guards/-requireRoles";

interface UserDetailsForDL {
  drivingLicense?: string;
  name?: string;
  dateOfBirth?: string;
  address?: string;
}

export function useViewDrivingLicense() {
  const navigate = useNavigate();
  const [authState] = useAtom(authAtom);

  const viewDrivingLicense = (
    userId: string,
    userDetails: UserDetailsForDL | null | undefined,
  ) => {
    const dlData: DLVerificationData = {
      message: "Driving license verified",
      data: {
        licenseNumber: userDetails?.drivingLicense || "N/A",
        name: userDetails?.name || "N/A",
        dob: userDetails?.dateOfBirth || "N/A",
        state: "N/A",
        dateOfIssue: "N/A",
        dateOfExpiry: "N/A",
        gender: "N/A",
        permanentAddress: userDetails?.address || "N/A",
        temporaryAddress: userDetails?.address || "N/A",
        fatherOrHusbandName: "N/A",
        citizenship: "N/A",
        olaName: "N/A",
        olaCode: "N/A",
        clientId: userId || "N/A",
        permanentZip: "N/A",
        cityName: "N/A",
        temporaryZip: "N/A",
        transportDateOfExpiry: "N/A",
        transportDateOfIssue: "N/A",
        bloodGroup: "N/A",
        vehicleClasses: [],
        additionalCheck: [],
        initialDateOfIssue: "N/A",
        currentStatus: null,
        vehicleClassDescription: [],
        status: "VERIFIED",
        verificationSource: "System",
      },
    };

    sessionStorage.setItem("dlVerificationData", JSON.stringify(dlData));

    // Check if user has admin role to navigate to admin route
    const hasAdminRole = authState.roles?.some((role: string) =>
      ADMIN_ROLES.includes(role as any),
    );

    if (hasAdminRole) {
      navigate({ to: "/verifyDrivingLicence" });
    } else {
      navigate({ to: "/verifyDrivingLicence" });
    }
  };

  return { viewDrivingLicense };
}
