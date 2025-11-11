import { createContext, useContext, useState, ReactNode } from 'react';

export interface RepositoryInfo {
  owner: string;
  repo: string;
  branch?: string;
}

interface RepositoryContextType {
  repositoryInfo: RepositoryInfo;
  setRepositoryInfo: (info: RepositoryInfo) => void;
}

const defaultRepository: RepositoryInfo = {
  owner: 'avelino',
  repo: 'awesome-go',
  branch: 'main'
};

const RepositoryContext = createContext<RepositoryContextType | undefined>(undefined);

export function RepositoryProvider({ children }: { children: ReactNode }) {
  const [repositoryInfo, setRepositoryInfo] = useState<RepositoryInfo>(defaultRepository);

  return (
    <RepositoryContext.Provider value={{ repositoryInfo, setRepositoryInfo }}>
      {children}
    </RepositoryContext.Provider>   
  );
}

export function useRepository() {
  const context = useContext(RepositoryContext);
  if (!context) {
    throw new Error('useRepository must be used within a RepositoryProvider');
  }
  return context;
}
