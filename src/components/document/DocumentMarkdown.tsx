import remarkEmoji from "remark-emoji";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useRepository } from "@/hooks/useRepository";
import { createMarkdownComponents } from "./markdownComponents";
import React, { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { splitMarkdown } from "@/utils/markdownSplit";
import { patchImages } from "@/utils/patchImages";
import { useTOCJump } from "@/hooks/useTOCJump";
import type { RepositoryInfo } from "@/types";

function NavButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant={disabled ? "outline" : "default"}
      className={disabled ? "opacity-50 cursor-not-allowed" : "font-semibold"}
      type="button"
      size="sm"
    >
      {children}
    </Button>
  );
}

function PaginationNav({
  idx,
  setIdx,
  total,
}: {
  idx: number;
  setIdx: React.Dispatch<React.SetStateAction<number>>;
  total: number;
}) {
  const handlePrev = useCallback(() => {
    setIdx((prev) => {
      const next = Math.max(0, prev - 1);
      if (next !== prev) {
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 0);
      }
      return next;
    });
  }, [setIdx]);

  const handleNext = useCallback(() => {
    setIdx((prev) => {
      const next = Math.min(total - 1, prev + 1);
      if (next !== prev) {
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 0);
      }
      return next;
    });
  }, [setIdx, total]);

  return (
    <div className="flex justify-between items-center gap-2 my-2">
      <NavButton onClick={handlePrev} disabled={idx === 0}>
        &#8592; Previous
      </NavButton>
      <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300 select-none">
        Page {idx + 1} / {total}
      </span>
      <NavButton onClick={handleNext} disabled={idx === total - 1}>
        Next &#8594;
      </NavButton>
    </div>
  );
}

export function DocumentMarkdown({ markdown }: { markdown: string }) {
  const { repositoryInfo } = useRepository();
  const [idx, setIdx] = useState(0);
  const chunks = useMemo(() => splitMarkdown(markdown), [markdown]);
  // Perform the validation after hooks to avoid calling hooks conditionally (lint error)
  const isRepoInvalid =
    !repositoryInfo ||
    typeof repositoryInfo.owner !== "string" ||
    typeof repositoryInfo.repo !== "string";
  useTOCJump(chunks, idx, setIdx);

  // Use non-null assertion since we check validity below
  const repo = repositoryInfo as RepositoryInfo;
  const md = useMemo(
    () => (isRepoInvalid ? "" : patchImages(chunks[idx] || "", repo)),
    [chunks, idx, repo, isRepoInvalid]
  );
  const components = useMemo(
    () =>
      isRepoInvalid ? {} : createMarkdownComponents({ repositoryInfo: repo }),
    [repo, isRepoInvalid]
  );

  if (isRepoInvalid)
    return (
      <div className="text-destructive p-4">Invalid repository information</div>
    );

  const Markup = (
    <ReactMarkdown
      remarkPlugins={[remarkEmoji, remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={components}
    >
      {md}
    </ReactMarkdown>
  );

  return (
    <div className="document-markdown w-full max-w-4xl mx-auto px-2 sm:px-4 [&>h1:first-child]:mt-0 [&>h2:first-child]:mt-0 [&>h3:first-child]:mt-0 [&>h4:first-child]:mt-0 [&>h5:first-child]:mt-0 [&>h6:first-child]:mt-0">
      {chunks.length > 1 && (
        <PaginationNav idx={idx} setIdx={setIdx} total={chunks.length} />
      )}
      {Markup}
      {chunks.length > 1 && (
        <PaginationNav idx={idx} setIdx={setIdx} total={chunks.length} />
      )}
    </div>
  );
}
