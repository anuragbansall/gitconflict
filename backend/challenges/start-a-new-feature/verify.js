export default async function verify(run) {
  const branch = (await run("git branch --show-current")).trim();
  const commitCount = (await run("git rev-list --count HEAD")).trim();
  const status = (await run("git status --porcelain")).trim();

  const errors = [];

  if (branch !== "feature/user-profile") {
    errors.push("You are not on the 'feature/user-profile' branch.");
  }

  if (commitCount !== "1") {
    errors.push("Do not create any new commits.");
  }

  if (status !== "") {
    errors.push("The working tree should be clean.");
  }

  return {
    success: errors.length === 0,
    errors,
  };
}
