// TODO: Use separate DB to store sessions and containers
const sessions = {};

export const addSession = (sessionId, session) => {
  sessions[sessionId] = session;
};

export const getSession = (sessionId) => {
  return sessions[sessionId];
};

export const removeSession = (sessionId) => {
  delete sessions[sessionId];
};
