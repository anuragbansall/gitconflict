import { FiClock, FiGitBranch } from "react-icons/fi";
import { FaPlay, FaStar, FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router";

function ChallengeCard({ challenge, completed = false }) {
  const difficultyColors = {
    EASY: "bg-green-100 text-green-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    HARD: "bg-red-100 text-red-700",
  };

  return (
    <div className={`group flex flex-col justify-between rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
      completed
        ? "border-green-300 bg-green-50 hover:border-green-400"
        : "border-zinc-200 bg-white hover:border-blue-200"
    }`}>
      {/* Top */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              difficultyColors[challenge.difficulty]
            }`}
          >
            {challenge.difficulty}
          </span>

          <div className="flex items-center gap-2">
            {completed && (
              <span className="flex items-center gap-1 text-green-600 text-xs font-semibold bg-green-100 px-2 py-1 rounded-full">
                <FaCheckCircle size={11} /> Done
              </span>
            )}
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <FaStar size={14} />
              {challenge.xp} XP
            </div>
          </div>
        </div>

        <h2 className="mb-2 text-xl font-bold text-zinc-800">
          {challenge.title}
        </h2>

        <p className="line-clamp-3 text-sm leading-6 text-zinc-600">
          {challenge.description}
        </p>
      </div>

      {/* Bottom */}
      <div className="mt-6">
        <div className="mb-4 flex items-center justify-between text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <FiClock />
            {challenge.estimatedTime} min
          </div>

          <div className="flex items-center gap-2">
            <FiGitBranch />
            {challenge.tags.length} Tags
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {challenge.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700"
            >
              #{tag}
            </span>
          ))}
        </div>

        <Link
          to={`/challenges/${challenge.id}`}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-100 py-3 font-semibold text-zinc-700 transition hover:bg-blue-600 hover:text-white group-hover:translate-y-0.5"
        >
          <FaPlay className="transition group-hover:-translate-x-1" />
          Start Challenge
        </Link>
      </div>
    </div>
  );
}

export default ChallengeCard;
