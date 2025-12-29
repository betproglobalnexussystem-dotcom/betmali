import { cn } from "@/lib/utils";
import { useBetslip } from "@/lib/store";
import { Match } from "@shared/schema";

interface OddsButtonProps {
  match: Match & { league: { name: string } };
  selection: string;
  odds: string | number | null;
  label?: string;
  className?: string;
}

export function OddsButton({ match, selection, odds, label, className }: OddsButtonProps) {
  const { addItem, items, removeItem } = useBetslip();
  
  if (!odds) {
    return (
      <div className={cn("h-7 w-full bg-transparent flex items-center justify-center text-muted-foreground/30 text-[9px] font-bold", className)}>
        -
      </div>
    );
  }

  const numericOdds = Number(odds);
  const matchIdStr = match.id.toString();
  const matchIdNum = parseInt(matchIdStr);
  const isSelected = (items.some(i => i.matchId.toString() === matchIdStr && i.selection === selection)) || 
                     (useBetslip.getState().liveItems.some(i => i.matchId.toString() === matchIdStr && i.selection === selection));

  const handleClick = () => {
    const isLive = match.status === 'live';
    if (isSelected) {
      removeItem(matchIdNum, selection, isLive ? 'live' : 'regular');
    } else {
      addItem({
        matchId: matchIdNum,
        selection,
        odds: numericOdds,
        matchInfo: {
          homeTeam: match.homeTeam,
          awayTeam: match.awayTeam,
          league: (match.league as any)?.name || 'Match',
          startTime: match.startTime.toString(),
        }
      }, isLive);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center justify-center h-7 mx-0.5 rounded bg-secondary/50 hover:bg-primary/20 transition-all border border-transparent text-[9px] font-bold",
        isSelected && "bg-primary text-primary-foreground hover:bg-primary border-primary",
        className
      )}
    >
      {numericOdds.toFixed(3)}
    </button>
  );
}
