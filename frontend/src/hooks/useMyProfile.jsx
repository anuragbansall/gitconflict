import { useQuery } from "@tanstack/react-query";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

const useMyProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => {
      const res = await api.get("/users/me");
      return res.data;
    },
    enabled: !!user,
    staleTime: 60_000,
  });
};

export default useMyProfile;
