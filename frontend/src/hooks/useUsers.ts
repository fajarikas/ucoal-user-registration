import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api/user";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    staleTime: 60 * 1000,
  });
};
