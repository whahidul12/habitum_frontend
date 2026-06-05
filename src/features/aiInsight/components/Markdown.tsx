import ReactMarkdown from "react-markdown";
import { ReactNode } from "react";

interface MarkdownProps {
  children: string;
  className?: string;
}

// Type-safe component definitions for ReactMarkdown
const components = {
  p: ({ children, ...props }: { children?: ReactNode }) => (
    <p className="mb-2 last:mb-0 leading-relaxed" {...props}>
      {children}
    </p>
  ),
  strong: ({ children, ...props }: { children?: ReactNode }) => (
    <strong className="font-semibold" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: { children?: ReactNode }) => (
    <em className="italic" {...props}>
      {children}
    </em>
  ),
  ul: ({ children, ...props }: { children?: ReactNode }) => (
    <ul className="list-disc pl-5 my-2 space-y-1" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: { children?: ReactNode }) => (
    <ol className="list-decimal pl-5 my-2 space-y-1" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: { children?: ReactNode }) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
  h1: ({ children, ...props }: { children?: ReactNode }) => (
    <h3 className="font-semibold text-base mt-3 mb-1" {...props}>
      {children}
    </h3>
  ),
  h2: ({ children, ...props }: { children?: ReactNode }) => (
    <h3 className="font-semibold text-base mt-3 mb-1" {...props}>
      {children}
    </h3>
  ),
  h3: ({ children, ...props }: { children?: ReactNode }) => (
    <h3 className="font-semibold text-base mt-3 mb-1" {...props}>
      {children}
    </h3>
  ),
  blockquote: ({ children, ...props }: { children?: ReactNode }) => (
    <blockquote
      className="border-l-2 border-brand-500/40 pl-3 my-2 italic text-soft"
      {...props}
    >
      {children}
    </blockquote>
  ),
  code: ({
    inline,
    children,
    ...props
  }: {
    inline?: boolean;
    children?: ReactNode;
  }) =>
    inline ? (
      <code
        className="px-1.5 py-0.5 rounded text-[0.85em] font-mono"
        style={{ background: "var(--chip-bg)" }}
        {...props}
      >
        {children}
      </code>
    ) : (
      <code
        className="block rounded-lg p-3 text-[0.85em] font-mono overflow-x-auto"
        style={{ background: "var(--chip-bg)" }}
        {...props}
      >
        {children}
      </code>
    ),
  a: ({ href, children, ...rest }: { href?: string; children?: ReactNode }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-brand-700 dark:text-brand-300 underline underline-offset-2"
      {...rest}
    >
      {children}
    </a>
  ),
  hr: () => <hr className="my-3 divider" />,
};

export default function Markdown({ children, className = "" }: MarkdownProps) {
  return (
    <div className={className}>
      <ReactMarkdown components={components}>{children || ""}</ReactMarkdown>
    </div>
  );
}
