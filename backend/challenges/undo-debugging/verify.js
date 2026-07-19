export default async function verify(run) {
  const status = (await run("git status --porcelain")).trim();
  const file = await run("cat app.js");

  const errors = [];

  if (status !== "") {
    errors.push("The working tree is not clean.");
  }

  if (file.includes("DEBUG MODE ENABLED")) {
    errors.push("Debugging code is still present.");
  }

  if (file.includes("TOKEN:")) {
    errors.push("Sensitive debugging output is still present.");
  }

  const commitCount = (await run("git rev-list --count HEAD")).trim();

  if (commitCount !== "1") {
    errors.push("Do not create a new commit.");
  }

  return {
    success: errors.length === 0,
    errors,
  };
}
