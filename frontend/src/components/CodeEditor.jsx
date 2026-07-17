import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FiChevronDown,
  FiChevronRight,
  FiFile,
  FiFolder,
} from "react-icons/fi";

function normalizePath(fileName) {
  return fileName.replace(/\\/g, "/");
}

function buildTree(repo = []) {
  const root = { type: "folder", name: "", path: "", children: new Map() };

  for (const entry of repo) {
    const filePath = normalizePath(entry.fileName || "");

    if (!filePath) {
      continue;
    }

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
            ? {
                type: "file",
                name: part,
                path: currentPath,
                content: entry.content || "",
              }
            : {
                type: "folder",
                name: part,
                path: currentPath,
                children: new Map(),
              },
        );
      }

      const nextNode = current.children.get(part);

      if (!isLast && nextNode.type === "folder") {
        current = nextNode;
      }
    });
  }

  const toSortedArray = (node) =>
    Array.from(node.children.values())
      .sort((left, right) => {
        if (left.type !== right.type) {
          return left.type === "folder" ? -1 : 1;
        }

        return left.name.localeCompare(right.name);
      })
      .map((child) =>
        child.type === "folder"
          ? {
              ...child,
              children: toSortedArray(child),
            }
          : child,
      );

  return toSortedArray(root);
}

function collectAncestorPaths(filePath) {
  const parts = normalizePath(filePath).split("/").filter(Boolean);
  const ancestors = [];
  let currentPath = "";

  for (let index = 0; index < parts.length - 1; index += 1) {
    currentPath = currentPath ? `${currentPath}/${parts[index]}` : parts[index];
    ancestors.push(currentPath);
  }

  return ancestors;
}

function TreeNode({
  node,
  expandedFolders,
  onToggleFolder,
  onSelectFile,
  depth = 0,
  selectedPath,
}) {
  const isFolder = node.type === "folder";
  const isExpanded = expandedFolders.has(node.path);
  const isSelected = selectedPath === node.path;

  return (
    <div>
      <button
        type="button"
        className={`
          flex
          w-full
          min-w-0
          items-center
          gap-2
          rounded-lg
          px-2
          py-2
          text-left
          text-sm
          cursor-pointer
          transition-colors
          ${isSelected ? "bg-sky-100/20 text-white" : "text-white hover:bg-sky-100/10"}
        `}
        style={{ paddingLeft: `${depth * 14 + 8}px` }}
        onClick={() => {
          if (isFolder) {
            onToggleFolder(node.path);
          } else {
            onSelectFile(node);
          }
        }}
      >
        {isFolder ? (
          isExpanded ? (
            <FiChevronDown className="shrink-0" />
          ) : (
            <FiChevronRight className="shrink-0" />
          )
        ) : (
          <span className="w-4 shrink-0" />
        )}

        {isFolder ? (
          <FiFolder className="shrink-0 text-amber-500" />
        ) : (
          <FiFile className="shrink-0 text-zinc-400" />
        )}

        <span className="min-w-0 truncate" title={node.name}>
          {node.name}
        </span>
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
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CodeEditor({ repo = [] }) {
  const tree = useMemo(() => buildTree(repo), [repo]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [leftPaneWidth, setLeftPaneWidth] = useState(25);
  const editorShellRef = useRef(null);

  useEffect(() => {
    const firstFile = repo.find((entry) => entry?.fileName);

    if (!firstFile) {
      setSelectedFile(null);
      setExpandedFolders(new Set());
      return;
    }

    const normalizedFirstFile = normalizePath(firstFile.fileName);

    setSelectedFile({
      path: normalizedFirstFile,
      name: normalizedFirstFile.split("/").pop(),
      content: firstFile.content || "",
    });
    setExpandedFolders(new Set(collectAncestorPaths(normalizedFirstFile)));
  }, [repo]);

  const toggleFolder = (folderPath) => {
    setExpandedFolders((current) => {
      const next = new Set(current);

      if (next.has(folderPath)) {
        next.delete(folderPath);
      } else {
        next.add(folderPath);
      }

      return next;
    });
  };

  const selectFile = (fileNode) => {
    setSelectedFile({
      path: fileNode.path,
      name: fileNode.name,
      content: fileNode.content,
    });
  };

  const startResize = (event) => {
    event.preventDefault();

    const shell = editorShellRef.current;

    if (!shell) {
      return;
    }

    const updateWidth = (clientX) => {
      const rect = shell.getBoundingClientRect();
      const nextWidth = ((clientX - rect.left) / rect.width) * 100;
      const clampedWidth = Math.min(50, Math.max(30, nextWidth));

      setLeftPaneWidth(clampedWidth);
    };

    updateWidth(event.clientX);

    const handleMove = (moveEvent) => {
      updateWidth(moveEvent.clientX);
    };

    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  return (
    <div
      ref={editorShellRef}
      className="flex min-h-0 flex-1 flex-col lg:flex-row"
      style={{
        ["--left-pane-width"]: `${leftPaneWidth}%`,
      }}
    >
      <aside className="min-h-0 overflow-hidden rounded-xl border border-zinc-200 bg-slate-900 w-full lg:flex-none lg:w-(--left-pane-width) lg:min-w-55 lg:max-w-[50%] text-white">
        <div className="border-b border-zinc-200 px-4 py-3 text-sm font-semibold text-white">
          Repository Files
        </div>

        <div className="max-h-[55vh] overflow-auto p-2 lg:h-full lg:max-h-none">
          {tree.length === 0 ? (
            <div className="px-3 py-6 text-sm text-white">
              No files available.
            </div>
          ) : (
            tree.map((node) => (
              <TreeNode
                key={node.path}
                node={node}
                expandedFolders={expandedFolders}
                onToggleFolder={toggleFolder}
                onSelectFile={selectFile}
                selectedPath={selectedFile?.path}
              />
            ))
          )}
        </div>
      </aside>

      <button
        type="button"
        aria-label="Resize file tree panel"
        onPointerDown={startResize}
        className="hidden lg:block w-2 cursor-col-resize rounded-full bg-zinc-200 transition-colors hover:bg-zinc-300"
      />

      <section className="min-h-0 overflow-hidden rounded-xl border border-zinc-200 bg-slate-900 w-full lg:min-w-0 lg:flex-1 lg:max-w-[75%]">
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3 text-sm text-zinc-300">
          <span className="min-w-0 truncate font-semibold text-zinc-100">
            {selectedFile?.path || "Select a file"}
          </span>
          <span className="text-zinc-400">
            {selectedFile ? "Read only" : ""}
          </span>
        </div>

        <div className="h-[55vh] overflow-auto p-4 lg:h-full">
          {selectedFile ? (
            <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-6 text-zinc-100">
              <code>{selectedFile.content || ""}</code>
            </pre>
          ) : (
            <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-zinc-800 text-sm text-zinc-500">
              Pick a file from the tree to preview its contents.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default CodeEditor;
