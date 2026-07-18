export default async function verify(run) {
  const log = await run("git log --pretty=%s");

  const commitMessages = log.trim().split("\n").filter(Boolean);

  const latestMessage = commitMessages[0];

  const errors = [];

  // Still using the original message
  if (latestMessage === "asdf") {
    errors.push("The latest commit message is still 'asdf'.");
  }

  // Empty commit message
  if (!latestMessage.trim()) {
    errors.push("Commit message cannot be empty.");
  }

  // Ensure only one commit exists
  if (commitMessages.length !== 1) {
    errors.push(
      "Do not create a new commit. Amend the existing commit instead.",
    );
  }

  return {
    success: errors.length === 0,
    errors,
  };
}
