import React, { useState } from "react";
import { useParams, Link } from "react-router";
import { FiAward, FiCheckCircle, FiEdit2 } from "react-icons/fi";
import useUserProfile from "../hooks/useUserProfile";
import { useAuth } from "../context/AuthContext";
import useMyProfile from "../hooks/useMyProfile";
import Loading from "../components/Loading";
import Error from "../components/Error";
import EditProfileModal from "../components/EditProfileModal";

const difficultyColors = {
  EASY: "bg-green-100 text-green-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  HARD: "bg-red-100 text-red-700",
};

function UserProfile() {
  const { username } = useParams();
  const { user } = useAuth();
  const { data: myProfile } = useMyProfile();
  const { data: profile, isLoading, isError, error } = useUserProfile(username);
  const [showEdit, setShowEdit] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isOwner = !!user && myProfile?.username?.toLowerCase() === username?.toLowerCase();

  if (isLoading) return <Loading />;
  if (isError) return <Error error={error} />;
  if (!profile) return null;

  const initials = (profile.name || profile.username)
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <main className="w-full max-w-300 mx-auto px-4 py-10">
      {showEdit && (
        <EditProfileModal
          currentProfile={myProfile}
          onClose={() => setShowEdit(false)}
        />
      )}

      {/* Profile header */}
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-10">
        {profile.image && !imgError ? (
          <img
            src={profile.image}
            alt={profile.name}
            className="w-20 h-20 rounded-full border-2 border-zinc-200 object-cover shrink-0"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-700 text-2xl font-bold flex items-center justify-center shrink-0 border-2 border-zinc-200">
            {initials}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-zinc-900">
              {profile.name || profile.username}
            </h1>
            <span className="text-zinc-400 text-sm font-mono">@{profile.username}</span>
            {isOwner && (
              <button
                onClick={() => setShowEdit(true)}
                className="flex items-center gap-1 text-sm text-zinc-500 border border-zinc-300 rounded-lg px-3 py-1 hover:bg-zinc-100 transition"
              >
                <FiEdit2 size={13} /> Edit profile
              </button>
            )}
          </div>
          {profile.bio && (
            <p className="mt-2 text-zinc-600 text-sm leading-relaxed max-w-xl">{profile.bio}</p>
          )}
        </div>

        {/* XP badge */}
        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-xl px-5 py-3 shrink-0">
          <FiAward className="text-indigo-600" size={22} />
          <div>
            <p className="text-xs text-indigo-500 font-medium">Total XP</p>
            <p className="text-2xl font-bold text-indigo-700">{profile.totalXp}</p>
          </div>
        </div>
      </div>

      {/* Solved challenges */}
      <section>
        <h2 className="text-lg font-semibold text-zinc-800 mb-5 flex items-center gap-2">
          <FiCheckCircle className="text-green-600" />
          Solved Challenges
          <span className="text-sm font-normal text-zinc-400">
            ({profile.solvedChallenges.length})
          </span>
        </h2>

        {profile.solvedChallenges.length === 0 ? (
          <p className="text-zinc-400 text-sm">
            {isOwner
              ? "You haven't solved any challenges yet."
              : "No challenges solved yet."}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.solvedChallenges.map((c) => (
              <Link
                key={c.challengeId}
                to={`/challenges/${c.challengeId}`}
                className="flex items-start gap-3 border border-green-200 bg-green-50 rounded-xl p-4 hover:bg-green-100 transition"
              >
                <FiCheckCircle className="text-green-600 mt-0.5 shrink-0" size={18} />
                <div className="min-w-0">
                  <p className="font-medium text-zinc-800 text-sm leading-snug">{c.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {c.difficulty && (
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${difficultyColors[c.difficulty] ?? ""}`}
                      >
                        {c.difficulty}
                      </span>
                    )}
                    <span className="text-xs text-indigo-600 font-medium">+{c.xp} XP</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default UserProfile;
