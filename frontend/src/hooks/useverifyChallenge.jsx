import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyChallenge } from "../api/challenges";
import { errorToast } from "../utils/toast";

const useVerifyChallenge = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: verifyChallenge,
    onSuccess: (data) => {
      console.log("Challenge verified successfully:", data);
      if (data.success) {
        void queryClient.invalidateQueries({ queryKey: ["progress"] });
      }
    },
    onError: (error) => {
      console.error("Error verifying challenge:", error);
      errorToast("Error verifying challenge. Please try again.");
    },
  });

  return mutation;
};

export default useVerifyChallenge;
