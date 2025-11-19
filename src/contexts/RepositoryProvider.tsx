import { type RepositoryInfo } from "@/types";
import { useState, type ReactNode } from "react";
import { RepositoryContext } from "./RepositoryContext";

const defaultRepository: RepositoryInfo = {
    owner: "Happyhackingspace",
    repo: "awesome-hackathon",
    branch: "main",
  };
  
  export function RepositoryProvider({ children }: { children: ReactNode }) {
    const [repositoryInfo, setRepositoryInfo] = useState<RepositoryInfo>(defaultRepository);
  
    return (
      <RepositoryContext.Provider value={{ repositoryInfo, setRepositoryInfo }}>
        {children}
      </RepositoryContext.Provider>
    );
  }