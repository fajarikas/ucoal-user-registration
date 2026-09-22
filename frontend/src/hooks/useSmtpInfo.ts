import { useQuery } from "@tanstack/react-query";
import { getSmtpInfo } from "../api/user";

export const useSmtpInfo = () => {
  return useQuery({
    queryKey: ["smtp-info"],
    queryFn: getSmtpInfo,
    staleTime: 5 * 60 * 1000, // 5 minutes fresh
  });
};
