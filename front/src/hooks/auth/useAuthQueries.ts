import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getGuestToken } from "@/lib/api";
import { fetchCurrentUser, guestLogin, logout } from "@/lib/auth";
import type { AuthResponse } from "@/types";

export const authQueryKey = ["auth", "me"] as const;

const unauthenticatedResponse = {
  authenticated: false,
  user: null,
} satisfies AuthResponse;

export function useCurrentUserQuery() {
  const hasGuestToken = Boolean(getGuestToken());

  return useQuery({
    queryKey: authQueryKey,
    queryFn: fetchCurrentUser,
    enabled: hasGuestToken,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}

export function useGuestLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: guestLogin,
    onSuccess: (data) => {
      queryClient.setQueryData(authQueryKey, data);
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(authQueryKey, unauthenticatedResponse);
    },
  });
}
