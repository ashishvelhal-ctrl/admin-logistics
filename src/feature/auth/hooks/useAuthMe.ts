import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai/react";

import { tokenAtom } from "../state/token";

import type { AuthMeRes } from "../schema/me";

import { apiClient } from "@/lib/api";
import { defaultQueryOptions, handleApiCall } from "@/lib/api-utils";

const fetchUserProfile = async () => {
  return handleApiCall(async () => {
    const res = await apiClient.get("/auth/me");
    return res.data as AuthMeRes;
  }, "fetchUserProfile");
};

export const useAuthMe = () => {
  const token = useAtomValue(tokenAtom);

  return useQuery({
    queryKey: ["auth", "me", token],
    queryFn: fetchUserProfile,
    enabled: !!token,
    ...defaultQueryOptions,
  });
};
