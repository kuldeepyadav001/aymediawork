import type { ComponentPropsWithoutRef, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

function MarkdownLink({
  children,
  href,
  title,
}: ComponentPropsWithoutRef<"a">) {
  const isExternal =
    href?.startsWith("http://") || href?.startsWith("https://");

  return (
    <a
      href={href}
      title={title}
      className="font-medium text-primary underline decoration-primary/40 decoration-1 underline-offset-4 transition-colors hover:text-white hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      rel={isExternal ? "noreferrer noopener" : undefined}
      target={isExternal ? "_blank" : undefined}
    >
      {children}
    </a>
  );
}

function HeadingTwo({ children }: { children?: ReactNode }) {
  return (
    <h2 className="mt-14 font-display text-3xl font-semibold tracking-[-0.035em] text-white first:mt-0 sm:text-4xl">
      {children}
    </h2>
  );
}

export function SafeMarkdown({ source }: { source: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      components={{
        a: MarkdownLink,
        blockquote: ({ children }) => (
          <blockquote className="my-10 border-l-2 border-primary bg-white/[0.035] px-6 py-5 font-display text-xl leading-relaxed text-white sm:px-8 sm:text-2xl">
            {children}
          </blockquote>
        ),
        code: ({ children }) => (
          <code className="rounded-md bg-white/[0.08] px-1.5 py-0.5 font-mono text-[0.9em] text-primary">
            {children}
          </code>
        ),
        h2: HeadingTwo,
        h3: ({ children }) => (
          <h3 className="mt-10 font-display text-2xl font-semibold tracking-[-0.025em] text-white sm:text-3xl">
            {children}
          </h3>
        ),
        li: ({ children }) => <li className="pl-1">{children}</li>,
        ol: ({ children }) => (
          <ol className="my-6 list-decimal space-y-3 pl-6 marker:font-medium marker:text-primary">
            {children}
          </ol>
        ),
        p: ({ children }) => (
          <p className="mt-5 text-base leading-8 text-muted-foreground first:mt-0 sm:text-lg sm:leading-9">
            {children}
          </p>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-white">{children}</strong>
        ),
        ul: ({ children }) => (
          <ul className="my-6 list-disc space-y-3 pl-6 marker:text-primary">
            {children}
          </ul>
        ),
      }}
    >
      {source}
    </ReactMarkdown>
  );
}
