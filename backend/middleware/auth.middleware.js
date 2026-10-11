import { createRemoteJWKSet, jwtVerify } from "jose";

let _jwks = null;

const getJWKS = () => {
  if (!_jwks) {
    if (!process.env.NEON_AUTH_JWKS_URL) {
      throw new Error("NEON_AUTH_JWKS_URL is not defined.");
    }
    _jwks = createRemoteJWKSet(new URL(process.env.NEON_AUTH_JWKS_URL));
  }
  return _jwks;
};

export const extractUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    req.userId = null;
    return next();
  }

  try {
    const token = authHeader.slice(7);
    const { payload } = await jwtVerify(token, getJWKS());
    req.userId = payload.sub ?? null;
  } catch {
    req.userId = null;
  }

  next();
};

export const requireAuth = (req, res, next) => {
  if (!req.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};
