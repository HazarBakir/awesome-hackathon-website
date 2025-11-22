import { useEffect, useMemo, useRef } from "react";

const headingRegex = /^(#{1,6})\s+(.+)$/gm;
const slug = (t: string) =>
  t
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
const headingIdsByChunk = (chunks: string[]) =>
  chunks.map((chunk) => {
    const ids: string[] = [];
    let m;
    while ((m = headingRegex.exec(chunk))) ids.push(slug(m[2].trim()));
    headingRegex.lastIndex = 0;
    return ids;
  });

export function useTOCJump(
  chunks: string[],
  idx: number,
  setIdx: (i: number) => void
) {
  const allIds = useMemo(() => headingIdsByChunk(chunks), [chunks]);
  const targetId = useRef<string | null>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      let a = e.target as HTMLElement | null;
      while (a && a.tagName !== "A" && a.parentElement) a = a.parentElement;
      if (!a || a.tagName !== "A") return;
      const href = (a as HTMLAnchorElement).getAttribute("href");
      if (!href?.startsWith("#")) return;
      const tid = decodeURIComponent(href.slice(1));
      if (allIds[idx]?.includes(tid)) return;
      for (let i = 0; i < allIds.length; i++) {
        if (allIds[i].includes(tid)) {
          e.preventDefault();
          targetId.current = tid;
          setIdx(i);
          break;
        }
      }
    }
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [allIds, setIdx, idx]);

  useEffect(() => {
    const id = targetId.current;
    if (id)
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          targetId.current = null;
        }
      }, 50);
  }, [idx]);
}
