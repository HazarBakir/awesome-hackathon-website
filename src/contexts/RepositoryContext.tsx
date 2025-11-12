import { useState } from "react";
import type { ReactNode } from "react";
import { RepositoryContext } from "./RepositoryContextBase";

export interface RepositoryInfo {
  owner: string;
  repo: string;
  branch?: string;
}

export interface RepositoryContextType {
  repositoryInfo: RepositoryInfo;
  setRepositoryInfo: (info: RepositoryInfo) => void;
}

const defaultRepository: RepositoryInfo = {
  owner: "hazarbakir",
  repo: "Awesome-Hackathon",
  branch: "main",
};

export function RepositoryProvider({ children }: { children: ReactNode }) {
  const [repositoryInfo, setRepositoryInfo] =
    useState<RepositoryInfo>(defaultRepository);

  return (
    <RepositoryContext.Provider value={{ repositoryInfo, setRepositoryInfo }}>
      {children}
    </RepositoryContext.Provider>
  );
}