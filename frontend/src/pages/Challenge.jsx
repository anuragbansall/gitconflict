import React, { useEffect, useRef, useState } from "react";
import {
  FiClock,
  FiTag,
  FiTarget,
  FiCheckCircle,
  FiAward,
} from "react-icons/fi";
import { FaPlay, FaStar } from "react-icons/fa";
import CodeEditor from "../components/CodeEditor";
import { useParams } from "react-router";
import useChallengeById from "../hooks/useChallengeById";
import Loading from "../components/Loading";
import useStartChallenge from "../hooks/useStartChallenge";
import Button from "../components/Button";
import useStopChallenge from "../hooks/useStopChallenge";
import Error from "../components/Error";
import useVerifyChallenge from "../hooks/useverifyChallenge";
import ChallengePopup from "../components/ChallengePopup";
import { CiLock } from "react-icons/ci";

function Challenge() {
  const { id } = useParams();

  const sessionIdRef = useRef(null);
  const stopRequestedRef = useRef(false);

  const [showPopup, setShowPopup] = useState(false);

  const {
    data: challenge = {},
    isLoading,
    isError,
    error,
  } = useChallengeById(id);
  const startChallengeMutation = useStartChallenge();
  const stopChallengeMutation = useStopChallenge();
  const verifyChallengeMutation = useVerifyChallenge();

  const handleVerifyChallenge = () => {
    const sessionId = sessionIdRef.current;
    if (!sessionId) {
      console.error("No sessionId available for verification.");
      return;
    }

    verifyChallengeMutation.mutate(sessionId, {
      onSuccess: (data) => {
        console.log("Challenge verified successfully:", data);
        setShowPopup(true);
      },
    });
  };

  // Keep the latest sessionId
  useEffect(() => {
    if (startChallengeMutation.data?.sessionId) {
      sessionIdRef.current = startChallengeMutation.data.sessionId;
      stopRequestedRef.current = false;
    }
  }, [startChallengeMutation.data]);

  const requestStopSession = (sessionId) => {
    if (!sessionId || stopRequestedRef.current) return;

    stopRequestedRef.current = true;
    stopChallengeMutation.mutate(sessionId);
  };

  const sendStopRequestOnExit = () => {
    const sessionId = sessionIdRef.current;

    if (!sessionId || stopRequestedRef.current) return;

    stopRequestedRef.current = true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    if (backendUrl) {
      fetch(`${backendUrl}/challenges/stop/${sessionId}`, {
        method: "DELETE",
        credentials: "include",
        keepalive: true,
        headers: {
          "Content-Type": "application/json",
        },
      }).catch(() => {});
    }
  };

  // Start the challenge when the component mounts and the challenge data is available
  useEffect(() => {
    if (challenge?.id) {
      startChallengeMutation.mutate(challenge.id);
    }
  }, [challenge?.id]);

  // Stop the challenge when the component unmounts
  useEffect(() => {
    return () => {
      requestStopSession(sessionIdRef.current);
    };
  }, []);

  // Handle page unload to stop the challenge
  useEffect(() => {
    const handleExit = () => {
      sendStopRequestOnExit();
    };

    window.addEventListener("pagehide", handleExit);
    window.addEventListener("beforeunload", handleExit);

    return () => {
      window.removeEventListener("pagehide", handleExit);
      window.removeEventListener("beforeunload", handleExit);
    };
  }, []);

  const difficultyStyles = {
    Easy: "bg-green-100 text-green-700 border-green-200",
    Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Hard: "bg-red-100 text-red-700 border-red-200",
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error error={error} />;
  }

  return (
    <main className="relative grid min-h-screen w-full gap-4 overflow-hidden bg-zinc-100 p-3 sm:p grid-cols-1 grid-rows lg:h-screen lg:grid-cols-2 lg:grid-rows-2">
      {showPopup && (
        <ChallengePopup
          success={verifyChallengeMutation?.data?.success}
          errors={verifyChallengeMutation?.data?.errors || []}
          onClose={() => setShowPopup(false)}
        />
      )}
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
      {startChallengeMutation.isPending ? (
        <Loading message="Setting up editor..." />
      ) : (
        <section
          id="challenge-editor"
          className=" min-h-75 rounded-xl border border-zinc-300 bg-white p-5 lg:min-h-0 flex flex-col"
        >
          <div className="w-full flex">
            <Button
              className="ml-auto"
              onClick={handleVerifyChallenge}
              disabled={verifyChallengeMutation.isPending}
            >
              <FaPlay /> Submit Solution
            </Button>
          </div>

          <div className="mt-5 h-full w-full bg-zinc-100 flex justify-center items-center flex-col gap-3 rounded-lg border border-zinc-300">
            <div className="text-zinc-400 text-5xl font-bold">
              <CiLock />
            </div>
            <h2 className="text-zinc-500 text-lg font-semibold">
              This feature is under development. The code editor will be
              available soon.
            </h2>
          </div>
        </section>
      )}

      {/* ================= TERMINAL ================= */}
      {startChallengeMutation.isPending ? (
        <Loading message="Setting up terminal..." />
      ) : (
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
          <CodeEditor sessionId={startChallengeMutation.data?.sessionId} />
        </section>
      )}
    </main>
  );
}

export default Challenge;
