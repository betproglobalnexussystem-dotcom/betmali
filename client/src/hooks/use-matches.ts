import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

type MatchesInput = z.infer<typeof api.matches.list.input>;

export function useMatches(filters?: MatchesInput & { league?: string | null }) {
  // Serialize filters to use as query key dependency
  const filterKey = JSON.stringify(filters);

  return useQuery({
    queryKey: [api.matches.list.path, filterKey],
    queryFn: async () => {
      // Build query string from filters
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) params.append(key, String(value));
        });
      }
      
      const url = `${api.matches.list.path}?${params.toString()}`;
      const res = await fetch(url, { credentials: "include" });
      
      if (!res.ok) throw new Error("Failed to fetch matches");
      return api.matches.list.responses[200].parse(await res.json());
    },
    // Refresh more frequently for live matches (every 10s), less frequently for others (30s)
    refetchInterval: filters?.isLive ? 10000 : 30000,
  });
}

export function useMatch(id: number) {
  return useQuery({
    queryKey: [api.matches.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.matches.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch match");
      return api.matches.get.responses[200].parse(await res.json());
    },
  });
}
