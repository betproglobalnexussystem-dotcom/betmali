import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Timer, Trophy, Radio, BarChart2, Trash2, X } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { useBetslip, useAuth } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

interface VirtualMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  time: string;
  odds: {
    fullTime: { [key: string]: string };
    firstHalf: { [key: string]: string };
    totalGoals: { [key: string]: string };
    correctScore: { [key: string]: string };
    btts: { [key: string]: string };
  };
}

const VIRTUAL_MATCHES: VirtualMatch[] = [
  {
    id: "224",
    homeTeam: "V-ROMA",
    awayTeam: "V-JUVENTUS",
    time: "00:07",
    odds: {
      fullTime: { "1": "2.10", "X": "3.20", "2": "3.40" },
      firstHalf: { "1": "2.80", "X": "2.10", "2": "4.10" },
      totalGoals: { "Under 1.5": "3.10", "Over 1.5": "1.30", "Under 2.5": "1.80", "Over 2.5": "1.90", "Under 3.5": "1.25", "Over 3.5": "3.50" },
      correctScore: { "1:0": "7.0", "0:0": "9.0", "0:1": "8.5", "2:0": "11.0", "1:1": "6.5", "0:2": "13.0" },
      btts: { "Yes": "1.75", "No": "1.95" }
    }
  },
  {
    id: "225",
    homeTeam: "V-VALENCIA",
    awayTeam: "V-VILLARREAL",
    time: "00:07",
    odds: {
      fullTime: { "1": "2.50", "X": "3.10", "2": "2.80" },
      firstHalf: { "1": "3.10", "X": "2.00", "2": "3.40" },
      totalGoals: { "Under 1.5": "2.90", "Over 1.5": "1.35", "Under 2.5": "1.75", "Over 2.5": "1.95", "Under 3.5": "1.20", "Over 3.5": "4.00" },
      correctScore: { "1:0": "8.0", "0:0": "8.5", "0:1": "9.0", "2:0": "13.0", "1:1": "6.0", "0:2": "15.0" },
      btts: { "Yes": "1.80", "No": "1.90" }
    }
  },
  {
    id: "226",
    homeTeam: "V-MAN.CITY",
    awayTeam: "V-MAN.UNITED",
    time: "00:07",
    odds: {
      fullTime: { "1": "1.85", "X": "3.60", "2": "3.90" },
      firstHalf: { "1": "2.40", "X": "2.30", "2": "4.50" },
      totalGoals: { "Under 1.5": "4.20", "Over 1.5": "1.18", "Under 2.5": "2.30", "Over 2.5": "1.55", "Under 3.5": "1.45", "Over 3.5": "2.50" },
      correctScore: { "1:0": "9.0", "0:0": "15.0", "0:1": "13.0", "2:0": "9.5", "1:1": "8.0", "0:2": "22.0" },
      btts: { "Yes": "1.55", "No": "2.30" }
    }
  }
];

