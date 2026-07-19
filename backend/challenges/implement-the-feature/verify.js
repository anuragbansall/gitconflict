export default async function verify(run) {
  const branch = (await run("git branch --show-current")).trim();
  const status = (await run("git status --porcelain")).trim();
  const commitCount = parseInt(
    (await run("git rev-list --count HEAD")).trim(),
    10,
  );
  const file = await run("cat app.js");

  const errors = [];

  if (branch !== "feature/user-profile") {
    errors.push(
      "The commit must be made on the 'feature/user-profile' branch.",
    );
  }

  if (!file.includes("User Profile Feature")) {
    errors.push("The feature implementation is missing.");
  }

  if (commitCount !== 2) {
    errors.push("Create exactly one new commit.");
  }

  if (status !== "") {
    errors.push("The working tree is not clean.");
  }

  return {
    success: errors.length === 0,
    errors,
  };
}
