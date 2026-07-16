import { useMutation } from "@tanstack/react-query";
import { stopChallenge } from "../api/challenges";
import { errorToast, successToast } from "../utils/toast";

const useStopChallenge = () => {
  const mutation = useMutation({
    mutationFn: stopChallenge,
    onSuccess: (data) => {
      console.log("Challenge stopped successfully:", data);
      successToast("Challenge stopped successfully!");
    },
    onError: (error) => {
      console.error("Error stopping challenge:", error);
      errorToast("Error stopping challenge. Please try again.");
    },
  });

  return mutation;
};

export default useStopChallenge;
