export default async function verify(run) {
  const branches = await run("git branch");
  const branch = (await run("git branch --show-current")).trim();
  const status = (await run("git status --porcelain")).trim();

  const errors = [];

  if (branches.includes("feature/user-profile")) {
    errors.push("The feature branch still exists.");
  }

  if (branch !== "main") {
    errors.push("You should finish on the main branch.");
  }

  if (status !== "") {
    errors.push("The working tree should be clean.");
  }

  return {
    success: errors.length === 0,
    errors,
  };
}
