import { useFetcher } from "@remix-run/react";
import { useCallback } from "react";

export function useClientState<T>(key: string) {
  const fetcher = useFetcher();

  const setValue = useCallback((value: T) => {
    fetcher.submit(
      { [key]: JSON.stringify(value) },
      { method: "post", action: "/api/state" }
    );
  }, [fetcher, key]);

  return [fetcher.data?.[key], setValue] as const;
}
