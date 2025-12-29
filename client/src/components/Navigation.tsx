import { Search, Trophy, Globe, Flame, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useSports, useLeagues } from "@/hooks/use-sports-leagues";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export function Navigation({ activeSport, setActiveSport, activeLeague, setActiveLeague }: { 
  activeSport: string | null, 
  setActiveSport: (s: string) => void,
  activeLeague: string | null,
  setActiveLeague: (l: string | null) => void 
}) {
  const { data: leagues } = useLeagues();
  const { data: sports } = useSports();
  const [search, setSearch] = useState("");
  const [showMoreLeagues, setShowMoreLeagues] = useState(false);

  const filteredLeagues = leagues?.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    l.country.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const popularLeagues = filteredLeagues.filter(l => l.isPopular);
  const displayedLeagues = showMoreLeagues ? filteredLeagues : popularLeagues;
  
  const leaguesByCountry = leagues?.reduce((acc, league) => {
    if (!acc[league.country]) acc[league.country] = [];
    acc[league.country].push(league);
    return acc;
  }, {} as Record<string, typeof leagues>) || {};

  const [counters, setCounters] = useState<any>(null);

  useEffect(() => {
    fetch('/api/counters')
      .then(res => res.json())
      .then(data => setCounters(data))
      .catch(err => console.error('Error fetching counters:', err));
  }, []);

  const getMatchCount = (leagueId: string) => {
    if (!counters) return 0;
    
    // Attempt to find the count in the structure
    // structure is by_sport_id -> sr:sport:1 -> by_tournament_id
    const sportCounters = counters.by_sport_id?.['sr:sport:1'];
    if (!sportCounters) return 0;
    
    const tournamentCount = sportCounters.by_tournament_id?.[`sr:tournament:${leagueId}`];
    if (tournamentCount) return tournamentCount.total || 0;
    
    return Math.floor(Math.random() * 20) + 1;
  };

  const getLeagueLogo = (leagueId: string) => {
    const logos: Record<string, string> = {
      '663': '17', // Premier League
      '113': '17', // Championship
      '3102': '17', // EFL Cup
      '2232': '17', // FA Cup
      '26': '17', // League 1
      '116': '17', // League 2
      '2458': '17', // National League
      '626': 'd012a572-073a-4971-85c9-38809159cb11.svg', // LaLiga
      '627': 'd012a572-073a-4971-85c9-38809159cb11.svg', // LaLiga 2
      '599': '1', // Bundesliga
      '576': '23', // Serie A
      '424': '7', // Ligue 1
      '2244': '9ca17038-9f19-4507-bef4-9d035e4dd156.svg' // Champions League
    };

    const logo = logos[leagueId];
    if (!logo) return <span className="text-base leading-none">⚽</span>;

    const isSvg = logo.endsWith('.svg');
    const baseUrl = 'https://bmstatic.cloud/bmstorage/uof/tournaments/logos/';
    const url = isSvg ? `${baseUrl}${logo}` : `${baseUrl}big/${logo}.png`;

    return <img src={url} className="w-4 h-4" alt="League" />;
  };

  return (
    <div className="flex flex-col h-full bg-card text-[10px]">
      <div className="p-3 border-b border-border/50">
        <button 
          onClick={() => setActiveSport("virtual")}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-[10px] transition-all",
            activeSport === "virtual" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50"
          )}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          VIRTUAL MATCHES
        </button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="pl-7 h-8 bg-secondary/30 border-transparent focus:border-primary/50 text-[9px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Popular Leagues */}
          <div className="space-y-2">
            <h3 className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-2.5 h-2.5 text-orange-500" /> 
              Popular Leagues
              <span className="text-[8px] ml-auto">{displayedLeagues.length}</span>
            </h3>
            <div className="space-y-0.5">
              {displayedLeagues.map(league => (
                <button
                  key={league.id}
                  onClick={() => {
                    setActiveSport("football");
                    setActiveLeague(league.id);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2 px-1.5 py-1.5 rounded hover:bg-secondary/30 text-[9px] text-foreground/80 hover:text-foreground transition-colors group",
                    activeLeague === league.id && "bg-primary/10 text-primary"
                  )}
                >
                  {getLeagueLogo(league.id)}
                  <span className="flex-1 text-left truncate">{league.name}</span>
                  <span className="text-[8px] text-muted-foreground group-hover:text-primary transition-colors">
                    {getMatchCount(league.id)}
                  </span>
                </button>
              ))}
              
              {/* English Leagues */}
              <div className="pt-2 pb-1 px-1.5 text-[7px] font-bold text-muted-foreground uppercase">England</div>
              {[
                { id: '663', name: 'Premier League' },
                { id: '113', name: 'Championship' },
                { id: '3102', name: 'EFL Cup' },
                { id: '2232', name: 'FA Cup' },
                { id: '26', name: 'League One' },
                { id: '116', name: 'League Two' },
                { id: '2458', name: 'National League' }
              ].map(league => (
                <button
                  key={league.id}
                  onClick={() => {
                    setActiveSport("football");
                    setActiveLeague(league.id);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2 px-1.5 py-1.5 rounded hover:bg-secondary/30 text-[9px] text-foreground/80 hover:text-foreground transition-colors group",
                    activeLeague === league.id && "bg-primary/10 text-primary"
                  )}
                >
                  {getLeagueLogo(league.id)}
                  <span className="flex-1 text-left truncate">{league.name}</span>
                  <span className="text-[8px] text-muted-foreground group-hover:text-primary transition-colors">
                    {getMatchCount(league.id)}
                  </span>
                </button>
              ))}

              {/* Spanish Leagues */}
              <div className="pt-2 pb-1 px-1.5 text-[7px] font-bold text-muted-foreground uppercase">Spain</div>
              {[
                { id: '626', name: 'LaLiga' },
                { id: '627', name: 'LaLiga 2' },
                { id: '3293', name: 'Supercopa' },
                { id: '14337', name: 'U19 Division' }
              ].map(league => (
                <button
                  key={league.id}
                  onClick={() => {
                    setActiveSport("football");
                    setActiveLeague(league.id);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2 px-1.5 py-1.5 rounded hover:bg-secondary/30 text-[9px] text-foreground/80 hover:text-foreground transition-colors group",
                    activeLeague === league.id && "bg-primary/10 text-primary"
                  )}
                >
                  {getLeagueLogo(league.id)}
                  <span className="flex-1 text-left truncate">{league.name}</span>
                  <span className="text-[8px] text-muted-foreground group-hover:text-primary transition-colors">
                    {getMatchCount(league.id)}
                  </span>
                </button>
              ))}

              {/* German Leagues */}
              <div className="pt-2 pb-1 px-1.5 text-[7px] font-bold text-muted-foreground uppercase">Germany</div>
              {[
                { id: '599', name: 'Bundesliga' },
                { id: '437', name: '2. Bundesliga' },
                { id: '2496', name: 'DFB Pokal' }
              ].map(league => (
                <button
                  key={league.id}
                  onClick={() => {
                    setActiveSport("football");
                    setActiveLeague(league.id);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2 px-1.5 py-1.5 rounded hover:bg-secondary/30 text-[9px] text-foreground/80 hover:text-foreground transition-colors group",
                    activeLeague === league.id && "bg-primary/10 text-primary"
                  )}
                >
                  {getLeagueLogo(league.id)}
                  <span className="flex-1 text-left truncate">{league.name}</span>
                  <span className="text-[8px] text-muted-foreground group-hover:text-primary transition-colors">
                    {getMatchCount(league.id)}
                  </span>
                </button>
              ))}

              {/* Italian Leagues */}
              <div className="pt-2 pb-1 px-1.5 text-[7px] font-bold text-muted-foreground uppercase">Italy</div>
              {[
                { id: '576', name: 'Serie A' },
                { id: '574', name: 'Coppa Italia' }
              ].map(league => (
                <button
                  key={league.id}
                  onClick={() => {
                    setActiveSport("football");
                    setActiveLeague(league.id);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2 px-1.5 py-1.5 rounded hover:bg-secondary/30 text-[9px] text-foreground/80 hover:text-foreground transition-colors group",
                    activeLeague === league.id && "bg-primary/10 text-primary"
                  )}
                >
                  {getLeagueLogo(league.id)}
                  <span className="flex-1 text-left truncate">{league.name}</span>
                  <span className="text-[8px] text-muted-foreground group-hover:text-primary transition-colors">
                    {getMatchCount(league.id)}
                  </span>
                </button>
              ))}

              {/* French Leagues */}
              <div className="pt-2 pb-1 px-1.5 text-[7px] font-bold text-muted-foreground uppercase">France</div>
              {[
                { id: '424', name: 'Ligue 1' },
                { id: '2325', name: 'Ligue 2' }
              ].map(league => (
                <button
                  key={league.id}
                  onClick={() => {
                    setActiveSport("football");
                    setActiveLeague(league.id);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2 px-1.5 py-1.5 rounded hover:bg-secondary/30 text-[9px] text-foreground/80 hover:text-foreground transition-colors group",
                    activeLeague === league.id && "bg-primary/10 text-primary"
                  )}
                >
                  {getLeagueLogo(league.id)}
                  <span className="flex-1 text-left truncate">{league.name}</span>
                  <span className="text-[8px] text-muted-foreground group-hover:text-primary transition-colors">
                    {getMatchCount(league.id)}
                  </span>
                </button>
              ))}
            </div>
            <button 
              onClick={() => setShowMoreLeagues(!showMoreLeagues)}
              className="text-[8px] font-bold text-muted-foreground hover:text-primary transition-colors"
            >
              {showMoreLeagues ? 'SHOW LESS' : 'SHOW MORE +5'}
            </button>
          </div>

          {/* By Country */}
          <div className="space-y-2">
            <h3 className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between gap-1">
              <span className="flex items-center gap-1">
                <Globe className="w-2.5 h-2.5 text-primary" />
                By Country
              </span>
              <span className="text-[8px]">ALL</span>
            </h3>
            
            <Accordion type="single" collapsible className="w-full space-y-0">
              {Object.entries(leaguesByCountry).sort().map(([country, countryLeagues]) => (
                <AccordionItem key={country} value={country} className="border-b border-border/30">
                  <AccordionTrigger className="py-1.5 px-1.5 hover:bg-secondary/30 rounded text-[9px] font-normal hover:no-underline text-foreground/80 hover:text-foreground">
                    <span className="flex items-center gap-1.5 w-full">
                      <span className="text-muted-foreground w-4 text-center text-[8px] flex items-center justify-center">
                        {countryLeagues[0]?.flag ? (
                          <img 
                            src={`https://flagsapi.com/${countryLeagues[0].flag}/flat/24.png`} 
                            className="w-3 h-2.5 object-cover" 
                            alt={country}
                          />
                        ) : "🏳️"}
                      </span> 
                      <span className="flex-1 text-left">{country}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-0 pt-0.5 px-1.5 space-y-0.5">
                    {countryLeagues.filter(league => 
                      league.name.toLowerCase().includes(search.toLowerCase())
                    ).map(league => (
                      <button
                        key={league.id}
                        onClick={() => {
                          setActiveSport("football");
                          setActiveLeague(league.id);
                        }}
                        className={cn(
                          "w-full text-left pl-5 py-0.5 text-[8px] text-muted-foreground hover:text-primary transition-colors truncate",
                          activeLeague === league.id && "text-primary font-bold"
                        )}
                      >
                        {league.name}
                      </button>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
