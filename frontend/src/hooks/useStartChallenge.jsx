import { useMutation } from "@tanstack/react-query";
import { startChallenge } from "../api/challenges";
import { errorToast, successToast } from "../utils/toast";

const useStartChallenge = () => {
  const mutation = useMutation({
    mutationFn: startChallenge,
    onSuccess: (data) => {
      console.log("Challenge started successfully:", data);
      successToast("Challenge started successfully!");
    },
    onError: (error) => {
      console.error("Error starting challenge:", error);
      errorToast("Error starting challenge. Please try again.");
    },
  });

  return mutation;
};

export default useStartChallenge;