export function VirtualMatches() {
  const [timeLeft, setTimeLeft] = useState(7);
  const [activeView, setActiveView] = useState<"stream" | "tracker">("stream");
  const { virtualItems, virtualStake, setVirtualStake, addVirtualItem, removeVirtualItem, clearVirtual } = useBetslip();
  const { currency, user } = useAuth();
  const { toast } = useToast();

  const totalOdds = virtualItems.reduce((acc, item) => acc * item.odds, 1);
  const potentialReturn = virtualStake * totalOdds;

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handlePlaceVirtualBet = () => {
    if (virtualItems.length === 0) return;
    toast({
      title: "Virtual Bet Placed!",
      description: `Potential Return: ${formatCurrency(potentialReturn, currency)}`,
      className: "bg-primary border-none text-primary-foreground font-bold",
    });
    clearVirtual();
  };

  return (
    <div className="flex flex-col h-full bg-background animate-in fade-in duration-500">
      {/* Virtual Header */}
      <div className="flex items-center justify-between bg-card border-b border-border/50 px-4 py-2 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Time to kickoff:</span>
            <span className="text-sm font-black text-primary italic">00:0{timeLeft}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
            <Trophy className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-black text-primary uppercase italic tracking-tighter">VIRTUAL SOCCER</span>
          </div>
        </div>
        <div className="text-[10px] font-bold text-muted-foreground">
          New match <span className="text-primary font-black">every 5 minutes!</span>
        </div>
      </div>

      <div className="p-4 grid grid-cols-[1fr,300px] gap-4 overflow-auto">
        {/* Main Content: Matches Grid */}
        <div className="grid grid-cols-3 gap-3">
          {VIRTUAL_MATCHES.map((match) => (
            <div key={match.id} className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-lg shadow-black/20 hover:border-primary/30 transition-all">
              {/* Match Header */}
              <div className="bg-primary px-3 py-2 flex items-center justify-between">
                <span className="text-[9px] font-black text-primary-foreground/70">{match.id}</span>
                <div className="flex-1 flex justify-center items-center gap-2 text-[10px] font-black text-primary-foreground italic">
                  <span>{match.homeTeam}</span>
                  <span className="text-[8px] opacity-60">VS</span>
                  <span>{match.awayTeam}</span>
                </div>
              </div>

              <div className="p-2 space-y-3 bg-gradient-to-b from-card to-background">
                {/* Full Time Result */}
                <Section title="Full Time Result">
                  <div className="grid grid-cols-3 gap-1">
                    {Object.entries(match.odds.fullTime).map(([sel, val]) => (
                      <VirtualOdds 
                        key={sel} 
                        selection={sel} 
                        odds={val} 
                        isActive={virtualItems.some(i => i.matchId === Number(match.id) && i.selection === `Full Time: ${sel}`)}
                        onClick={() => addVirtualItem({
                          matchId: Number(match.id),
                          selection: `Full Time: ${sel}`,
                          odds: Number(val),
                          matchInfo: { homeTeam: match.homeTeam, awayTeam: match.awayTeam, league: "Virtual Soccer", startTime: new Date().toISOString() }
                        })}
                      />
                    ))}
                  </div>
                </Section>

                {/* 1st Half Result */}
                <Section title="1st Half Result">
                  <div className="grid grid-cols-3 gap-1">
                    {Object.entries(match.odds.firstHalf).map(([sel, val]) => (
                      <VirtualOdds 
                        key={sel} 
                        selection={sel} 
                        odds={val} 
                        isActive={virtualItems.some(i => i.matchId === Number(match.id) && i.selection === `1st Half: ${sel}`)}
                        onClick={() => addVirtualItem({
                          matchId: Number(match.id),
                          selection: `1st Half: ${sel}`,
                          odds: Number(val),
                          matchInfo: { homeTeam: match.homeTeam, awayTeam: match.awayTeam, league: "Virtual Soccer", startTime: new Date().toISOString() }
                        })}
                      />
                    ))}
                  </div>
                </Section>

                {/* Total Goals */}
                <Section title="Total Goals">
                  <div className="grid grid-cols-2 gap-1 gap-y-1.5">
                    {["Under 1.5", "Over 1.5", "Under 2.5", "Over 2.5", "Under 3.5", "Over 3.5"].map((sel) => (
                      <VirtualOdds 
                        key={sel} 
                        selection={sel} 
                        odds={match.odds.totalGoals[sel]} 
                        isActive={virtualItems.some(i => i.matchId === Number(match.id) && i.selection === `Total Goals: ${sel}`)}
                        onClick={() => addVirtualItem({
                          matchId: Number(match.id),
                          selection: `Total Goals: ${sel}`,
                          odds: Number(match.odds.totalGoals[sel]),
                          matchInfo: { homeTeam: match.homeTeam, awayTeam: match.awayTeam, league: "Virtual Soccer", startTime: new Date().toISOString() }
                        })}
                      />
                    ))}
                  </div>
                </Section>

                {/* Correct Score */}
                <Section title="Correct Score">
                  <div className="grid grid-cols-3 gap-1 gap-y-1.5">
                    {Object.entries(match.odds.correctScore).map(([sel, val]) => (
                      <VirtualOdds 
                        key={sel} 
                        selection={sel} 
                        odds={val} 
                        isActive={virtualItems.some(i => i.matchId === Number(match.id) && i.selection === `Correct Score: ${sel}`)}
                        onClick={() => addVirtualItem({
                          matchId: Number(match.id),
                          selection: `Correct Score: ${sel}`,
                          odds: Number(val),
                          matchInfo: { homeTeam: match.homeTeam, awayTeam: match.awayTeam, league: "Virtual Soccer", startTime: new Date().toISOString() }
                        })}
                      />
                    ))}
                  </div>
                </Section>

                {/* Both Teams To Score */}
                <Section title="Both Teams To Score">
                  <div className="grid grid-cols-2 gap-1">
                    {Object.entries(match.odds.btts).map(([sel, val]) => (
                      <VirtualOdds 
                        key={sel} 
                        selection={sel} 
                        odds={val} 
                        isActive={virtualItems.some(i => i.matchId === Number(match.id) && i.selection === `BTTS: ${sel}`)}
                        onClick={() => addVirtualItem({
                          matchId: Number(match.id),
                          selection: `BTTS: ${sel}`,
                          odds: Number(val),
                          matchInfo: { homeTeam: match.homeTeam, awayTeam: match.awayTeam, league: "Virtual Soccer", startTime: new Date().toISOString() }
                        })}
                      />
                    ))}
                  </div>
                </Section>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar: Stream & Tracker & VIRTUAL BETSLIP */}
        <div className="space-y-3 flex flex-col h-full overflow-hidden">
          <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-lg shrink-0">
            <div className="grid grid-cols-2 p-1 gap-1">
              <Button 
                size="sm" 
                onClick={() => setActiveView("stream")}
                className={cn(
                  "font-black text-[9px] h-7 rounded-lg transition-all",
                  activeView === "stream" ? "bg-primary text-primary-foreground shadow-sm" : "bg-transparent text-muted-foreground hover:bg-secondary/50"
                )}
              >
                STREAM
              </Button>
              <Button 
                size="sm" 
                onClick={() => setActiveView("tracker")}
                className={cn(
                  "font-black text-[9px] h-7 rounded-lg transition-all",
                  activeView === "tracker" ? "bg-primary text-primary-foreground shadow-sm" : "bg-transparent text-muted-foreground hover:bg-secondary/50"
                )}
              >
                TRACKER
              </Button>
            </div>
            
            <div className="relative group border-y border-border/30 bg-black overflow-hidden flex flex-col" style={{ width: "100%", height: "240px" }}>
              {activeView === "stream" ? (
                <>
                  <iframe 
                    src="https://zweb4ug.com/forteugvideo/index.php" 
                    className="w-full flex-1 border-0"
                    title="Virtual Livestream"
                    scrolling="no"
                  />
                  <iframe 
                    src="https://zweb4ug.com/forteugvideo/api.php/timing" 
                    className="w-full h-[30px] border-0 bg-black/90"
                    title="Timing"
                    scrolling="no"
                  />
                </>
              ) : (
                <iframe 
                  src="https://zweb4ug.com/forteug/index.php" 
                  className="w-full h-full border-0"
                  title="Tracker"
                />
              )}
            </div>
            
            <Button variant="ghost" className="w-full h-8 text-[9px] font-black text-primary border-t border-border/20 rounded-none uppercase tracking-widest bg-primary/5">
              <BarChart2 className="w-3 h-3 mr-2" />
              Expand Statistics
            </Button>
          </div>

          <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-lg p-3 space-y-3 flex flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-primary uppercase tracking-widest">BET SLIP • VIRTUAL</h3>
              {virtualItems.length > 0 && (
                <button onClick={clearVirtual} className="text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {virtualItems.length === 0 ? (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center space-y-2 flex-1 flex flex-col items-center justify-center">
                <span className="text-2xl opacity-40">🎫</span>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Your Ticket is empty</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0 gap-3">
                <div className="flex-1 overflow-auto space-y-2 pr-1">
                  {virtualItems.map((item) => (
                    <div key={`${item.matchId}-${item.selection}`} className="bg-secondary/20 border border-border/50 rounded-lg p-2 relative group animate-in slide-in-from-right-2">
                      <button 
                        onClick={() => removeVirtualItem(item.matchId, item.selection)}
                        className="absolute -top-1.5 -right-1.5 bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <span className="text-primary font-black text-[9px] uppercase leading-none">{item.selection}</span>
                        <span className="text-foreground font-mono font-bold text-[9px]">@{item.odds.toFixed(2)}</span>
                      </div>
                      <div className="text-[8px] font-bold text-muted-foreground uppercase truncate">
                        {item.matchInfo.homeTeam} vs {item.matchInfo.awayTeam}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-border/50 space-y-2 shrink-0">
                  <div className="flex justify-between items-center text-[9px] font-bold text-muted-foreground uppercase">
                    <span>Total Odds</span>
                    <span className="text-foreground font-mono">{totalOdds.toFixed(2)}</span>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-muted-foreground uppercase">Stake</label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-muted-foreground">{currency === 'UGX' ? 'Sh' : '$'}</span>
                      <Input
                        type="number"
                        value={virtualStake}
                        onChange={(e) => setVirtualStake(Number(e.target.value))}
                        className="h-8 pl-6 text-[10px] font-black bg-secondary/10 border-border/50"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 bg-primary/5 rounded px-2 border border-primary/10">
                    <span className="text-[9px] font-black text-primary uppercase">Est. Return</span>
                    <span className="text-[11px] font-black text-primary">{formatCurrency(potentialReturn, currency)}</span>
                  </div>
                  <Button 
                    onClick={handlePlaceVirtualBet}
                    className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20"
                  >
                    PLACE VIRTUAL BET
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Ticker */}
      <div className="mt-auto bg-card border-t border-border/50 px-4 py-2 flex items-center gap-4 shrink-0 overflow-hidden">
        <div className="bg-primary px-3 py-1 rounded text-[9px] font-black text-primary-foreground italic shrink-0">RESULTS</div>
        <div className="flex items-center gap-6 animate-marquee whitespace-nowrap">
          {[
            { id: "222", teams: "V-Lyon vs V-PSG", score: "1:2" },
            { id: "221", teams: "V-Atl.Madrid vs V-Barcelona", score: "2:0" },
            { id: "220", teams: "V-PSV vs V-Ajax", score: "2:1" }
          ].map((res) => (
            <div key={res.id} className="flex items-center gap-2 text-[9px] font-bold">
              <span className="text-primary font-black">{res.id}</span>
              <span className="text-muted-foreground uppercase">{res.teams}</span>
              <span className="bg-secondary/50 px-1.5 py-0.5 rounded text-foreground font-mono">{res.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <h5 className="text-[8px] font-black text-muted-foreground uppercase tracking-widest text-center">{title}</h5>
      {children}
    </div>
  );
}

function VirtualOdds({ selection, odds, isActive, onClick }: { selection: string, odds: string, isActive?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-1.5 rounded-lg border transition-all group",
        isActive 
          ? "bg-primary border-primary shadow-lg shadow-primary/20 scale-[0.98]" 
          : "bg-secondary/30 border-border/20 hover:border-primary/50 hover:bg-primary/5"
      )}
    >
      <span className={cn(
        "text-[8px] font-bold uppercase transition-colors",
        isActive ? "text-primary-foreground/80" : "text-muted-foreground group-hover:text-primary"
      )}>{selection}</span>
      <span className={cn(
        "text-[10px] font-black transition-colors",
        isActive ? "text-primary-foreground" : "text-foreground group-hover:text-primary"
      )}>{odds}</span>
    </button>
  );
}
