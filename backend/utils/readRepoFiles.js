import { mkdtemp, readFile, readdir, rm } from "fs/promises";
import os from "os";
import { join, relative } from "path";
import { runCommand } from "./runCommand.js";

async function readLocalRepoFiles(dir, baseDir = dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await readRepoFiles(fullPath, baseDir)));
    } else {
      files.push({
        fileName: relative(baseDir, fullPath), // e.g. "src/index.js"
        content: await readFile(fullPath, "utf-8"),
      });
    }
  }

  return files;
}

async function readContainerRepoFiles(containerName, containerRepoPath) {
  const tempDir = await mkdtemp(join(os.tmpdir(), "repo-"));
  const tempRepoPath = join(tempDir, "repo");

  try {
    await runCommand(
      `docker cp "${containerName}:${containerRepoPath}" "${tempRepoPath}"`,
    );

    return await readLocalRepoFiles(tempRepoPath, tempRepoPath);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

export async function readRepoFiles(source, baseDir = source) {
  if (typeof source === "object" && source !== null) {
    const { containerName, containerRepoPath = "/workspace/repo" } = source;

    if (!containerName) {
      throw new Error("containerName is required to read a container repo");
    }

    return readContainerRepoFiles(containerName, containerRepoPath);
  }

  return readLocalRepoFiles(source, baseDir);
}
