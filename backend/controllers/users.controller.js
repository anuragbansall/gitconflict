import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { sql } from "../src/db.js";

let _s3 = null;
const getS3 = () => {
  if (!_s3) {
    _s3 = new S3Client({
      region: process.env.AWS_REGION || "us-east-1",
      endpoint: process.env.AWS_ENDPOINT_URL_S3,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true,
    });
  }
  return _s3;
};

const AVATARS_BUCKET = "avatars";

const toUsername = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 20) || "user";

// Effective avatar: custom upload > Google OAuth image
const resolveImage = (avatarUrl, googleImage) => avatarUrl || googleImage || null;

export const ensureProfile = async (userId, displayName) => {
  const existing = await sql`SELECT username FROM profiles WHERE user_id = ${userId}`;
  if (existing[0]) return existing[0].username;

  const base = toUsername(displayName || "user");
  const conflict = await sql`SELECT 1 FROM profiles WHERE lower(username) = lower(${base})`;
  const username = conflict[0] ? `${base}${Math.floor(Math.random() * 9000) + 1000}` : base;

  await sql`INSERT INTO profiles (user_id, username) VALUES (${userId}, ${username})`;
  return username;
};

const getChallengeXpMap = async () => {
  const rows = await sql`SELECT id, xp, title, difficulty FROM challenges`;
  return Object.fromEntries(rows.map((r) => [r.id, { xp: r.xp, title: r.title, difficulty: r.difficulty }]));
};

// POST /api/users/avatar/presign  (auth required)
export const presignAvatar = async (req, res) => {
  try {
    const userId = req.userId;
    const { contentType = "image/jpeg" } = req.body;

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(contentType)) {
      return res.status(400).json({ error: "Unsupported image type." });
    }

    const ext = contentType.split("/")[1].replace("jpeg", "jpg");
    const objectKey = `${userId}/avatar-${Date.now()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: AVATARS_BUCKET,
      Key: objectKey,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(getS3(), command, { expiresIn: 300 });
    const publicUrl = `${process.env.AWS_ENDPOINT_URL_S3}/${AVATARS_BUCKET}/${objectKey}`;

    res.json({ uploadUrl, publicUrl });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
};

// PATCH /api/users/avatar  (auth required)
export const updateAvatar = async (req, res) => {
  try {
    const userId = req.userId;
    const { avatarUrl } = req.body;

    if (typeof avatarUrl !== "string" || !avatarUrl.startsWith("http")) {
      return res.status(400).json({ error: "Invalid avatar URL." });
    }

    await sql`UPDATE profiles SET avatar_url = ${avatarUrl} WHERE user_id = ${userId}`;

    res.json({ avatarUrl });
  } catch (error) {
    console.error("Error updating avatar:", error);
    res.status(500).json({ error: "Failed to update avatar" });
  }
};

// GET /api/users/:username  (public)
export const getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const rows = await sql`
      SELECT p.user_id, p.username, p.bio, p.avatar_url, p.created_at,
             u.name, u.image
      FROM profiles p
      JOIN neon_auth.user u ON u.id = p.user_id
      WHERE lower(p.username) = lower(${username})
    `;

    if (!rows[0]) return res.status(404).json({ error: "Profile not found" });

    const profile = rows[0];

    const progressRows = await sql`
      SELECT challenge_id, completed_at
      FROM user_progress
      WHERE user_id = ${profile.user_id}
      ORDER BY completed_at ASC
    `;

    const xpMap = await getChallengeXpMap();

    const solvedChallenges = progressRows.map((row) => ({
      challengeId: row.challenge_id,
      completedAt: row.completed_at,
      title: xpMap[row.challenge_id]?.title ?? row.challenge_id,
      difficulty: xpMap[row.challenge_id]?.difficulty ?? null,
      xp: xpMap[row.challenge_id]?.xp ?? 0,
    }));

    const totalXp = solvedChallenges.reduce((sum, c) => sum + c.xp, 0);

    res.json({
      username: profile.username,
      name: profile.name,
      bio: profile.bio,
      image: resolveImage(profile.avatar_url, profile.image),
      createdAt: profile.created_at,
      totalXp,
      solvedChallenges,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// GET /api/users/me  (auth required)
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const userRows = await sql`SELECT name, email, image FROM neon_auth.user WHERE id = ${userId}`;
    if (!userRows[0]) return res.status(404).json({ error: "User not found" });

    const { name, email, image } = userRows[0];
    const username = await ensureProfile(userId, name || email);

    const profileRows = await sql`SELECT bio, avatar_url FROM profiles WHERE user_id = ${userId}`;

    res.json({
      username,
      name,
      email,
      image: resolveImage(profileRows[0]?.avatar_url, image),
      avatarUrl: profileRows[0]?.avatar_url ?? null,
      bio: profileRows[0]?.bio ?? null,
    });
  } catch (error) {
    console.error("Error fetching own profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// PATCH /api/users/profile  (auth required)
export const updateMyProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { username, bio, name } = req.body;

    const userRows = await sql`SELECT name, email FROM neon_auth.user WHERE id = ${userId}`;
    if (!userRows[0]) return res.status(404).json({ error: "User not found" });
    await ensureProfile(userId, userRows[0].name || userRows[0].email);

    if (username !== undefined) {
      if (!/^[a-z0-9_]{3,20}$/.test(username)) {
        return res.status(400).json({
          error: "Username must be 3–20 characters: lowercase letters, numbers, or underscores.",
        });
      }
      const conflict = await sql`
        SELECT 1 FROM profiles WHERE lower(username) = lower(${username}) AND user_id != ${userId}
      `;
      if (conflict[0]) return res.status(409).json({ error: "Username is already taken." });

      await sql`UPDATE profiles SET username = ${username} WHERE user_id = ${userId}`;
    }

    if (bio !== undefined) {
      await sql`UPDATE profiles SET bio = ${bio} WHERE user_id = ${userId}`;
    }

    if (name !== undefined) {
      if (!name.trim()) return res.status(400).json({ error: "Name cannot be empty." });
      await sql`UPDATE neon_auth.user SET name = ${name.trim()}, "updatedAt" = now() WHERE id = ${userId}`;
    }

    const updatedUser = await sql`SELECT name, email, image FROM neon_auth.user WHERE id = ${userId}`;
    const updatedProfile = await sql`SELECT username, bio, avatar_url FROM profiles WHERE user_id = ${userId}`;

    res.json({
      username: updatedProfile[0].username,
      name: updatedUser[0].name,
      email: updatedUser[0].email,
      image: resolveImage(updatedProfile[0].avatar_url, updatedUser[0].image),
      avatarUrl: updatedProfile[0].avatar_url ?? null,
      bio: updatedProfile[0].bio,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};
