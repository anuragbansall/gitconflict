import api from "./api";

export const getChallenges = async () => {
  const response = await api.get("/challenges");
  return response.data;
};

export const getChallengeById = async (id) => {
  const response = await api.get(`/challenges/${id}`);
  return response.data;
};

export const startChallenge = async (challengeId) => {
  const response = await api.post(`/challenges/start/${challengeId}`);
  return response.data;
};

export const stopChallenge = async (sessionId) => {
  const response = await api.delete(`/challenges/stop/${sessionId}`);
  return response.data;
};

export const executeCommand = async (sessionId, command) => {
  const response = await api.post(`/challenges/execute/${sessionId}`, {
    command,
  });
  return response.data;
};

export const verifyChallenge = async (sessionId) => {
  const response = await api.post(`/challenges/verify/${sessionId}`);
  return response.data;
};
