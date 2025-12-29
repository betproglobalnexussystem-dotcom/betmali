import { useBetslip, useAuth } from "@/lib/store";
import { useCreateBet } from "@/hooks/use-bets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

export function Betslip() {
  const { items, liveItems, recentItems, stake, setStake, removeItem, addItem, clear } = useBetslip();
  const [activeTab, setActiveTab] = useState<'betslip' | 'recent' | 'live'>('betslip');
  const createBet = useCreateBet();
  const { toast } = useToast();
  const { currency } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentItems = activeTab === 'betslip' ? items : activeTab === 'live' ? liveItems : recentItems;

  const totalOdds = currentItems.reduce((acc, item) => acc * item.odds, 1);
  const potentialReturn = stake * totalOdds;

  const handlePlaceBet = async () => {
    if (currentItems.length === 0) return;
    
    setIsSubmitting(true);
    try {
      await Promise.all(currentItems.map(item => 
        createBet.mutateAsync({
          matchId: item.matchId,
          selection: item.selection,
          odds: item.odds.toFixed(2),
          stake: (stake / currentItems.length).toFixed(2),
          status: 'pending'
        })
      ));
      
      toast({
        title: "Bets Placed!",
        description: `Return: ${formatCurrency(potentialReturn, currency)}`,
        className: "bg-green-600 border-none text-white",
      });
      clear(activeTab === 'betslip' ? 'regular' : activeTab === 'live' ? 'live' : 'recent');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Tabs */}
      <div className="flex border-b border-border/50 shrink-0">
        {[
          { id: 'betslip', label: 'BETSLIP', count: items.length },
          { id: 'recent', label: 'RECENT', count: recentItems.length },
          { id: 'live', label: 'LIVE', count: liveItems.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-3 text-[10px] font-bold transition-all relative ${
              activeTab === tab.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-1.5 px-1 bg-primary/20 text-primary rounded-sm text-[8px]">
                {tab.count}
              </span>
            )}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {currentItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground text-[9px] p-4">
          <span className="text-2xl mb-2">🎫</span>
          <p className="font-medium">Your {activeTab} is empty</p>
          <p className="text-[8px] opacity-60 mt-0.5">Select odds to start</p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="p-2 border-b border-border/50 bg-secondary/20 flex justify-between items-center shrink-0 text-[9px]">
            <div className="flex items-center gap-1.5">
              <div className="bg-primary/20 text-primary w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold">
                {currentItems.length}
              </div>
              <span className="font-bold">{activeTab === 'recent' ? 'Previous Selections' : 'Combo Bet'}</span>
            </div>
            <button 
              onClick={() => clear(activeTab === 'betslip' ? 'regular' : activeTab === 'live' ? 'live' : 'recent')}
              className="text-muted-foreground hover:text-destructive flex items-center gap-0.5 transition-colors"
            >
              <Trash2 className="w-3 h-3" /> Clear
            </button>
          </div>

          {/* Bet Items */}
          <ScrollArea className="flex-1 overflow-auto">
            <div className="p-2 space-y-2">
              {currentItems.map((item) => (
                <div key={`${item.matchId}-${item.selection}`} className="relative bg-secondary/30 rounded-lg p-2 border border-border/50 hover:border-primary/30 transition-colors group text-[9px]">
                  <button
                    onClick={() => removeItem(item.matchId, item.selection, activeTab === 'betslip' ? 'regular' : activeTab === 'live' ? 'live' : 'recent')}
                    className="absolute top-1 right-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  
                  <div className="pr-5">
                    <div className="flex items-baseline gap-1.5 mb-0.5">
                      <span className="text-primary font-bold text-[9px]">{item.selection}</span>
                      <span className="text-[8px] text-muted-foreground">@</span>
                      <span className="text-foreground font-bold text-[9px]">{item.odds.toFixed(3)}</span>
                    </div>
                    <div className="text-[8px] text-foreground/90 font-medium truncate">
                      {item.matchInfo.homeTeam} vs {item.matchInfo.awayTeam}
                    </div>
                    {activeTab === 'recent' && (
                      <button 
                        onClick={() => addItem(item, false)}
                        className="mt-1 text-primary hover:text-primary/80 font-bold uppercase text-[7px] tracking-wider"
                      >
                        REUSE SELECTION
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-3 bg-secondary/10 border-t border-border/50 space-y-3 shrink-0 text-[9px]">
            <div className="space-y-1.5">
              <div className="flex justify-between text-muted-foreground">
                <span>Total odds</span>
                <span className="font-mono font-bold text-foreground">{totalOdds.toFixed(3)}</span>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stake</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-muted-foreground text-[8px]">{currency === 'UGX' ? 'Sh' : '$'}</span>
                    <Input
                      type="number"
                      value={stake}
                      onChange={(e) => setStake(Number(e.target.value))}
                      className="h-7 pl-4 text-right font-mono text-[8px] bg-background border-border"
                      min={1}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between text-accent font-bold pt-1 text-[9px]">
                <span>Poss. return</span>
                <span>{formatCurrency(potentialReturn, currency)}</span>
              </div>
            </div>

            <Button
              onClick={handlePlaceBet}
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-10 text-[10px] uppercase tracking-wider shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSubmitting ? "PLACING..." : activeTab === 'recent' ? "PLACE AGAIN" : "PLACE BET"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
