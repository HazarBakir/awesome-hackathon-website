import remarkEmoji from "remark-emoji";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useRepository } from "@/hooks/useRepository";
import { generateHeadingId } from "@/utils/generateHeadingId";

export function DocumentMarkdown({ markdown }: { markdown: string }) {
  const { repositoryInfo } = useRepository();

  const processedMarkdown = markdown.replace(
    /!\[([^\]]*)\]\((?!http)([^)]+)\)/g,
    (_match: string, alt: string, src: string) => {
      const altText = (alt || "").trim();
      const relSrc = (src || "").trim();
      if (!relSrc) return `![${altText}](${relSrc})`;
      const branch = repositoryInfo.branch || "main";
      const cleanSrc = relSrc.replace(/^\/+/, "");
      const fullUrl = `https://raw.githubusercontent.com/${repositoryInfo.owner}/${repositoryInfo.repo}/${branch}/${cleanSrc}`;

      return `![${altText}](${fullUrl})`;
    }
  );

  return (
    <div className="document-markdown w-full max-w-4xl mx-auto px-2 sm:px-4 [&>h1:first-child]:mt-0 [&>h2:first-child]:mt-0 [&>h3:first-child]:mt-0 [&>h4:first-child]:mt-0 [&>h5:first-child]:mt-0 [&>h6:first-child]:mt-0">
      <ReactMarkdown
        remarkPlugins={[remarkEmoji, remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ children, ...props }) => {
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
          h2: ({ children, ...props }) => {
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
          h3: ({ children, ...props }) => {
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
          h4: ({ children, ...props }) => {
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
          h5: ({ children, ...props }) => {
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
          h6: ({ children, ...props }) => {
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
          p: ({ children, ...props }) => (
            <p
              className="mb-3 sm:mb-4 leading-6 sm:leading-7 text-foreground text-sm sm:text-base"
              {...props}
            >
              {children}
            </p>
          ),
          a: ({ href, children, ...props }) => {
            if (href && href.startsWith("#")) {
              const handleHashClick = (
                e: React.MouseEvent<HTMLAnchorElement>
              ) => {
                e.preventDefault();
                e.stopPropagation();

                const targetId = href.replace("#", "").trim();

                let element = document.getElementById(targetId);

                if (!element) {
                  const normalizedId = targetId
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, "")
                    .replace(/\s+/g, "-")
                    .replace(/-+/g, "-")
                    .trim();

                  element = document.getElementById(normalizedId);
                }

                if (!element) {
                  const headings = document.querySelectorAll(
                    "h1, h2, h3, h4, h5, h6"
                  );
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
                    top: offsetPosition,
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
              href &&
              !href.startsWith("http") &&
              !href.startsWith("//") &&
              !href.startsWith("#")
            ) {
              const branch = repositoryInfo.branch || "main";
              const cleanHref = href.startsWith("/") ? href.slice(1) : href;
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

            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline decoration-primary/50 hover:decoration-primary hover:text-primary/90 cursor-pointer font-medium wrap-break-words transition-colors"
                {...props}
              >
                {children}
              </a>
            );
          },
          ul: ({ children, ...props }) => (
            <ul
              className="mb-3 sm:mb-4 ml-4 sm:ml-6 list-disc space-y-1 sm:space-y-2"
              {...props}
            >
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol
              className="mb-3 sm:mb-4 ml-4 sm:ml-6 list-decimal space-y-1 sm:space-y-2"
              {...props}
            >
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
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
            const codeElement = children as React.ReactElement<
              React.ComponentProps<"code">
            >;
            const match = /language-(\w+)/.exec(
              codeElement?.props?.className || ""
            );
            const language = match ? match[1] : "";

            if (language && codeElement?.props?.children) {
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
                    {String(codeElement.props.children).replace(/\n$/, "")}
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
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="mb-3 sm:mb-4 pl-3 sm:pl-4 border-l-4 border-primary/50 italic text-muted-foreground text-sm sm:text-base"
              {...props}
            >
              {children}
            </blockquote>
          ),
          img: ({ src, alt, ...props }) => {
            if (!src) {
              return (
                <img
                  src={src}
                  alt={alt}
                  className="mb-3 sm:mb-4 rounded-lg border border-border max-w-full h-auto"
                  {...props}
                />
              );
            }

            if (src.startsWith("data:image/")) {
              return (
                <img
                  src={src}
                  alt={alt || ""}
                  className="mb-3 sm:mb-4 rounded-lg border border-border max-w-full h-auto"
                  {...props}
                />
              );
            }

            if (
              src.startsWith("http://") ||
              src.startsWith("https://") ||
              src.startsWith("//")
            ) {
              const githubBlobMatch = src.match(
                /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/
              );
              if (githubBlobMatch) {
                const [, owner, repo, branch, path] = githubBlobMatch;
                const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
                return (
                  <img
                    src={rawUrl}
                    alt={alt || ""}
                    className="mb-3 sm:mb-4 rounded-lg border border-border max-w-full h-auto"
                    {...props}
                  />
                );
              }

              return (
                <img
                  src={src}
                  alt={alt || ""}
                  className="mb-3 sm:mb-4 rounded-lg border border-border max-w-full h-auto"
                  {...props}
                />
              );
            }

            const branch = repositoryInfo.branch || "main";
            const cleanSrc = src.replace(/^\.\//, "").replace(/^\/+/, "");

            const githubRawUrl = `https://raw.githubusercontent.com/${repositoryInfo.owner}/${repositoryInfo.repo}/${branch}/${cleanSrc}`;

            return (
              <img
                src={githubRawUrl}
                alt={alt || ""}
                className="mb-3 sm:mb-4 rounded-lg border border-border max-w-full h-auto"
                {...props}
              />
            );
          },
          table: ({ children, ...props }) => (
            <div className="mb-3 sm:mb-4 overflow-x-auto -mx-2 sm:mx-0">
              <table
                className="min-w-full border-collapse border border-border rounded-lg text-sm sm:text-base"
                {...props}
              >
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-muted" {...props}>
              {children}
            </thead>
          ),
          th: ({ children, ...props }) => (
            <th
              className="border border-border px-2 sm:px-4 py-1.5 sm:py-2 text-left font-semibold text-xs sm:text-sm"
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td
              className="border border-border px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm"
              {...props}
            >
              {children}
            </td>
          ),
          hr: ({ ...props }) => (
            <hr className="my-6 sm:my-8 border-border" {...props} />
          ),
        }}
      >
        {processedMarkdown}
      </ReactMarkdown>
    </div>
  );
}
