export default async function verify(run) {
  const status = (await run("git status --porcelain")).trim();
  const file = await run("cat app.js");
  const mergeHead = (
    await run("test -f .git/MERGE_HEAD && echo yes || echo no")
  ).trim();

  const errors = [];

  if (mergeHead === "yes") {
    errors.push("The merge has not been completed.");
  }

  if (
    file.includes("<<<<<<<") ||
    file.includes("=======") ||
    file.includes(">>>>>>>")
  ) {
    errors.push("Conflict markers are still present.");
  }

  if (!file.includes('console.log("User authenticated");')) {
    errors.push("Keep the updated authentication message.");
  }

  if (!file.includes('console.log("Login successful");')) {
    errors.push("Keep the success log.");
  }

  if (status !== "") {
    errors.push("The working tree should be clean.");
  }

  return {
    success: errors.length === 0,
    errors,
  };
}
