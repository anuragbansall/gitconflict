import React, { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";

import "@xterm/xterm/css/xterm.css";
import useExecuteCommand from "../hooks/useExecuteCommand";

function CodeTerminal({ sessionId, challengeId }) {
  const containerRef = useRef(null);
  const terminalRef = useRef(null);

  const executeCommandMutation = useExecuteCommand();

  useEffect(() => {
    const terminal = new Terminal({
      cursorBlink: true,
      cursorStyle: "block",
      fontSize: 14,
      fontFamily: "JetBrains Mono, monospace",
      convertEol: true,

      theme: {
        background: "#0f172a",
        foreground: "#f8fafc",
        cursor: "#ffffff",
        selectionBackground: "#334155",
      },
    });

    const fitAddon = new FitAddon();

    terminal.loadAddon(fitAddon);

    terminal.open(terminalRef.current);

    const resize = () => {
      requestAnimationFrame(() => {
        fitAddon.fit();
      });
    };

    resize();

    terminal.writeln("> Bash Terminal");
    terminal.writeln("");

    const prompt = () => {
      terminal.write("$ ");
    };

    prompt();

    let command = "";

    terminal.onData((data) => {
      // If the user presses Enter, execute the command and display the result in the terminal.
      if (data === "\r") {
        terminal.writeln("");

        executeCommandMutation.mutate(
          {
            challengeId,
            sessionId,
            command: command || "empty command",
          },
          {
            onSuccess: (data) => {
              terminal.writeln(data.output || "Command executed successfully!");
              prompt();
            },
            onError: (error) => {
              terminal.writeln(
                `Error executing command: ${error.message || "Unknown error"}`,
              );
              prompt();
            },
          },
        );

        command = "";

        return;
      }

      //   If the user presses Backspace, remove the last character from the command and update the terminal display.
      if (data === "\u007F") {
        if (command.length > 0) {
          command = command.slice(0, -1);
          terminal.write("\b \b");
        }

        return;
      }

      command += data;
      terminal.write(data);
    });

    const observer = new ResizeObserver(() => {
      resize();
    });

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      terminal.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="
        h-full
        w-full
        min-h-0
        min-w-0
        overflow-hidden
        rounded-xl
        bg-slate-900
        p-4
      "
    >
      <div
        ref={terminalRef}
        className="
          h-full
          w-full
        "
      />
    </div>
  );
}

export default CodeTerminal;
