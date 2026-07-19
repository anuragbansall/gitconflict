export default async function verify(run) {
  const branch = (await run("git branch --show-current")).trim();
  const status = (await run("git status --porcelain")).trim();
  const mergeHead = (
    await run("test -f .git/MERGE_HEAD && echo yes || echo no")
  ).trim();
  const file = await run("cat app.js");

  const errors = [];

  if (branch !== "main") {
    errors.push("You should finish on the main branch.");
  }

  if (mergeHead === "yes") {
    errors.push("The merge is still in progress.");
  }

  if (status !== "") {
    errors.push("The working tree should be clean.");
  }

  if (!file.includes('console.log("User authenticated");')) {
    errors.push("The repository was not restored to its pre-merge state.");
  }

  if (file.includes('console.log("Login successful");')) {
    errors.push("Changes from the feature branch are still present.");
  }

  return {
    success: errors.length === 0,
    errors,
  };
}
