import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export const createSandbox = async () => {
  const sandboxDir = await mkdtemp(join(tmpdir(), "gitchallenge-"));
  // Provide a git user config so commits don't fail with "user.email not set"
  await writeFile(
    join(sandboxDir, ".gitconfig"),
    "[user]\n\tname = Git Challenge User\n\temail = user@gitchallenge.dev\n[safe]\n\tdirectory = *\n",
  );
  return sandboxDir;
};

export const executeCommandInSandbox = async (sandboxDir, command) => {
  const repoDir = join(sandboxDir, "repo");
  try {
    const { stdout, stderr } = await execAsync(command, {
      cwd: repoDir,
      timeout: 10000,
      env: {
        ...process.env,
        HOME: sandboxDir,
        GIT_AUTHOR_NAME: "Git Challenge User",
        GIT_AUTHOR_EMAIL: "user@gitchallenge.dev",
        GIT_COMMITTER_NAME: "Git Challenge User",
        GIT_COMMITTER_EMAIL: "user@gitchallenge.dev",
      },
    });
    return (stdout + stderr).trim();
  } catch (err) {
    // Return output even on non-zero exit — git uses exit code 1 for normal states
    if (err.stdout !== undefined || err.stderr !== undefined) {
      return ((err.stdout ?? "") + (err.stderr ?? "")).trim();
    }
    throw new Error(`Command failed: ${err.message}`);
  }
};

export const removeSandbox = async (sandboxDir) => {
  await rm(sandboxDir, { recursive: true, force: true });
};
