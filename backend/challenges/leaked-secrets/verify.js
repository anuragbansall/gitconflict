export default async function verify(run) {
  const trackedFiles = await run("git ls-files");
  const gitignore = await run("cat .gitignore 2>/dev/null || true");
  const status = await run("git status --porcelain");

  const errors = [];

  if (trackedFiles.includes(".env")) {
    errors.push(".env is still being tracked by Git.");
  }

  if (!gitignore.includes(".env")) {
    errors.push(".env has not been added to .gitignore.");
  }

  if (status.trim() !== "") {
    errors.push("There are still uncommitted changes.");
  }

  return {
    success: errors.length === 0,
    errors,
  };
}
