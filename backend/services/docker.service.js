import { runCommand } from "../utils/runCommand.js";

export const createContainer = async (
  containerName,
  imageName = "git-sandbox",
) => {
  const command = `docker run -d --name ${containerName} ${imageName}`;

  try {
    const containerId = await runCommand(command);
    return containerId.trim();
  } catch (error) {
    throw new Error(`Failed to create container: ${error.message}`);
  }
};

export const copyFileToContainer = async (
  containerName,
  localFilePath,
  containerFilePath = "/workspace",
) => {
  const command = `docker cp ${localFilePath} ${containerName}:${containerFilePath}`;

  try {
    await runCommand(command);
  } catch (error) {
    throw new Error(`Failed to copy file to container: ${error.message}`);
  }
};

export const executeCommandInContainer = async (
  containerName,
  commandToExecute,
) => {
  const command = `docker exec -w /workspace/repo ${containerName} sh -c "${commandToExecute}"`;

  try {
    const output = await runCommand(command);
    return output.trim();
  } catch (error) {
    throw new Error(`Failed to execute command in container: ${error.message}`);
  }
};

export const removeContainer = async (containerName) => {
  const command = `docker rm -f ${containerName}`;

  try {
    await runCommand(command);
  } catch (error) {
    throw new Error(`Failed to remove container: ${error.message}`);
  }
};
