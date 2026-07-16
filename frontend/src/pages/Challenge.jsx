import React, { useState } from "react";
import {
  FiClock,
  FiTag,
  FiTarget,
  FiCheckCircle,
  FiAward,
} from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import CodeEditor from "../components/CodeEditor";

function Challenge() {
  const [challenge] = useState({
    id: "leaked-secrets",
    title: "Leaked Secrets",
    description:
      "In this challenge, you will learn how to identify and mitigate leaked secrets in a Git repository. You will be provided with a sample repository that contains sensitive information, and your task is to find and remove these secrets.",
    difficulty: "Easy",
    xp: 100,
    estimatedTime: 5,
    tags: ["git", "security"],
  });

  const difficultyStyles = {
    Easy: "bg-green-100 text-green-700 border-green-200",
    Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Hard: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <main
      className="
        grid
        min-h-screen
        w-full
        gap-4
        overflow-hidden
        bg-zinc-100
        p-3
        sm:p-4

        grid-cols-1
        grid-rows-none

        lg:h-screen
        lg:grid-cols-2
        lg:grid-rows-[3fr_1fr]
      "
    >
      {/* ================= LEFT PANEL ================= */}
      <section
        id="challenge-info"
        className="
          min-h-0
          overflow-y-auto
          rounded-xl
          border
          border-zinc-300
          bg-white
          shadow

          lg:row-span-2
        "
      >
        {/* Header */}
        <div className="border-b border-zinc-200 p-5 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
                {challenge.title}
              </h1>

              <p className="mt-4 text-sm leading-7 text-zinc-600 sm:text-base">
                {challenge.description}
              </p>
            </div>

            <span
              className={`
                w-fit
                rounded-full
                border
                px-4
                py-2
                text-sm
                font-semibold
                ${difficultyStyles[challenge.difficulty]}
              `}
            >
              {challenge.difficulty}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-8">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <FaStar className="text-yellow-500" />
              XP Reward
            </div>

            <p className="mt-3 text-3xl font-bold text-zinc-900">
              {challenge.xp}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <FiClock />
              Estimated Time
            </div>

            <p className="mt-3 text-3xl font-bold text-zinc-900">
              {challenge.estimatedTime} min
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="px-5 sm:px-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-800">
            <FiTag />
            Technologies
          </h2>

          <div className="flex flex-wrap gap-3">
            {challenge.tags.map((tag) => (
              <span
                key={tag}
                className="
                  rounded-full
                  bg-blue-50
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-blue-700
                "
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Learning */}
        <div className="mt-10 px-5 sm:px-8">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-zinc-800">
            <FiTarget />
            What You'll Learn
          </h2>

          <div className="space-y-4">
            {[
              "Identify leaked secrets inside a Git repository.",
              "Understand why exposed credentials are a security risk.",
              "Remove sensitive data from Git history.",
              "Apply Git security best practices.",
            ].map((item) => (
              <div
                key={item}
                className="
                  flex
                  gap-3
                  rounded-lg
                  border
                  border-zinc-200
                  p-4
                "
              >
                <FiCheckCircle
                  className="mt-1 shrink-0 text-green-600"
                  size={18}
                />

                <p className="text-sm text-zinc-600 sm:text-base">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Reward */}
        <div
          className="
            m-5
            mt-10
            rounded-xl
            border
            border-indigo-200
            bg-indigo-50
            p-5

            sm:m-8
          "
        >
          <div className="flex gap-3">
            <FiAward className="shrink-0 text-indigo-600" size={24} />

            <div>
              <h3 className="font-semibold text-indigo-900">
                Challenge Reward
              </h3>

              <p className="mt-1 text-sm text-indigo-700">
                Complete this challenge to earn{" "}
                <span className="font-bold">{challenge.xp} XP</span> and improve
                your Git security skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= EDITOR ================= */}
      <section
        id="challenge-editor"
        className="
          min-h-75
          rounded-xl
          border
          border-zinc-300
          bg-white
          p-5
          shadow

          lg:min-h-0
        "
      >
        <h2 className="text-xl font-semibold">Editor</h2>
      </section>

      {/* ================= TERMINAL ================= */}
      <section
        id="terminal"
        className="
          overflow-hidden
          rounded-xl
          border
          border-zinc-300
          shadow

          lg:min-h-0
        "
      >
        <CodeEditor />
      </section>
    </main>
  );
}

export default Challenge;
