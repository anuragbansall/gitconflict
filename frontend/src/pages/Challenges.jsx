import React from "react";
import ChallengeCard from "../components/ChallengeCard";
import useChallenges from "../hooks/useChallenges";
import Loading from "../components/Loading";

function Challenges() {
  const { data: challenges = [], isLoading, isError, error } = useChallenges();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error error={error} />;
  }

  return (
    <main className="w-full max-w-300 mx-auto px-4">
      <h1 className="text-3xl font-semibold text-zinc-800 mb-8">Challenges</h1>

      {challenges.length === 0 ? (
        <div className="text-lg font-medium text-zinc-600 flex items-center justify-center h-full">
          No challenges available.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      )}
    </main>
  );
}

export default Challenges;
