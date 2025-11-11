import { formatTitle } from "@/utils/formatTitle";
import "./DocumentTOC.css";
import type { TOCItem } from "@/lib/parser";

export function DocumentTOC({ toc }: { toc: TOCItem[] }) {
  const rawTocTitle = toc[0]?.text || "Document";
  const tocTitle = formatTitle(rawTocTitle);

  const filteredToc = toc.filter((item, idx) => {
    if (idx === 0 && formatTitle(item.text) === tocTitle) return false;
    return true;
  });

  return (
    <nav className="document-toc">
      <h2 className="document-toc-title">{tocTitle}</h2>
      <ul className="document-toc-list">
        {filteredToc.map((item, index) => (
          <li
            key={index}
            className={`document-toc-item document-toc-level-${item.level}`}
          >
            <a href={`#${item.id}`} className="document-toc-link">
              {formatTitle(item.text)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
