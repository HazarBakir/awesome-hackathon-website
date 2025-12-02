import { useEffect, useCallback, useRef } from "react";
import { createHighlight, getHighlights } from "@/lib/highlights/api";
import type { Highlight } from "@/types/highlight";

function removeExistingHighlights(container: Element) {
  const highlights = container.querySelectorAll("mark[data-highlight-id]");
  highlights.forEach((mark) => {
    const parent = mark.parentNode;
    if (parent) {
      while (mark.firstChild) {
        parent.insertBefore(mark.firstChild, mark);
      }
      parent.removeChild(mark);
    }
  });
  container.normalize();
}

function applyHighlight(container: Element, highlight: Highlight) {
  const { start_offset, end_offset, color, id } = highlight;
  let absoluteOffset = 0;
  const nodes: { node: Text; start: number; end: number }[] = [];
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);

  let node: Node | null;
  while ((node = walker.nextNode())) {
    if (!node.textContent) continue;
    const length = node.textContent.length;
    nodes.push({
      node: node as Text,
      start: absoluteOffset,
      end: absoluteOffset + length,
    });
    absoluteOffset += length;
  }

  nodes.forEach(({ node, start, end }) => {
    if (end <= start_offset || start >= end_offset) return;

    const localStart = Math.max(0, start_offset - start);
    const localEnd = Math.min(node.textContent!.length, end_offset - start);

    const before = node.textContent!.slice(0, localStart);
    const middle = node.textContent!.slice(localStart, localEnd);
    const after = node.textContent!.slice(localEnd);

    const frag = document.createDocumentFragment();
    if (before) frag.appendChild(document.createTextNode(before));

    if (middle) {
      const mark = document.createElement("mark");
      mark.setAttribute("data-highlight-id", id);
      mark.style.backgroundColor = color;
      mark.style.color = "inherit";
      mark.style.padding = "0";
      mark.style.border = "none";
      mark.style.borderRadius = "0";
      mark.style.cursor = "inherit";
      mark.style.fontWeight = "inherit";
      mark.style.fontSize = "inherit";
      mark.style.lineHeight = "inherit";
      mark.style.letterSpacing = "inherit";
      mark.style.textDecoration = "none";
      mark.style.boxShadow = "none";
      mark.style.display = "inline";
      mark.style.margin = "0";
      mark.textContent = middle;
      frag.appendChild(mark);
    }

    if (after) frag.appendChild(document.createTextNode(after));

    node.parentNode?.replaceChild(frag, node);
  });
}

function getSelectionOffsets(container: HTMLElement, selection: Selection) {
  if (!selection.rangeCount) return null;
  const range = selection.getRangeAt(0);

  if (
    !container.contains(range.startContainer) ||
    !container.contains(range.endContainer)
  ) {
    return null;
  }

  let absoluteOffset = 0;
  let foundStart = false;
  let foundEnd = false;
  let selectionStart = -1,
    selectionEnd = -1;

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);

  let node: Node | null;
  while ((node = walker.nextNode())) {
    if (!node.textContent) continue;

    if (!foundStart && node === range.startContainer) {
      selectionStart = absoluteOffset + range.startOffset;
      foundStart = true;
    }
    if (!foundEnd && node === range.endContainer) {
      selectionEnd = absoluteOffset + range.endOffset;
      foundEnd = true;
    }

    absoluteOffset += node.textContent.length;
  }

  if (foundStart && foundEnd) {
    if (selectionEnd < selectionStart) {
      [selectionStart, selectionEnd] = [selectionEnd, selectionStart];
    }
    return { start: selectionStart, end: selectionEnd };
  }
  return null;
}

function isSelectionHighlighted(
  container: HTMLElement,
  selection: Selection
): boolean {
  if (!selection.rangeCount) return false;

  const offsets = getSelectionOffsets(container, selection);
  if (!offsets) return false;

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node) => {
      if (
        node.nodeName === "MARK" &&
        (node as Element).hasAttribute("data-highlight-id")
      ) {
        return NodeFilter.FILTER_ACCEPT;
      }
      return NodeFilter.FILTER_SKIP;
    },
  });

  let mark: Node | null;
  while ((mark = walker.nextNode())) {
    let markStart = -1,
      markEnd = -1;
    let offset = 0;
    let foundStart = false,
      foundEnd = false;

    const textWalker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT
    );
    let txt: Node | null;
    while ((txt = textWalker.nextNode())) {
      if (txt === mark.firstChild) {
        markStart = offset;
        foundStart = true;
      }
      if (foundStart && txt.parentNode === mark) {
        markEnd = markStart + txt.textContent!.length;
        foundEnd = true;
        break;
      }
      offset += txt.textContent?.length ?? 0;
    }
    if (foundStart && foundEnd) {
      if (!(offsets.end <= markStart || offsets.start >= markEnd)) {
        return true;
      }
    }
  }

  return false;
}

export function useHighlights(
  sessionId: string | null,
  containerRef: React.RefObject<HTMLDivElement>
) {
  const highlightsRef = useRef<Highlight[]>([]);

  const loadAndApplyHighlights = useCallback(async () => {
    if (!sessionId || !containerRef.current) return;
    removeExistingHighlights(containerRef.current);

    const highlights = await getHighlights(sessionId);
    highlightsRef.current = highlights;

    for (const highlight of highlights) {
      applyHighlight(containerRef.current, highlight);
    }
  }, [sessionId, containerRef]);

  const handleHighlight = useCallback(
    async (color: string) => {
      if (!sessionId || !containerRef.current) return;

      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || selection.rangeCount === 0)
        return;

      if (isSelectionHighlighted(containerRef.current, selection)) {
        return;
      }

      const offsets = getSelectionOffsets(containerRef.current, selection);
      if (!offsets) return;

      const { start, end } = offsets;
      if (start === end || start === -1 || end === -1) return;

      const containerText = containerRef.current.textContent || "";
      const selectedText = containerText.substring(start, end).trim();
      if (!selectedText) return;

      try {
        const highlight = await createHighlight(sessionId, {
          text: selectedText,
          startOffset: start,
          endOffset: end,
          containerXPath: "/div",
          color,
        });

        if (highlight) {
          await loadAndApplyHighlights();
        }
      } catch (error) {
        console.error("Error creating highlight:", error);
      }
    },
    [sessionId, containerRef, loadAndApplyHighlights]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      loadAndApplyHighlights();
    }, 200);

    return () => clearTimeout(timer);
  }, [loadAndApplyHighlights]);

  return { handleHighlight, reloadHighlights: loadAndApplyHighlights };
}
