import { useMutation, useQueryClient } from "@tanstack/react-query";
import { executeCommand } from "../api/challenges";
import { errorToast, successToast } from "../utils/toast";

const useExecuteCommand = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: executeCommand,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["challenge", variables.challengeId],
      });
    },
    onError: (error) => {
      console.error(error);
      errorToast("Error executing command. Please try again.");
    },
  });

  return mutation;
};

export default useExecuteCommand;
