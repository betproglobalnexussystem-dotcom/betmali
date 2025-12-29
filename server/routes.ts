import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Virtual Soccer Proxy
  app.get("/api/proxy/virtual-offer", async (_req, res) => {
    try {
      const response = await fetch("https://www.fortebet.ug/api/web/v1/virtual-soccer/offer");
      const data = await response.json();
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch virtual offer" });
    }
  });

  app.get("/api/proxy/virtual-timing", async (_req, res) => {
    try {
      const response = await fetch("https://zweb4ug.com/forteugvideo/api.php/timing");
      const data = await response.json();
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch virtual timing" });
    }
  });

  // Sports
  app.get(api.sports.list.path, async (_req, res) => {
    const data = await storage.getSports();
    res.json(data);
  });

  // Leagues
  app.get(api.leagues.list.path, async (_req, res) => {
    const data = await storage.getLeagues();
    res.json(data);
  });

  // Matches
  app.get(api.matches.list.path, async (req, res) => {
    const isLive = req.query.isLive === 'true';
    const isHighlight = req.query.isHighlight === 'true';
    const league = req.query.league as string;
    const data = await storage.getMatches({ isLive, isHighlight, league });
    res.json(data);
  });

  app.get(api.matches.get.path, async (req, res) => {
    const match = await storage.getMatch(req.params.id);
    if (!match) return res.status(404).json({ message: "Match not found" });
    res.json(match);
  });

  app.get("/api/counters", async (_req, res) => {
    try {
      const response = await fetch('https://betmaster.com/api/feed/sr/matches/counters?market=other');
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching counters:', error);
      res.status(500).json({ error: 'Failed to fetch counters' });
    }
  });

  app.get("/api/proxy/location", async (_req, res) => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch location' });
    }
  });

  // Bets
  app.post(api.bets.create.path, async (req, res) => {
    try {
      const input = api.bets.create.input.parse(req.body);
      const bet = await storage.createBet(input);
      res.status(201).json(bet);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.bets.list.path, async (_req, res) => {
    const bets = await storage.getBets();
    res.json(bets);
  });

  return httpServer;
}
