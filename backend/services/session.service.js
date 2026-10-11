import { sql } from "../src/db.js";

export const addSession = async (sessionId, session) => {
  await sql`
    INSERT INTO sessions (id, container_name, challenge_id, user_id)
    VALUES (${sessionId}, ${session.containerName}, ${session.challengeId}, ${session.userId ?? null})
  `;
};

export const getSession = async (sessionId) => {
  const rows = await sql`SELECT * FROM sessions WHERE id = ${sessionId}`;
  if (!rows[0]) return null;
  const row = rows[0];
  return {
    containerName: row.container_name,
    challengeId: row.challenge_id,
    userId: row.user_id,
  };
};

export const getSessionByChallengeId = async (challengeId) => {
  const rows = await sql`SELECT * FROM sessions WHERE challenge_id = ${challengeId} LIMIT 1`;
  if (!rows[0]) return null;
  const row = rows[0];
  return {
    containerName: row.container_name,
    challengeId: row.challenge_id,
    userId: row.user_id,
  };
};

export const removeSession = async (sessionId) => {
  await sql`DELETE FROM sessions WHERE id = ${sessionId}`;
};
