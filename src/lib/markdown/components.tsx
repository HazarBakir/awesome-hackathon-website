import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { generateHeadingId } from "@/utils/generateHeadingId";
import {
  sanitizePath,
  isValidGitHubIdentifier,
  isValidUrl,
  sanitizeDataUri,
} from "./security";
import type { RepositoryInfo } from "@/types";

type ComponentsProps = {
  repositoryInfo: RepositoryInfo;
};

export function createMarkdownComponents({
  repositoryInfo,
}: ComponentsProps) {
  return {
    h1: ({ children, ...props }: React.ComponentProps<"h1">) => {
      const text = String(children);
      const id = generateHeadingId(text);
      return (
        <h1
          id={id}
          className="text-2xl sm:text-3xl md:text-4xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4 pb-2 border-b border-border scroll-mt-16 sm:scroll-mt-20"
          {...props}
        >
          {children}
        </h1>
      );
    },
    h2: ({ children, ...props }: React.ComponentProps<"h2">) => {
      const text = String(children);
      const id = generateHeadingId(text);
      return (
        <h2
          id={id}
          className="text-xl sm:text-2xl md:text-3xl font-semibold mt-6 sm:mt-8 mb-3 sm:mb-4 pb-2 border-b border-border scroll-mt-16 sm:scroll-mt-20"
          {...props}
        >
          {children}
        </h2>
      );
    },
    h3: ({ children, ...props }: React.ComponentProps<"h3">) => {
      const text = String(children);
      const id = generateHeadingId(text);
      return (
        <h3
          id={id}
          className="text-lg sm:text-xl md:text-2xl font-semibold mt-4 sm:mt-6 mb-2 sm:mb-3 scroll-mt-16 sm:scroll-mt-20"
          {...props}
        >
          {children}
        </h3>
      );
    },
    h4: ({ children, ...props }: React.ComponentProps<"h4">) => {
      const text = String(children);
      const id = generateHeadingId(text);
      return (
        <h4
          id={id}
          className="text-base sm:text-lg md:text-xl font-semibold mt-4 mb-2 scroll-mt-16 sm:scroll-mt-20"
          {...props}
        >
          {children}
        </h4>
      );
    },
    h5: ({ children, ...props }: React.ComponentProps<"h5">) => {
      const text = String(children);
      const id = generateHeadingId(text);
      return (
        <h5
          id={id}
          className="text-sm sm:text-base md:text-lg font-semibold mt-3 sm:mt-4 mb-2 scroll-mt-16 sm:scroll-mt-20"
          {...props}
        >
          {children}
        </h5>
      );
    },
    h6: ({ children, ...props }: React.ComponentProps<"h6">) => {
      const text = String(children);
      const id = generateHeadingId(text);
      return (
        <h6
          id={id}
          className="text-xs sm:text-sm md:text-base font-semibold mt-3 mb-2 scroll-mt-16 sm:scroll-mt-20"
          {...props}
        >
          {children}
        </h6>
      );
    },
    p: ({ children, ...props }: React.ComponentProps<"p">) => (
      <p
        className="mb-3 sm:mb-4 leading-6 sm:leading-7 text-foreground text-sm sm:text-base"
        {...props}
      >
        {children}
      </p>
    ),
    a: ({ href, children, ...props }: React.ComponentProps<"a">) => {
      if (!href) {
        return (
          <span className="text-muted-foreground" {...props}>
            {children}
          </span>
        );
      }

      if (href.startsWith("#")) {
        const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
          e.preventDefault();
          e.stopPropagation();

          const targetId = href.replace("#", "").trim();
          if (!targetId) return;

          let element = document.getElementById(targetId);

          if (!element) {
            const normalizedId = targetId
              .toLowerCase()
              .replace(/[^\w\s-]/g, "")
              .replace(/\s+/g, "-")
              .replace(/-+/g, "-")
              .trim();

            if (normalizedId) {
              element = document.getElementById(normalizedId);
            }
          }

          if (!element) {
            const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
            headings.forEach((heading) => {
              if (heading.id && heading.id.includes(targetId)) {
                element = heading as HTMLElement;
              }
            });
          }

          if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition =
              elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: Math.max(0, offsetPosition),
              behavior: "smooth",
            });
          }
        };

        return (
          <a
            href={href}
            onClick={handleHashClick}
            className="text-primary underline decoration-primary/50 hover:decoration-primary hover:text-primary/90 cursor-pointer font-medium wrap-break-words transition-colors"
            {...props}
          >
            {children}
          </a>
        );
      }

      if (
        !href.startsWith("http") &&
        !href.startsWith("//") &&
        !href.startsWith("#") &&
        !href.startsWith("mailto:") &&
        !href.startsWith("tel:")
      ) {
        if (
          !isValidGitHubIdentifier(repositoryInfo?.owner) ||
          !isValidGitHubIdentifier(repositoryInfo?.repo)
        ) {
          return (
            <span className="text-muted-foreground" {...props}>
              {children}
            </span>
          );
        }

        const branch = isValidGitHubIdentifier(repositoryInfo.branch)
          ? repositoryInfo.branch || "main"
          : "main";
        const cleanHref = sanitizePath(
          href.startsWith("/") ? href.slice(1) : href
        );

        if (!cleanHref) {
          return (
            <span className="text-muted-foreground" {...props}>
              {children}
            </span>
          );
        }

        const githubUrl = `https://github.com/${repositoryInfo.owner}/${repositoryInfo.repo}/blob/${branch}/${cleanHref}`;
        return (
          <a
            href={githubUrl}
            rel="noopener noreferrer"
            target="_blank"
            className="text-primary underline decoration-primary/50 hover:decoration-primary hover:text-primary/90 cursor-pointer font-medium wrap-break-words transition-colors"
            {...props}
          >
            {children}
          </a>
        );
      }

      if (href.startsWith("http://")) {
        const httpsUrl = href.replace("http://", "https://");
        if (isValidUrl(httpsUrl)) {
          return (
            <a
              href={httpsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline decoration-primary/50 hover:decoration-primary hover:text-primary/90 cursor-pointer font-medium wrap-break-words transition-colors"
              {...props}
            >
              {children}
            </a>
          );
        }
      }

      if (isValidUrl(href) || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return (
          <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="text-primary underline decoration-primary/50 hover:decoration-primary hover:text-primary/90 cursor-pointer font-medium wrap-break-words transition-colors"
            {...props}
          >
            {children}
          </a>
        );
      }

      return (
        <span className="text-muted-foreground" {...props}>
          {children}
        </span>
      );
    },
    ul: ({ children, ...props }: React.ComponentProps<"ul">) => (
      <ul
        className="mb-3 sm:mb-4 ml-4 sm:ml-6 list-disc space-y-1 sm:space-y-2"
        {...props}
      >
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: React.ComponentProps<"ol">) => (
      <ol
        className="mb-3 sm:mb-4 ml-4 sm:ml-6 list-decimal space-y-1 sm:space-y-2"
        {...props}
      >
        {children}
      </ol>
    ),
    li: ({ children, ...props }: React.ComponentProps<"li">) => (
      <li
        className="leading-6 sm:leading-7 text-sm sm:text-base"
        {...props}
      >
        {children}
      </li>
    ),
    code: ({
      className,
      children,
      ...props
    }: React.ComponentProps<"code">) => {
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "";
      const isInline = !className || !language;

      if (isInline) {
        return (
          <code
            className="px-1 sm:px-1.5 py-0.5 rounded bg-muted text-xs sm:text-sm font-mono text-foreground wrap-break-words"
            {...props}
          >
            {children}
          </code>
        );
      }

      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    pre: ({ children, ...props }: React.ComponentProps<"pre">) => {
      if (!children || !React.isValidElement(children)) {
        return (
          <pre
            className="mb-3 sm:mb-4 p-2 sm:p-4 rounded-lg bg-muted overflow-x-auto border border-border text-xs sm:text-sm"
            {...props}
          >
            {children}
          </pre>
        );
      }

      const codeElement = children as React.ReactElement<
        React.ComponentProps<"code">
      >;

      const className = codeElement?.props?.className || "";
      const match = /language-(\w+)/.exec(className);
      const language = match ? match[1] : "";

      const isValidLanguage =
        /^[a-zA-Z0-9+_-]+$/.test(language) && language.length <= 50;

      if (isValidLanguage && codeElement?.props?.children) {
        const codeContent = String(codeElement.props.children).replace(
          /\n$/,
          ""
        );
        const maxCodeLength = 100000;
        const displayContent =
          codeContent.length > maxCodeLength
            ? codeContent.substring(0, maxCodeLength) + "\n... (truncated)"
            : codeContent;

        return (
          <div className="mb-3 sm:mb-4 rounded-lg border border-border overflow-hidden">
            <SyntaxHighlighter
              language={language}
              style={oneDark}
              PreTag="div"
              className="m-0! p-4! text-xs sm:text-sm"
              codeTagProps={{
                style: {
                  background: "transparent",
                },
              }}
            >
              {displayContent}
            </SyntaxHighlighter>
          </div>
        );
      }

      return (
        <pre
          className="mb-3 sm:mb-4 p-2 sm:p-4 rounded-lg bg-muted overflow-x-auto border border-border text-xs sm:text-sm"
          {...props}
        >
          {children}
        </pre>
      );
    },
    blockquote: ({ children, ...props }: React.ComponentProps<"blockquote">) => (
      <blockquote
        className="mb-3 sm:mb-4 pl-3 sm:pl-4 border-l-4 border-primary/50 italic text-muted-foreground text-sm sm:text-base"
        {...props}
      >
        {children}
      </blockquote>
    ),
    img: ({ src, alt, ...props }: React.ComponentProps<"img">) => {
      if (!src || typeof src !== "string") {
        return null;
      }

      if (src.startsWith("data:image/")) {
        const sanitizedDataUri = sanitizeDataUri(src);
        if (!sanitizedDataUri) {
          return (
            <div className="mb-3 sm:mb-4 p-4 rounded-lg border border-border bg-muted text-sm text-muted-foreground">
              Image too large or invalid format
            </div>
          );
        }
        return (
          <img
            src={sanitizedDataUri}
            alt={alt || ""}
            className="mb-3 sm:mb-4 rounded-lg border border-border max-w-full h-auto"
            loading="lazy"
            {...props}
          />
        );
      }

      if (
        src.startsWith("http://") ||
        src.startsWith("https://") ||
        src.startsWith("//")
      ) {
        let safeSrc = src;
        if (src.startsWith("http://")) {
          safeSrc = src.replace("http://", "https://");
        } else if (src.startsWith("//")) {
          safeSrc = `https:${src}`;
        }

        const githubBlobMatch = safeSrc.match(
          /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/
        );

        if (githubBlobMatch) {
          const [, owner, repo, branch, path] = githubBlobMatch;
          if (
            isValidGitHubIdentifier(owner) &&
            isValidGitHubIdentifier(repo) &&
            isValidGitHubIdentifier(branch)
          ) {
            const sanitizedPath = sanitizePath(path);
            if (sanitizedPath) {
              const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${sanitizedPath}`;
              return (
                <img
                  src={rawUrl}
                  alt={alt || ""}
                  className="mb-3 sm:mb-4 rounded-lg border border-border max-w-full h-auto"
                  loading="lazy"
                  {...props}
                />
              );
            }
          }
        }

        if (isValidUrl(safeSrc)) {
          return (
            <img
              src={safeSrc}
              alt={alt || ""}
              className="mb-3 sm:mb-4 rounded-lg border border-border max-w-full h-auto"
              loading="lazy"
              {...props}
            />
          );
        }

        return (
          <div className="mb-3 sm:mb-4 p-4 rounded-lg border border-border bg-muted text-sm text-muted-foreground">
            Invalid image URL
          </div>
        );
      }

      if (
        !isValidGitHubIdentifier(repositoryInfo?.owner) ||
        !isValidGitHubIdentifier(repositoryInfo?.repo)
      ) {
        return (
          <div className="mb-3 sm:mb-4 p-4 rounded-lg border border-border bg-muted text-sm text-muted-foreground">
            Invalid repository information
          </div>
        );
      }

      const branch = isValidGitHubIdentifier(repositoryInfo.branch)
        ? repositoryInfo.branch || "main"
        : "main";
      const cleanSrc = sanitizePath(src.replace(/^\.\//, ""));

      if (!cleanSrc) {
        return (
          <div className="mb-3 sm:mb-4 p-4 rounded-lg border border-border bg-muted text-sm text-muted-foreground">
            Invalid image path
          </div>
        );
      }

      const githubRawUrl = `https://raw.githubusercontent.com/${repositoryInfo.owner}/${repositoryInfo.repo}/${branch}/${cleanSrc}`;

      return (
        <img
          src={githubRawUrl}
          alt={alt || ""}
          className="mb-3 sm:mb-4 rounded-lg border border-border max-w-full h-auto"
          loading="lazy"
          {...props}
        />
      );
    },
    table: ({ children, ...props }: React.ComponentProps<"table">) => (
      <div className="mb-3 sm:mb-4 overflow-x-auto -mx-2 sm:mx-0">
        <table
          className="min-w-full border-collapse border border-border rounded-lg text-sm sm:text-base"
          {...props}
        >
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }: React.ComponentProps<"thead">) => (
      <thead className="bg-muted" {...props}>
        {children}
      </thead>
    ),
    th: ({ children, ...props }: React.ComponentProps<"th">) => (
      <th
        className="border border-border px-2 sm:px-4 py-1.5 sm:py-2 text-left font-semibold text-xs sm:text-sm"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }: React.ComponentProps<"td">) => (
      <td
        className="border border-border px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm"
        {...props}
      >
        {children}
      </td>
    ),
    hr: ({ ...props }: React.ComponentProps<"hr">) => (
      <hr className="my-6 sm:my-8 border-border" {...props} />
    ),
  };
}

