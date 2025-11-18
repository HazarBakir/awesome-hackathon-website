import * as React from "react";
import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

import { SearchForm } from "@/components/layout/SearchForm";
import { VersionSwitcher } from "@/components/document/VersionSwitcher";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useRepository } from "@/hooks/useRepository";
import { FetchReadme, FetchBranches } from "@/lib/github";
import { parseTOC } from "@/lib/parser";
import { type TOCItem } from "@/types";

interface NavSubItem {
  title: string;
  url: string;
  level: number;
  isActive?: boolean;
  children?: NavSubItem[];
}

interface NavItem {
  title: string;
  url: string;
  items?: NavSubItem[];
}

function handleLinkClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  e.preventDefault();
  const targetId = href.replace("#", "");
  const element = document.getElementById(targetId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function convertTOCToNavItems(tocItems: TOCItem[]): NavItem[] {
  const navItems: NavItem[] = [];
  let currentParent: NavItem | null = null;
  const parentStack: NavSubItem[] = [];

  for (const item of tocItems) {
    if (item.level === 1) {
      parentStack.length = 0;
      currentParent = {
        title: item.text,
        url: `#${item.id}`,
        items: [],
      };
      navItems.push(currentParent);
    } else if (item.level >= 2 && currentParent) {
      while (
        parentStack.length > 0 &&
        parentStack[parentStack.length - 1].level >= item.level
      ) {
        parentStack.pop();
      }

      const newItem: NavSubItem = {
        title: item.text,
        url: `#${item.id}`,
        level: item.level,
      };

      if (item.level === 2) {
        currentParent.items?.push(newItem);
        parentStack.push(newItem);
      } else {
        if (parentStack.length > 0) {
          const parent = parentStack[parentStack.length - 1];
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(newItem);
          parentStack.push(newItem);
        } else {
          currentParent.items?.push(newItem);
        }
      }
    }
  }

  return navItems;
}

function renderNavSubItems(items: NavSubItem[] | undefined): React.ReactNode {
  if (!items || items.length === 0) return null;

  return (
    <>
      {items.map((subItem) => {
        const hasChildren = subItem.children && subItem.children.length > 0;

        if (hasChildren) {
          return (
            <Collapsible
              key={subItem.url}
              defaultOpen
              className="group/subcollapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="w-full justify-between min-w-0">
                    <a
                      href={subItem.url}
                      className="flex-1 text-left truncate min-w-0 font-normal"
                      onClick={(e) => handleLinkClick(e, subItem.url)}
                      title={subItem.title}
                    >
                      {subItem.title}
                    </a>
                    <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/subcollapsible:rotate-90 shrink-0" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </SidebarMenuItem>
              <CollapsibleContent>
                <div className="pl-4">
                  <SidebarMenu>
                    {subItem.children?.map((child) => (
                      <SidebarMenuItem key={child.url}>
                        <SidebarMenuButton asChild>
                          <a
                            href={child.url}
                            onClick={(e) => handleLinkClick(e, child.url)}
                            className="truncate font-normal"
                            title={child.title}
                          >
                            {child.title}
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        } else {
          return (
            <SidebarMenuItem key={subItem.url}>
              <SidebarMenuButton asChild isActive={subItem.isActive}>
                <a
                  href={subItem.url}
                  onClick={(e) => handleLinkClick(e, subItem.url)}
                  className="truncate font-normal"
                  title={subItem.title}
                >
                  {subItem.title}
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        }
      })}
    </>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { repositoryInfo, setRepositoryInfo } = useRepository();
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [branches, setBranches] = useState<string[]>([]);

  useEffect(() => {
    async function loadBranches() {
      try {
        const branchList = await FetchBranches(repositoryInfo);
        setBranches(branchList);
      } catch (error) {
        setBranches([repositoryInfo.branch || "main"]);
        console.log(error);
      }
    }

    loadBranches();
  }, [repositoryInfo]);

  useEffect(() => {
    async function loadReadmeTOC() {
      try {
        setIsLoading(true);
        const markdown = await FetchReadme(repositoryInfo);
        const tocItems = parseTOC(markdown);
        const convertedNavItems = convertTOCToNavItems(tocItems);
        setNavItems(convertedNavItems);
      } catch (error) {
        console.log(error);
        setNavItems([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadReadmeTOC();
  }, [repositoryInfo]);

  const handleBranchChange = (branch: string) => {
    setRepositoryInfo({
      ...repositoryInfo,
      branch: branch,
    });
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={branches}
          defaultVersion={repositoryInfo.branch || "main"}
          onVersionChange={handleBranchChange}
        />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent className="gap-0 [&>div:first-child>div]:mt-0">
        {isLoading ? (
          <div className="p-4 text-sm text-muted-foreground">Loading...</div>
        ) : navItems.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">
            No content available
          </div>
        ) : (
          navItems.map((item, index) => (
            <Collapsible
              key={item.title}
              title={item.title}
              defaultOpen
              className={`group/collapsible ${
                index === 0 ? "[&>div]:mt-0" : ""
              }`}
            >
              <SidebarGroup>
                <SidebarGroupLabel
                  asChild
                  className={`group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm font-semibold ${
                    index === 0 ? "pl-0" : ""
                  }`}
                >
                  <CollapsibleTrigger className="flex items-center w-full min-w-0">
                    <a
                      href={item.url}
                      onClick={(e) => handleLinkClick(e, item.url)}
                      className="flex-1 text-left truncate min-w-0 font-semibold"
                      title={item.title}
                    >
                      {item.title}
                    </a>
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90 shrink-0" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>{renderNavSubItems(item.items)}</SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          ))
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
