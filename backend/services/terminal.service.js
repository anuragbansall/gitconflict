import { WebSocketServer } from "ws";
import { spawn } from "node-pty";
import { access } from "node:fs/promises";
import { join } from "node:path";
import { getSession } from "./session.service.js";

function sendToTerminal(ws, text) {
  if (ws.readyState === ws.OPEN) ws.send(text);
}

export function attachWebSocketTerminal(httpServer) {
  const frontendOrigin = process.env.FRONTEND_URL;

  const wss = new WebSocketServer({
    server: httpServer,
    path: "/ws/terminal",
    verifyClient: ({ origin }) => {
      if (!frontendOrigin) return true;
      return origin === frontendOrigin;
    },
  });

  wss.on("connection", async (ws, req) => {
    let ptyProcess = null;

    try {
      const url = new URL(req.url, "http://localhost");
      const sessionId = url.searchParams.get("sessionId");

      if (!sessionId) {
        sendToTerminal(ws, "\r\n\x1b[31mNo session ID provided.\x1b[0m\r\n");
        ws.close(4001, "Session ID required");
        return;
      }

      let session;
      try {
        session = await getSession(sessionId);
      } catch (dbErr) {
        console.error("WebSocket terminal: DB error looking up session:", dbErr.message);
        sendToTerminal(ws, "\r\n\x1b[31mDatabase unavailable. Please try again shortly.\x1b[0m\r\n");
        ws.close(4500, "Database error");
        return;
      }

      if (!session) {
        sendToTerminal(ws, "\r\n\x1b[33mSession not found. Please restart the challenge.\x1b[0m\r\n");
        ws.close(4004, "Session not found");
        return;
      }

      const repoDir = join(session.sandboxDir, "repo");

      // Verify the sandbox directory still exists on disk before spawning
      try {
        await access(repoDir);
      } catch {
        sendToTerminal(ws, "\r\n\x1b[33mSandbox has expired (server was restarted). Please refresh the page and restart the challenge.\x1b[0m\r\n");
        ws.close(4410, "Sandbox not found");
        return;
      }

      const shell = process.env.SHELL || "/bin/bash";

      ptyProcess = spawn(shell, [], {
        name: "xterm-256color",
        cols: 80,
        rows: 24,
        cwd: repoDir,
        env: {
          ...process.env,
          HOME: session.sandboxDir,
          TERM: "xterm-256color",
          COLORTERM: "truecolor",
          GIT_AUTHOR_NAME: "Git Challenge User",
          GIT_AUTHOR_EMAIL: "user@gitchallenge.dev",
          GIT_COMMITTER_NAME: "Git Challenge User",
          GIT_COMMITTER_EMAIL: "user@gitchallenge.dev",
        },
      });

      ptyProcess.onData((data) => {
        if (ws.readyState === ws.OPEN) {
          ws.send(data);
        }
      });

      ptyProcess.onExit(() => {
        if (ws.readyState === ws.OPEN) {
          ws.close(1000, "Shell exited");
        }
      });

      ws.on("message", (data, isBinary) => {
        if (!ptyProcess) return;

        if (isBinary) {
          try {
            const msg = JSON.parse(data.toString());
            if (msg.type === "resize") {
              const cols = Math.max(1, Math.min(Number(msg.cols) || 80, 500));
              const rows = Math.max(1, Math.min(Number(msg.rows) || 24, 200));
              ptyProcess.resize(cols, rows);
            }
          } catch {
            // ignore malformed binary messages
          }
        } else {
          ptyProcess.write(data.toString());
        }
      });

      const cleanup = () => {
        if (ptyProcess) {
          try {
            ptyProcess.kill();
          } catch {
            // already gone
          }
          ptyProcess = null;
        }
      };

      ws.on("close", cleanup);
      ws.on("error", cleanup);
    } catch (err) {
      console.error("WebSocket terminal error:", err);
      sendToTerminal(ws, `\r\n\x1b[31mTerminal error: ${err.message}\x1b[0m\r\n`);
      if (ptyProcess) {
        try {
          ptyProcess.kill();
        } catch {
          // ignore
        }
      }
      ws.close(4000, "Internal error");
    }
  });

  return wss;
}
