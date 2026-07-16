import { useQuery } from "@tanstack/react-query";
import { getChallengeById } from "../api/challenges";

const useChallengeById = (id) => {
  const challengeByIdQuery = useQuery({
    queryKey: ["challenge", id],
    queryFn: () => getChallengeById(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
  });

  return challengeByIdQuery;
};

export default useChallengeById;
