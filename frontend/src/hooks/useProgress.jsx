import { useQuery } from "@tanstack/react-query";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

const useProgress = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["progress"],
    queryFn: async () => {
      const res = await api.get("/challenges/progress");
      return res.data;
    },
    enabled: !!user,
    staleTime: 30_000,
  });
};

export default useProgress;
