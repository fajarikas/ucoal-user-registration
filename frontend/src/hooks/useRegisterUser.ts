import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerUser } from "../api/user";
import { RegisterPayload } from "../types/user";

export const useRegisterUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
