import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Editor, { loader } from "@monaco-editor/react";
import {
  FiChevronDown,
  FiChevronRight,
  FiFile,
  FiFolder,
  FiSave,
} from "react-icons/fi";
import api from "../api/api";

// Define our custom theme once on module load
void loader.init().then((monaco) => {
  monaco.editor.defineTheme("gitchallenge-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "64748b", fontStyle: "italic" },
      { token: "keyword", foreground: "93c5fd" },
      { token: "string", foreground: "86efac" },
      { token: "number", foreground: "fbbf24" },
    ],
    colors: {
      "editor.background": "#0f172a",
      "editor.foreground": "#e2e8f0",
      "editor.lineHighlightBackground": "#1e293b",
      "editor.selectionBackground": "#334155",
      "editor.inactiveSelectionBackground": "#1e293b",
      "editorCursor.foreground": "#e2e8f0",
      "editorLineNumber.foreground": "#475569",
      "editorLineNumber.activeForeground": "#94a3b8",
      "editorIndentGuide.background1": "#1e293b",
      "editorIndentGuide.activeBackground1": "#334155",
      "editorWidget.background": "#0f172a",
      "editorSuggestWidget.background": "#0f172a",
      "editorSuggestWidget.border": "#334155",
      "editorSuggestWidget.selectedBackground": "#1e293b",
      "scrollbar.shadow": "#0f172a",
      "scrollbarSlider.background": "#1e293b88",
      "scrollbarSlider.hoverBackground": "#33415588",
      "scrollbarSlider.activeBackground": "#47556988",
    },
  });
});

const LANG_MAP = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  mjs: "javascript",
  cjs: "javascript",
  json: "json",
  jsonc: "json",
  md: "markdown",
  markdown: "markdown",
  sh: "shell",
  bash: "shell",
  zsh: "shell",
  py: "python",
  html: "html",
  htm: "html",
  css: "css",
  scss: "scss",
  sass: "scss",
  less: "less",
  yaml: "yaml",
  yml: "yaml",
  xml: "xml",
  sql: "sql",
  go: "go",
  rs: "rust",
  c: "c",
  cpp: "cpp",
  java: "java",
  rb: "ruby",
  php: "php",
  toml: "ini",
  ini: "ini",
  env: "plaintext",
  gitignore: "plaintext",
  gitattributes: "plaintext",
  lock: "plaintext",
};

function getLanguage(filename = "") {
  const name = filename.toLowerCase();
  // Check exact filenames first
  if (name === ".gitignore" || name === ".gitattributes" || name === ".env")
    return "plaintext";
  const ext = name.split(".").pop();
  return LANG_MAP[ext] || "plaintext";
}

function normalizePath(fileName) {
  return fileName.replaceAll("\\", "/");
}

function buildTree(repo = []) {
  const root = { type: "folder", name: "", path: "", children: new Map() };

  for (const entry of repo) {
    const filePath = normalizePath(entry.fileName || "");
    if (!filePath) continue;

    const parts = filePath.split("/").filter(Boolean);
    let current = root;
    let currentPath = "";

    parts.forEach((part, index) => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const isLast = index === parts.length - 1;

      if (!current.children.has(part)) {
        current.children.set(
          part,
          isLast
            ? { type: "file", name: part, path: currentPath, content: entry.content || "" }
            : { type: "folder", name: part, path: currentPath, children: new Map() },
        );
      }

      const next = current.children.get(part);
      if (!isLast && next.type === "folder") current = next;
    });
  }

  const toSortedArray = (node) =>
    Array.from(node.children.values())
      .sort((a, b) => {
        if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
        return a.name.localeCompare(b.name);
      })
      .map((child) =>
        child.type === "folder"
          ? { ...child, children: toSortedArray(child) }
          : child,
      );

  return toSortedArray(root);
}

