import "./Document.css";
import { useEffect, useState } from "react";
import type { TOCItem } from "@/lib/parser";
import { FetchReadme } from "@/lib/github";
import { parseTOC } from "@/lib/parser";
import { DocumentContent } from "@/components/Document/DocumentContent";
import { DocumentTOC } from "@/components/Document/DocumentTOC";
import { useRepository } from "@/contexts/RepositoryContext";
import { FaGithub } from "react-icons/fa";

export default function Document() {
  const { repositoryInfo } = useRepository();
  const [markdown, setMarkdown] = useState<string>("");
  const [toc, setToc] = useState<TOCItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAndParse() {
      setLoading(true);
      setError(null);
      try {
        const markdownContent = await FetchReadme(repositoryInfo);
        setMarkdown(markdownContent);
        const tocItems = parseTOC(markdownContent);
        setToc(tocItems);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
    fetchAndParse();
  }, [repositoryInfo]);

  const githubRepoUrl = `https://github.com/${repositoryInfo.owner}/${repositoryInfo.repo}`;

  return (
    <div className="document-wrapper">
      <div className="document-container">
        <aside className="document-sidebar">
          <DocumentTOC toc={toc} />
        </aside>
        <main className="document-content">
          <div>
            <a
              className="document-github-repo-link"
              href={githubRepoUrl}
              target="_blank"
              title="GitHub Repository"
            >
              <FaGithub size={23} />
            </a>
          </div>
          <DocumentContent
            loading={loading}
            error={error}
            markdown={markdown}
          />
        </main>
      </div>
    </div>
  );
}
