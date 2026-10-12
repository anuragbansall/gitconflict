import React, { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

function CodeTerminal({ sessionId }) {
  const containerRef = useRef(null);
  const terminalRef = useRef(null);

  useEffect(() => {
    if (!sessionId) return;

    const terminal = new Terminal({
      cursorBlink: true,
      cursorStyle: "block",
      fontSize: 14,
      fontFamily: '"JetBrains Mono", Menlo, "Courier New", monospace',
      convertEol: true,
      allowTransparency: false,
      scrollback: 5000,
      theme: {
        background: "#0f172a",
        foreground: "#e2e8f0",
        cursor: "#e2e8f0",
        cursorAccent: "#0f172a",
        selectionBackground: "#334155",
        black: "#1e293b",
        red: "#f87171",
        green: "#4ade80",
        yellow: "#fbbf24",
        blue: "#60a5fa",
        magenta: "#c084fc",
        cyan: "#22d3ee",
        white: "#e2e8f0",
        brightBlack: "#475569",
        brightRed: "#fca5a5",
        brightGreen: "#86efac",
        brightYellow: "#fde68a",
        brightBlue: "#93c5fd",
        brightMagenta: "#d8b4fe",
        brightCyan: "#67e8f9",
        brightWhite: "#ffffff",
      },
    });

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.open(terminalRef.current);

    const fit = () => requestAnimationFrame(() => fitAddon.fit());
    fit();

    // Build WebSocket URL from the backend API URL
    const backendApiUrl =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";
    const httpBase = backendApiUrl.replace(/\/api\/?$/, "");
    const wsBase = httpBase.replace(/^https/, "wss").replace(/^http/, "ws");
    const wsUrl = `${wsBase}/ws/terminal?sessionId=${sessionId}`;

    let ws = null;
    let disposed = false;

    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      // Send current dimensions immediately after connecting
      const { cols, rows } = terminal;
      ws.send(
        new TextEncoder().encode(JSON.stringify({ type: "resize", cols, rows })),
      );
    };

    ws.onmessage = (e) => {
      if (typeof e.data === "string") {
        terminal.write(e.data);
      } else {
        // binary blob (shouldn't happen from server but handle it)
        e.data.arrayBuffer().then((buf) => {
          terminal.write(new Uint8Array(buf));
        });
      }
    };

    ws.onerror = () => {
      if (!disposed) {
        terminal.writeln(
          "\r\n\x1b[31mFailed to connect to terminal. Please refresh.\x1b[0m",
        );
      }
    };

    ws.onclose = (e) => {
      if (!disposed && e.code !== 1000) {
        terminal.writeln(
          "\r\n\x1b[33m[Terminal disconnected]\x1b[0m",
        );
      }
    };

    // Forward keystrokes to the PTY
    terminal.onData((data) => {
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    });

    // Forward resize events to the PTY
    terminal.onResize(({ cols, rows }) => {
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(
          new TextEncoder().encode(
            JSON.stringify({ type: "resize", cols, rows }),
          ),
        );
      }
    });

    const observer = new ResizeObserver(fit);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      disposed = true;
      observer.disconnect();
      ws?.close();
      terminal.dispose();
    };
  }, [sessionId]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full min-h-0 min-w-0 overflow-hidden rounded-xl bg-slate-900"
      style={{ padding: "12px" }}
    >
      <div ref={terminalRef} className="h-full w-full" />
    </div>
  );
}

export default CodeTerminal;