function TreeNode({ node, expandedFolders, onToggleFolder, onSelectFile, depth = 0, selectedPath, dirtyPaths }) {
  const isFolder = node.type === "folder";
  const isExpanded = expandedFolders.has(node.path);
  const isSelected = selectedPath === node.path;
  const isDirty = !isFolder && dirtyPaths.has(node.path);

  return (
    <div>
      <button
        type="button"
        className={`
          flex w-full min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-sm
          cursor-pointer transition-colors duration-100
          ${isSelected ? "bg-sky-500/20 text-white" : "text-slate-300 hover:bg-slate-700/60 hover:text-white"}
        `}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => (isFolder ? onToggleFolder(node.path) : onSelectFile(node))}
      >
        {isFolder ? (
          <>
            {isExpanded
              ? <FiChevronDown className="shrink-0 text-slate-400" size={13} />
              : <FiChevronRight className="shrink-0 text-slate-400" size={13} />}
          </>
        ) : (
          <span className="w-[13px] shrink-0" />
        )}

        {isFolder ? (
          <FiFolder className="shrink-0 text-amber-400" size={14} />
        ) : (
          <FiFile className="shrink-0 text-slate-400" size={14} />
        )}

        <span className="min-w-0 flex-1 truncate" title={node.name}>
          {node.name}
        </span>

        {isDirty && (
          <span className="shrink-0 h-2 w-2 rounded-full bg-amber-400" title="Unsaved changes" />
        )}
      </button>

      {isFolder && isExpanded && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              expandedFolders={expandedFolders}
              onToggleFolder={onToggleFolder}
              onSelectFile={onSelectFile}
              depth={depth + 1}
              selectedPath={selectedPath}
              dirtyPaths={dirtyPaths}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CodeEditor({ repo = [], sessionId }) {
  const tree = useMemo(() => buildTree(repo), [repo]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [leftPaneWidth, setLeftPaneWidth] = useState(25);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [dirtyPaths, setDirtyPaths] = useState(new Set());

  const editorRef = useRef(null);
  const editorShellRef = useRef(null);
  // Cache edited content per file so switching tabs preserves edits
  const editorCache = useRef({});
  // Always-current save fn reference so Monaco's addCommand never goes stale
  const handleSaveRef = useRef(null);

  useEffect(() => {
    const firstFile = repo.find((e) => e?.fileName);
    if (!firstFile) {
      setSelectedFile(null);
      setExpandedFolders(new Set());
      return;
    }

    const path = normalizePath(firstFile.fileName);
    setSelectedFile({ path, name: path.split("/").pop(), content: firstFile.content || "" });
    setExpandedFolders(new Set());
  }, [repo]);

  const toggleFolder = (folderPath) => {
    setExpandedFolders((cur) => {
      const next = new Set(cur);
      next.has(folderPath) ? next.delete(folderPath) : next.add(folderPath);
      return next;
    });
  };

  const selectFile = (node) => {
    // Persist current editor value in cache before switching
    if (editorRef.current && selectedFile) {
      editorCache.current[selectedFile.path] = editorRef.current.getValue();
    }
    setSelectedFile({ path: node.path, name: node.name, content: node.content });
  };

  const handleSave = useCallback(async () => {
    if (!selectedFile || !editorRef.current || !sessionId || isSaving) return;

    const content = editorRef.current.getValue();
    setIsSaving(true);
    setSaveError(null);

    try {
      await api.put(`/challenges/file/${sessionId}`, {
        path: selectedFile.path,
        content,
      });
      editorCache.current[selectedFile.path] = content;
      setDirtyPaths((cur) => {
        const next = new Set(cur);
        next.delete(selectedFile.path);
        return next;
      });
    } catch (err) {
      setSaveError(err?.response?.data?.error || "Save failed");
    } finally {
      setIsSaving(false);
    }
  }, [selectedFile, sessionId, isSaving]);

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;
    monaco.editor.setTheme("gitchallenge-dark");

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      void handleSaveRef.current?.();
    });
  };
  handleSaveRef.current = handleSave;

  const handleEditorChange = () => {
    if (!selectedFile) return;
    setDirtyPaths((cur) => new Set([...cur, selectedFile.path]));
    setSaveError(null);
  };

  const startResize = (event) => {
    event.preventDefault();
    const shell = editorShellRef.current;
    if (!shell) return;

    const update = (clientX) => {
      const rect = shell.getBoundingClientRect();
      const pct = ((clientX - rect.left) / rect.width) * 100;
      setLeftPaneWidth(Math.min(50, Math.max(20, pct)));
    };

    update(event.clientX);

    const onMove = (e) => update(e.clientX);
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const isCurrentDirty = selectedFile ? dirtyPaths.has(selectedFile.path) : false;
  const canSave = isCurrentDirty && !!sessionId && !isSaving;

  return (
    <div
      ref={editorShellRef}
      className="flex min-h-0 flex-1 flex-col lg:flex-row"
      style={{ ["--left-pane-width"]: `${leftPaneWidth}%` }}
    >
      {/* ─── File tree ─── */}
      <aside
        className="
          flex min-h-0 flex-col overflow-hidden
          rounded-xl border border-slate-700 bg-slate-900
          w-full lg:flex-none lg:w-(--left-pane-width) lg:min-w-48 lg:max-w-[50%]
        "
      >
        <div className="shrink-0 border-b border-slate-700/70 px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Explorer
        </div>

        <div className="min-h-0 flex-1 overflow-auto p-1.5">
          {tree.length === 0 ? (
            <p className="px-3 py-6 text-sm text-slate-500">No files available.</p>
          ) : (
            tree.map((node) => (
              <TreeNode
                key={node.path}
                node={node}
                expandedFolders={expandedFolders}
                onToggleFolder={toggleFolder}
                onSelectFile={selectFile}
                selectedPath={selectedFile?.path}
                dirtyPaths={dirtyPaths}
              />
            ))
          )}
        </div>
      </aside>

      {/* ─── Resize handle ─── */}
      <button
        type="button"
        aria-label="Resize file tree"
        onPointerDown={startResize}
        className="hidden lg:block w-1.5 cursor-col-resize bg-slate-700/50 hover:bg-sky-500/60 transition-colors rounded-full"
      />

      {/* ─── Monaco editor ─── */}
      <section
        className="
          flex min-h-0 flex-1 flex-col overflow-hidden
          rounded-xl border border-slate-700 bg-slate-900
          w-full lg:min-w-0 lg:max-w-[80%]
        "
      >
        {/* Tab bar / header */}
        <div className="flex shrink-0 items-center gap-2 border-b border-slate-700/70 px-3 py-1.5 text-sm">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {selectedFile ? (
              <>
                <FiFile className="shrink-0 text-slate-400" size={13} />
                <span className="min-w-0 truncate font-medium text-slate-200" title={selectedFile.path}>
                  {selectedFile.name}
                </span>
                {isCurrentDirty && (
                  <span className="shrink-0 h-2 w-2 rounded-full bg-amber-400" title="Unsaved changes" />
                )}
              </>
            ) : (
              <span className="text-slate-500">No file open</span>
            )}
          </div>

          {saveError && (
            <span className="shrink-0 text-xs text-red-400">{saveError}</span>
          )}

          {selectedFile && sessionId && (
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave}
              title="Save file (Ctrl+S)"
              className={`
                flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors
                ${canSave
                  ? "bg-sky-600 text-white hover:bg-sky-500"
                  : "cursor-default text-slate-500"
                }
              `}
            >
              <FiSave size={12} />
              {isSaving ? "Saving…" : "Save"}
            </button>
          )}

          {!sessionId && selectedFile && (
            <span className="shrink-0 text-xs text-slate-500">Read only</span>
          )}
        </div>

        {/* Editor area */}
        <div className="min-h-0 flex-1">
          {selectedFile ? (
            <Editor
              key={selectedFile.path}
              defaultValue={editorCache.current[selectedFile.path] ?? selectedFile.content ?? ""}
              language={getLanguage(selectedFile.name)}
              theme="gitchallenge-dark"
              onChange={handleEditorChange}
              onMount={handleEditorMount}
              loading={
                <div className="flex h-full items-center justify-center text-sm text-slate-500">
                  Loading editor…
                </div>
              }
              options={{
                readOnly: !sessionId,
                fontSize: 13,
                fontFamily: '"JetBrains Mono", Menlo, "Courier New", monospace',
                fontLigatures: true,
                lineHeight: 22,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: "off",
                padding: { top: 14, bottom: 14 },
                renderLineHighlight: "line",
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                smoothScrolling: true,
                renderWhitespace: "none",
                bracketPairColorization: { enabled: true },
                guides: { indentation: true, bracketPairs: false },
                contextmenu: true,
                folding: true,
                suggest: { showWords: false },
                quickSuggestions: false,
                tabSize: 2,
                insertSpaces: true,
                overviewRulerBorder: false,
                hideCursorInOverviewRuler: true,
                scrollbar: {
                  verticalScrollbarSize: 6,
                  horizontalScrollbarSize: 6,
                },
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center rounded-b-xl border-dashed border-slate-700 text-sm text-slate-500">
              Select a file from the explorer to open it
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default CodeEditor;
