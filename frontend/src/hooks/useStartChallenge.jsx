import { useMutation } from "@tanstack/react-query";
import { startChallenge } from "../api/challenges";
import { errorToast } from "../utils/toast";

const useStartChallenge = () => {
  const mutation = useMutation({
    mutationFn: startChallenge,
    onSuccess: (data) => {
      console.log("Challenge started successfully:", data);
    },
    onError: (error) => {
      console.error("Error starting challenge:", error);
      errorToast("Error starting challenge. Please try again.");
    },
  });

  return mutation;
};

export default useStartChallenge;
