import React from "react";
import ChallengeCard from "../components/ChallengeCard";
import useChallenges from "../hooks/useChallenges";
import useProgress from "../hooks/useProgress";
import Loading from "../components/Loading";
import Error from "../components/Error";
import { useAuth } from "../context/AuthContext";

function Challenges() {
  const { data: challenges = [], isLoading, isError, error } = useChallenges();
  const { user } = useAuth();
  const { data: progress = [] } = useProgress();

  const completedIds = new Set(progress.map((p) => p.challenge_id));

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error error={error} />;
  }

  return (
    <main className="w-full max-w-300 mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold text-zinc-800">Challenges</h1>
        {user && (
          <span className="text-sm text-zinc-500">
            {completedIds.size} / {challenges.length} completed
          </span>
        )}
      </div>

      {challenges.length === 0 ? (
        <div className="text-lg font-medium text-zinc-600 flex items-center justify-center h-full">
          No challenges available.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              completed={completedIds.has(challenge.id)}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default Challenges;
