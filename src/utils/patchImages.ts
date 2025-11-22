import { sanitizePath, isValidGitHubIdentifier } from "./markdownSecurity";
import type { RepositoryInfo } from "@/types";

export function patchImages(
  md: string,
  repo: Partial<Pick<RepositoryInfo, "owner" | "repo" | "branch">>
) {
  return md.replace(/!\[([^\]]*)\]\((?!http)([^)]+)\)/g, (_match, alt, src) => {
    const altT = (alt || "").trim();
    const rel = sanitizePath((src || "").trim());
    const o = isValidGitHubIdentifier(repo?.owner) && repo?.owner;
    const r = isValidGitHubIdentifier(repo?.repo) && repo?.repo;
    const b = isValidGitHubIdentifier(repo?.branch)
      ? repo?.branch || "main"
      : "main";
    if (!rel || !o || !r) return `![${altT}]()`;
    return `![${altT}](https://raw.githubusercontent.com/${o}/${r}/${b}/${rel})`;
  });
}
