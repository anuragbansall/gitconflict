import React from "react";
import ChallengeCard from "../components/ChallengeCard";

function Challenges() {
  const challenges = [
    {
      id: "leaked-secrets",
      title: "Leaked Secrets",
      description:
        "In this challenge, you will learn how to identify and mitigate leaked secrets in a Git repository. You will be provided with a sample repository that contains sensitive information, and your task is to find and remove these secrets.",
      difficulty: "Easy",
      xp: 100,
      estimatedTime: 5,
      tags: ["git", "security"],
    },
    {
      id: "git-branching",
      title: "Git Branching",
      description:
        "In this challenge, you will learn how to create and manage branches in Git. You will be provided with a sample repository and your task is to create new branches, switch between them, and merge changes.",
      difficulty: "Medium",
      xp: 200,
      estimatedTime: 10,
      tags: ["git", "branching"],
    },
    {
      id: "git-rebase",
      title: "Git Rebase",
      description:
        "In this challenge, you will learn how to rebase commits in Git. You will be provided with a sample repository and your task is to rebase branches and resolve conflicts.",
      difficulty: "Hard",
      xp: 300,
      estimatedTime: 15,
      tags: ["git", "rebase"],
    },
    {
      id: "leaked-secrets",
      title: "Leaked Secrets",
      description:
        "In this challenge, you will learn how to identify and mitigate leaked secrets in a Git repository. You will be provided with a sample repository that contains sensitive information, and your task is to find and remove these secrets.",
      difficulty: "Easy",
      xp: 100,
      estimatedTime: 5,
      tags: ["git", "security"],
    },
    {
      id: "git-branching",
      title: "Git Branching",
      description:
        "In this challenge, you will learn how to create and manage branches in Git. You will be provided with a sample repository and your task is to create new branches, switch between them, and merge changes.",
      difficulty: "Medium",
      xp: 200,
      estimatedTime: 10,
      tags: ["git", "branching"],
    },
    {
      id: "git-rebase",
      title: "Git Rebase",
      description:
        "In this challenge, you will learn how to rebase commits in Git. You will be provided with a sample repository and your task is to rebase branches and resolve conflicts.",
      difficulty: "Hard",
      xp: 300,
      estimatedTime: 15,
      tags: ["git", "rebase"],
    },
    {
      id: "leaked-secrets",
      title: "Leaked Secrets",
      description:
        "In this challenge, you will learn how to identify and mitigate leaked secrets in a Git repository. You will be provided with a sample repository that contains sensitive information, and your task is to find and remove these secrets.",
      difficulty: "Easy",
      xp: 100,
      estimatedTime: 5,
      tags: ["git", "security"],
    },
    {
      id: "git-branching",
      title: "Git Branching",
      description:
        "In this challenge, you will learn how to create and manage branches in Git. You will be provided with a sample repository and your task is to create new branches, switch between them, and merge changes.",
      difficulty: "Medium",
      xp: 200,
      estimatedTime: 10,
      tags: ["git", "branching"],
    },
    {
      id: "git-rebase",
      title: "Git Rebase",
      description:
        "In this challenge, you will learn how to rebase commits in Git. You will be provided with a sample repository and your task is to rebase branches and resolve conflicts.",
      difficulty: "Hard",
      xp: 300,
      estimatedTime: 15,
      tags: ["git", "rebase"],
    },
    {
      id: "leaked-secrets",
      title: "Leaked Secrets",
      description:
        "In this challenge, you will learn how to identify and mitigate leaked secrets in a Git repository. You will be provided with a sample repository that contains sensitive information, and your task is to find and remove these secrets.",
      difficulty: "Easy",
      xp: 100,
      estimatedTime: 5,
      tags: ["git", "security"],
    },
    {
      id: "git-branching",
      title: "Git Branching",
      description:
        "In this challenge, you will learn how to create and manage branches in Git. You will be provided with a sample repository and your task is to create new branches, switch between them, and merge changes.",
      difficulty: "Medium",
      xp: 200,
      estimatedTime: 10,
      tags: ["git", "branching"],
    },
    {
      id: "git-rebase",
      title: "Git Rebase",
      description:
        "In this challenge, you will learn how to rebase commits in Git. You will be provided with a sample repository and your task is to rebase branches and resolve conflicts.",
      difficulty: "Hard",
      xp: 300,
      estimatedTime: 15,
      tags: ["git", "rebase", "advanced"],
    },
  ];

  return (
    <main className="w-full max-w-300 mx-auto">
      <h1 className="text-3xl font-semibold text-zinc-800 mb-8">Challenges</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </main>
  );
}

export default Challenges;
