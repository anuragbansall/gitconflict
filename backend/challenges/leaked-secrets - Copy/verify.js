export default async function verify(run) {
  const trackedFiles = await run("git ls-files");

  const gitignore = await run("cat .gitignore 2>/dev/null || true");

  const errors = [];

  if (trackedFiles.includes(".env")) {
    errors.push(".env is still tracked by Git.");
  }

  if (!gitignore.includes(".env")) {
    errors.push(".env is missing from .gitignore.");
  }

  return {
    success: errors.length === 0,
    errors,
  };
}
