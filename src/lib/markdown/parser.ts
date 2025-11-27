import type { ReadmeSection, TOCItem } from "@/types";
import { generateHeadingId } from "@/utils";

const HEADING_REGEX = /^(#{1,6})\s+(.+)$/;

export function parseReadmeSections(markdown: string): ReadmeSection[] {
  if (!markdown) {
    return [];
  }

  const lines = markdown.split(/\r?\n/);
  const sections: ReadmeSection[] = [];
  let currentHeading = "";
  let currentDescriptionLines: string[] = [];

  for (const line of lines) {
    const headingMatch = HEADING_REGEX.exec(line);

    if (headingMatch) {
      if (currentHeading || currentDescriptionLines.length > 0) {
        sections.push({
          heading: currentHeading,
          description: currentDescriptionLines.join("\n").trim(),
        });
      }
      currentHeading = headingMatch[2].trim();
      currentDescriptionLines = [];
    } else {
      currentDescriptionLines.push(line);
    }
  }

  if (
    currentHeading ||
    currentDescriptionLines.some((line) => line.trim() !== "")
  ) {
    sections.push({
      heading: currentHeading,
      description: currentDescriptionLines.join("\n").trim(),
    });
  }

  return sections.filter(
    (section) => section.heading !== "" || section.description !== ""
  );
}

export function parseTOC(markdown: string): TOCItem[] {
  if (!markdown) {
    return [];
  }

  const lines = markdown.split(/\r?\n/);
  const toc: TOCItem[] = [];
  let inCodeBlock = false;
  let codeBlockFence = "";

  for (const line of lines) {
    const fenceMatch = line.match(/^(\s*)(`{3,}|~{3,})(.*)$/);
    if (fenceMatch) {
      if (inCodeBlock && fenceMatch[2] === codeBlockFence) {
        inCodeBlock = false;
        codeBlockFence = "";
      } else if (!inCodeBlock) {
        inCodeBlock = true;
        codeBlockFence = fenceMatch[2];
      }
      continue;
    }

    if (inCodeBlock) {
      continue;
    }

    const headingMatch = HEADING_REGEX.exec(line);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const id = generateHeadingId(text);

      toc.push({ level, text, id });
    }
  }

  return toc;
}
