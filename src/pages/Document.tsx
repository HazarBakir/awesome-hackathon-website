import { useState, useEffect, useRef, Fragment } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DocumentMarkdown } from "@/components/document/DocumentMarkdown";
import { useRepository } from "@/hooks/useRepository";
import { FetchReadme } from "@/lib/github";
import { parseTOC } from "@/lib/parser";
import { type TOCItem } from "@/types";

import { GitHubLogoIcon } from "@radix-ui/react-icons";

export default function Page() {
  const { repositoryInfo } = useRepository();
  const [markdown, setMarkdown] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeHeadingId, setActiveHeadingId] = useState<string>("");
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadReadme() {
      try {
        setIsLoading(true);
        setError(null);
        const content = await FetchReadme(repositoryInfo);
        setMarkdown(content);

        const parsedTOC = parseTOC(content);
        setTocItems(parsedTOC);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load README content";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    loadReadme();
  }, [repositoryInfo]);

  useEffect(() => {
    if (!markdown || isLoading) return;

    const handleScroll = () => {
      if (!contentRef.current) return;

      const headings = Array.from(
        contentRef.current.querySelectorAll("h1, h2, h3, h4, h5, h6")
      ) as HTMLElement[];

      if (headings.length === 0) {
        setActiveHeadingId("");
        return;
      }

      const scrollY = window.scrollY;
      const headerOffset = 100;
      const threshold = scrollY + headerOffset;

      let activeHeading: HTMLElement | null = null;

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        const rect = heading.getBoundingClientRect();
        const headingTop = scrollY + rect.top;

        if (headingTop <= threshold) {
          activeHeading = heading;
          break;
        }
      }

      if (!activeHeading && headings.length > 0) {
        const firstHeading = headings[0];
        const firstRect = firstHeading.getBoundingClientRect();
        if (scrollY + firstRect.top > threshold) {
          setActiveHeadingId("");
          return;
        }
        activeHeading = firstHeading;
      }

      if (activeHeading && activeHeading.id) {
        setActiveHeadingId(activeHeading.id);
      } else {
        setActiveHeadingId("");
      }
    };

    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", throttledScroll);
    };
  }, [markdown, isLoading]);

  const getBreadcrumbPath = (): { title: string; id: string }[] => {
    const path: { title: string; id: string }[] = [];

    if (!activeHeadingId || tocItems.length === 0) {
      path.push({ title: "README", id: "" });
      return path;
    }

    const activeIndex = tocItems.findIndex(
      (item) => item.id === activeHeadingId
    );

    if (activeIndex === -1) {
      path.push({ title: "README", id: "" });
      return path;
    }

    const activeItem = tocItems[activeIndex];
    const activeLevel = activeItem.level;

    const pathItems: TOCItem[] = [];

    if (activeLevel > 1) {
      pathItems.push(activeItem);
    }

    for (let i = activeIndex - 1; i >= 0; i--) {
      const item = tocItems[i];
      if (item.level < activeLevel && item.level > 1) {
        const hasHigherLevel = pathItems.some((p) => p.level <= item.level);
        if (!hasHigherLevel) {
          pathItems.unshift(item);
        }
      }
    }

    pathItems.forEach((item) => {
      path.push({ title: item.text, id: item.id });
    });

    if (path.length === 0) {
      path.push({ title: "README", id: "" });
    }

    return path;
  };

  const breadcrumbPath = getBreadcrumbPath();

  // Compute the GitHub repo URL from repositoryInfo
  const githubUrl =
    repositoryInfo.owner && repositoryInfo.repo
      ? `https://github.com/${repositoryInfo.owner}/${repositoryInfo.repo}`
      : null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 z-10 flex h-14 md:h-16 shrink-0 items-center gap-2 border-b px-2 sm:px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 sm:mr-2 h-4" />
          <Breadcrumb className="flex-1 min-w-0">
            <BreadcrumbList className="flex-wrap gap-1">
              {breadcrumbPath.map((item, index) => (
                <Fragment key={`${item.id}-${index}`}>
                  {index > 0 && (
                    <BreadcrumbSeparator className="hidden sm:block" />
                  )}
                  <BreadcrumbItem className="max-w-[200px] sm:max-w-none">
                    {item.id && index < breadcrumbPath.length - 1 ? (
                      <BreadcrumbLink
                        href={`#${item.id}`}
                        className="truncate text-xs sm:text-sm"
                        onClick={(e) => {
                          e.preventDefault();
                          const element = document.getElementById(item.id);
                          if (element) {
                            element.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }
                        }}
                      >
                        {item.title}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage className="truncate text-xs sm:text-sm">
                        {item.title}
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View this repository on GitHub"
              className="ml-auto flex items-center justify-center rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              title="View this repository on GitHub"
            >
              <GitHubLogoIcon width={24} height={24} />
              <span className="sr-only">View this repository on GitHub</span>
            </a>
          )}
        </header>
        <div
          ref={contentRef}
          className="flex flex-1 flex-col gap-4 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-12"
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full min-h-[200px]">
              <div className="text-muted-foreground text-sm sm:text-base">
                Loading README...
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full min-h-[200px]">
              <div className="text-destructive text-sm sm:text-base px-4 text-center">
                {error}
              </div>
            </div>
          ) : (
            <DocumentMarkdown markdown={markdown} />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
