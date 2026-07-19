import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Markdown = ({ children, data = "" }) => {
  const markdown = children ?? data;

  if (!markdown) return null;

  return (
    <article className="prose prose-zinc dark:prose-invert max-w-none rounded-lg border border-zinc-200 bg-zinc-100/10 p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </article>
  );
};

export default Markdown;
