import { createContext, useContext, useState, useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import type { User } from "~/types/auth";

interface UserContextValue {
  user: User | null;
  contributions: {
    research: number;
    patents: number;
    community: number;
    compute: number;
    mentorship: number;
  };
  collaborativeScore: number;
  learningPath: {
    currentLevel: number;
    skills: string[];
    certificates: string[];
    mentees: string[];
    mentors: string[];
  };
  economicBenefits: {
    ubiEarnings: number;
    patentRevenue: number;
    computeCredits: number;
    stakingRewards: number;
  };
  preferences: {
    collaborationStyle: "solo" | "team" | "hybrid";
    learningPace: "self-paced" | "structured" | "intensive";
    communicationMode: "async" | "sync" | "mixed";
    privacySettings: {
      profileVisibility: "public" | "community" | "private";
      contributionDisplay: boolean;
      learningPathShare: boolean;
      economicMetricsShow: boolean;
    };
  };
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserContextValue | null>(null);
  const fetcher = useFetcher();

  useEffect(() => {
    // Fetch user data and related metrics
    fetcher.load("/api/user/profile");
  }, []);

  useEffect(() => {
    if (fetcher.data) {
      setUserData(fetcher.data);
    }
  }, [fetcher.data]);

  return (
    <UserContext.Provider value={userData}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
