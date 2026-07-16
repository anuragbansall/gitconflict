import { useQuery } from "@tanstack/react-query";
import { getChallenges } from "../api/challenges";

const useChallenges = () => {
  const challngesQuery = useQuery({
    queryKey: ["challenges"],
    queryFn: getChallenges,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
  });

  return challngesQuery;
};

export default useChallenges;
