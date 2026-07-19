export default async function verify(run) {
  const branch = (await run("git branch --show-current")).trim();
  const status = (await run("git status --porcelain")).trim();
  const file = await run("cat app.js");
  const merged = (await run("git branch --merged"))
    .trim()
    .split("\n")
    .map((b) => b.replace("*", "").trim());

  const commitCount = parseInt(
    (await run("git rev-list --count HEAD")).trim(),
    10,
  );

  const errors = [];

  if (branch !== "main") {
    errors.push("You must finish on the 'main' branch.");
  }

  if (!merged.includes("feature/user-profile")) {
    errors.push("The feature branch has not been merged into main.");
  }

  if (!file.includes("User Profile Feature")) {
    errors.push("The feature changes are missing from main.");
  }

  if (status !== "") {
    errors.push("The working tree is not clean.");
  }

  if (commitCount !== 2) {
    errors.push("The merge was not completed correctly.");
  }

  return {
    success: errors.length === 0,
    errors,
  };
}
