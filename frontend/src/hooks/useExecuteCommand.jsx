import { useMutation } from "@tanstack/react-query";
import { executeCommand } from "../api/challenges";
import { errorToast, successToast } from "../utils/toast";

const useExecuteCommand = () => {
  const mutation = useMutation({
    mutationFn: executeCommand,
    onSuccess: (data) => {
      console.log("Command executed successfully:", data);
      successToast("Command executed successfully!");
    },
    onError: (error) => {
      console.error("Error executing command:", error);
      errorToast("Error executing command. Please try again.");
    },
  });

  return mutation;
};

export default useExecuteCommand;
