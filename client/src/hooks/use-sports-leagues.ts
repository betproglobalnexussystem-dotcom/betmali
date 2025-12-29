import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useSports() {
  return useQuery({
    queryKey: [api.sports.list.path],
    queryFn: async () => {
      const res = await fetch(api.sports.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch sports");
      return api.sports.list.responses[200].parse(await res.json());
    },
  });
}

export function useLeagues() {
  return useQuery({
    queryKey: [api.leagues.list.path],
    queryFn: async () => {
      const res = await fetch(api.leagues.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch leagues");
      return api.leagues.list.responses[200].parse(await res.json());
    },
  });
}
