import React, { useEffect, useRef, useState } from "react";
import { HiOutlineX } from "react-icons/hi";
import { FiCamera } from "react-icons/fi";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import api from "../api/api";

function EditProfileModal({ currentProfile, onClose }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(currentProfile?.name ?? "");
  const [username, setUsername] = useState(currentProfile?.username ?? "");
  const [bio, setBio] = useState(currentProfile?.bio ?? "");
  const [avatarPreview, setAvatarPreview] = useState(currentProfile?.image ?? null);
  const [pendingFile, setPendingFile] = useState(null);
  const [avatarLoadError, setAvatarLoadError] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(currentProfile?.name ?? "");
    setUsername(currentProfile?.username ?? "");
    setBio(currentProfile?.bio ?? "");
    setAvatarPreview(currentProfile?.image ?? null);
    setPendingFile(null);
    setAvatarLoadError(false);
  }, [currentProfile]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5 MB.");
      return;
    }
    setPendingFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarLoadError(false);
    setError("");
  };

  const uploadAvatar = async (file) => {
    const { data } = await api.post("/users/avatar/presign", { contentType: file.type });
    await fetch(data.uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });
    await api.patch("/users/avatar", { avatarUrl: data.publicUrl });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      if (pendingFile) {
        await uploadAvatar(pendingFile);
      }

      const res = await api.patch("/users/profile", { name, username, bio });
      await queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
      if (res.data.username !== currentProfile?.username) {
        await navigate(`/u/${res.data.username}`, { replace: true });
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.error ?? "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const initials = (name || username || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-800 text-2xl"
        >
          <HiOutlineX />
        </button>

        <h2 className="text-xl font-bold text-zinc-800 mb-6">Edit Profile</h2>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          {/* Avatar picker */}
          <div className="flex justify-center mb-2">
            <div className="relative">
              {avatarPreview && !avatarLoadError ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover border-2 border-zinc-200"
                  onError={() => setAvatarLoadError(true)}
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-700 text-2xl font-bold flex items-center justify-center border-2 border-zinc-200">
                  {initials}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-7 h-7 bg-white border border-zinc-300 rounded-full flex items-center justify-center shadow-sm hover:bg-zinc-100 transition"
              >
                <FiCamera size={13} className="text-zinc-600" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="ep-name" className="block text-sm font-medium text-zinc-700 mb-1">Display name</label>
            <input
              id="ep-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="ep-username" className="block text-sm font-medium text-zinc-700 mb-1">Username</label>
            <div className="flex items-center border border-zinc-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
              <span className="px-3 text-zinc-400 text-sm bg-zinc-50 border-r border-zinc-300 py-2 select-none">
                /u/
              </span>
              <input
                id="ep-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                className="flex-1 px-3 py-2 text-zinc-800 focus:outline-none"
                placeholder="yourname"
                minLength={3}
                maxLength={20}
              />
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              3–20 chars, lowercase letters, numbers, underscores.
            </p>
          </div>

          <div>
            <label htmlFor="ep-bio" className="block text-sm font-medium text-zinc-700 mb-1">Bio</label>
            <textarea
              id="ep-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={200}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="A short bio..."
            />
            <p className="text-xs text-zinc-400 text-right">{bio.length}/200</p>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 text-sm font-medium border border-zinc-300 py-2 rounded-lg hover:bg-zinc-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 text-sm font-medium bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;
