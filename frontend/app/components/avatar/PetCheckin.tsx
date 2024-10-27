import { useEffect } from "react";
import { useFetcher } from "@remix-run/react";

interface PetCheckinProps {
  userId: string;
}

export function PetCheckin({ userId }: PetCheckinProps) {
  const fetcher = useFetcher();

  useEffect(() => {
    const lastCheckIn = localStorage.getItem('lastPetCheckIn');
    const now = Date.now();

    if (!lastCheckIn || now - parseInt(lastCheckIn, 10) > 1209600000) { // 14 days in ms
      fetcher.submit(
        { 
          intent: "petCheckIn",
          userId 
        },
        { method: "POST" }
      );
      localStorage.setItem('lastPetCheckIn', now.toString());
    }
  }, [userId, fetcher]);

  // This component doesn't render anything visible
  return null;
}
