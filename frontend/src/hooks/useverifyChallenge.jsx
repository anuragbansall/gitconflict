import { useMutation } from "@tanstack/react-query";
import { verifyChallenge } from "../api/challenges";
import { errorToast, successToast } from "../utils/toast";

const useVerifyChallenge = () => {
  const mutation = useMutation({
    mutationFn: verifyChallenge,
    onSuccess: (data) => {
      console.log("Challenge verified successfully:", data);
      successToast("Challenge verified successfully!");
    },
    onError: (error) => {
      console.error("Error verifying challenge:", error);
      errorToast("Error verifying challenge. Please try again.");
    },
  });

  return mutation;
};

export default useVerifyChallenge;
