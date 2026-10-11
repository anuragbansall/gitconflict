import { useQuery } from "@tanstack/react-query";
import api from "../api/api";

const useUserProfile = (username) =>
  useQuery({
    queryKey: ["profile", username],
    queryFn: async () => {
      const res = await api.get(`/users/${username}`);
      return res.data;
    },
    enabled: !!username,
    staleTime: 60_000,
  });

export default useUserProfile;
