import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { formatCurrency, cn } from "@/lib/utils";
import { Wallet, History, Settings, TrendingUp, ShoppingBag, User as UserIcon, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

function BetItem({ id, date, status, stake, returnAmount, matches, currency, onCashout }: {
  id: string,
  date: string,
  status: string,
  stake: number,
  returnAmount: number,
  matches: Array<{ teams: string, selection: string, status: string }>,
  currency: string,
  onCashout?: () => void
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cashoutValue = status === 'PENDING' ? Math.floor(stake * 0.85 + (Math.random() * (stake * 0.1))) : 0;

  return (
    <div className="bg-card border border-border/50 rounded-lg overflow-hidden">
      <div 
        className="p-3 cursor-pointer hover:bg-secondary/5 transition-colors group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold group-hover:text-primary transition-colors">{id}</span>
            <span className="text-[8px] text-muted-foreground">{date}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn(
              "px-2 py-0.5 rounded text-[8px] font-bold",
              status === 'PENDING' ? "bg-yellow-500/10 text-yellow-500" : 
              status === 'WON' ? "bg-green-500/10 text-green-500" : 
              status === 'CASHED OUT' ? "bg-blue-500/10 text-blue-500" : "bg-red-500/10 text-red-500"
            )}>
              {status}
            </span>
            {isExpanded ? <ChevronUp className="w-3 h-3 text-muted-foreground" /> : <ChevronDown className="w-3 h-3 text-muted-foreground" />}
          </div>
        </div>
        
        {!isExpanded && (
          <div className="mt-2 pt-2 border-t border-border/30 flex items-center justify-between">
            <span className="text-[8px] text-muted-foreground uppercase font-bold">Stake: {formatCurrency(stake, currency)}</span>
            <span className="text-[9px] text-primary font-black">EST. RETURN: {formatCurrency(returnAmount, currency)}</span>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="px-3 pb-3 space-y-3 bg-secondary/5 animate-in slide-in-from-top-1 duration-200">
          <div className="space-y-2">
            {matches.map((match, i) => (
              <div key={i} className="flex items-center justify-between text-[9px] py-1 border-b border-border/30 last:border-0">
                <div className="flex flex-col">
                  <span className="font-bold">{match.teams}</span>
                  <span className="text-muted-foreground">{match.selection}</span>
                </div>
                <span className={cn(
                  "px-1.5 py-0.5 rounded font-bold text-[8px]",
                  match.status === 'PENDING' ? "bg-yellow-500/10 text-yellow-500" : 
                  match.status === 'WON' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                )}>
                  {match.status}
                </span>
              </div>
            ))}
          </div>
          
          <div className="pt-2 border-t border-border/30 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-tight">Total Stake</span>
              <span className="text-[10px] font-bold">{formatCurrency(stake, currency)}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-tight">Potential Return</span>
              <span className="text-primary font-black text-[11px]">{formatCurrency(returnAmount, currency)}</span>
            </div>
          </div>

          {status === 'PENDING' && onCashout && (
            <div className="pt-3 mt-1 border-t border-primary/20">
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  onCashout();
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-8 text-[10px] uppercase tracking-wider gap-2 shadow-lg shadow-blue-500/20"
              >
                CASHOUT {formatCurrency(cashoutValue, currency)}
              </Button>
              <p className="text-[7px] text-center text-muted-foreground mt-1 uppercase tracking-tighter">Instant credit to wallet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function UserDashboard() {
  const { user, logout, deposit, currency } = useAuth();
  const [activeTab, setActiveTab] = useState("wallet");
  const [betFilter, setBetFilter] = useState<'ACTIVE' | 'COMPLETED' | 'CASHED OUT'>('ACTIVE');
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [myBets, setMyBets] = useState([
    {
      id: "BET-88273",
      date: "Dec 29, 2025 • 14:20",
      status: "PENDING",
      stake: 1000,
      returnAmount: 2850,
      matches: [{ teams: "Real Madrid vs Barcelona", selection: "1", status: "PENDING" }]
    },
    {
      id: "BET-CO-99283",
      date: "Dec 28, 2025 • 12:45",
      status: "CASHED OUT",
      stake: 5000,
      returnAmount: 3250,
      matches: [{ teams: "Man City vs Liverpool", selection: "1", status: "CASHED OUT" }]
    },
    {
      id: "BET-99401",
      date: "Dec 27, 2025 • 20:15",
      status: "WON",
      stake: 2000,
      returnAmount: 4200,
      matches: [{ teams: "Arsenal vs Chelsea", selection: "Over 2.5", status: "WON" }]
    }
  ]);

  const [offers, setOffers] = useState([
    {
      id: "OFFER-1",
      title: "First Deposit Bonus",
      description: "Get 100% back on your first deposit up to Sh 100,000.",
      value: 100000,
      claimed: false,
      progress: 66
    },
    {
      id: "OFFER-2",
      title: "Weekend Special",
      description: "Claim a Sh 5,000 free bet for any Premier League match.",
      value: 5000,
      claimed: false,
      progress: 100
    }
  ]);

  if (!user) return null;

  const handleClaimOffer = (offerId: string) => {
    const offer = offers.find(o => o.id === offerId);
    if (!offer || offer.claimed) return;

    deposit(offer.value);
    setOffers(prev => prev.map(o => o.id === offerId ? { ...o, claimed: true } : o));
  };

  const handleCashout = (betId: string) => {
    const bet = myBets.find(b => b.id === betId);
    if (!bet) return;
    const cashoutValue = Math.floor(bet.stake * 0.85);
    deposit(cashoutValue);
    setMyBets(prev => prev.map(b => b.id === betId ? { ...b, status: 'CASHED OUT', matches: b.matches.map(m => ({ ...m, status: 'CASHED OUT' })) } : b));
  };

  const filteredBets = myBets.filter(bet => {
    if (betFilter === 'ACTIVE') return bet.status === 'PENDING';
    if (betFilter === 'COMPLETED') return bet.status === 'WON' || bet.status === 'LOST';
    if (betFilter === 'CASHED OUT') return bet.status === 'CASHED OUT';
    return true;
  });

  const tabs = [
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "bets", label: "My Bets", icon: History },
    { id: "virtual", label: "Virtual Bet", icon: TrendingUp },
    { id: "orders", label: "My Offer", icon: ShoppingBag },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (!isNaN(amount) && amount > 0) {
      deposit(amount);
      setDepositAmount("");
    }
  };

  const handleWithdrawAll = () => {
    if (user.balance > 0) {
      deposit(-user.balance);
      setWithdrawAmount("");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 text-primary hover:bg-primary/5" data-dashboard-trigger>
          <UserIcon className="w-4 h-4" />
          <span className="hidden sm:inline font-bold text-xs">{user.username}</span>
          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold">
            {formatCurrency(user.balance, currency)}
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] bg-card border-l-primary/20">
        <SheetHeader className="border-b border-border/50 pb-4 mb-4">
          <SheetTitle className="flex items-center gap-2 text-primary">
            <UserIcon className="w-5 h-5" />
            User Dashboard
          </SheetTitle>
        </SheetHeader>

        <div className="flex gap-4 h-[calc(100vh-120px)]">
          <div className="w-20 sm:w-32 flex flex-col gap-1 border-r border-border/50 pr-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                data-tab-id={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col sm:flex-row items-center gap-2 p-2 rounded-lg text-[10px] font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary/50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
            <div className="mt-auto pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="w-full text-[10px] border-destructive/50 text-destructive hover:bg-destructive/10"
              >
                Logout
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-auto pr-2">
            {activeTab === "wallet" && (
              <div className="space-y-4">
                <div className="bg-secondary/10 p-3 rounded-lg border border-primary/10">
                  <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Balance</h3>
                  <div className="text-xl font-black text-primary">{formatCurrency(user.balance, currency)}</div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="space-y-3">
                    <h4 className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-1.5 px-1">
                      <Plus className="w-2.5 h-2.5" /> Deposit Funds
                    </h4>
                    
                    <div className="bg-card border border-border/50 rounded-lg p-3 space-y-3">
                      <div className="flex items-center justify-between py-1.5 px-2 bg-secondary/20 rounded border border-border/30">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-[#FFCC00] flex items-center justify-center font-black text-white text-[8px] border border-black/10 shadow-sm relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                            <span className="relative z-10 text-[#004F71]">M</span>
                            <span className="relative z-10 text-[#ED1C24] -ml-0.5">M</span>
                          </div>
                          <span className="text-[9px] font-bold">Mobile Money</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight">Amount to Deposit</label>
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-muted-foreground">{currency === 'UGX' ? 'Sh' : '$'}</span>
                            <Input
                              type="number"
                              placeholder="0.00"
                              value={depositAmount}
                              onChange={(e) => setDepositAmount(e.target.value)}
                              className="h-7 pl-6 text-[10px] bg-secondary/10 border-border/50 focus:border-primary/50"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight">Phone Number</label>
                          <Input
                            placeholder="256 XXX XXX XXX"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="h-7 text-[10px] bg-secondary/10 border-border/50 focus:border-primary/50"
                          />
                        </div>

                        <Button onClick={handleDeposit} size="sm" className="w-full h-8 text-[10px] font-black bg-primary hover:bg-primary/90 uppercase tracking-widest">
                          Deposit Now
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[9px] font-black text-destructive uppercase tracking-widest flex items-center gap-1.5 px-1">
                      <Wallet className="w-2.5 h-2.5" /> Cash Out
                    </h4>
                    
                    <div className="bg-card border border-border/50 rounded-lg p-3 space-y-3">
                      <div className="flex items-center justify-between py-1.5 px-2 bg-secondary/20 rounded border border-border/30">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-[#FFCC00] flex items-center justify-center font-black text-white text-[8px] border border-black/10 shadow-sm relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                            <span className="relative z-10 text-[#004F71]">M</span>
                            <span className="relative z-10 text-[#ED1C24] -ml-0.5">M</span>
                          </div>
                          <span className="text-[9px] font-bold">Mobile Money</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight">Amount to Withdraw</label>
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-muted-foreground">{currency === 'UGX' ? 'Sh' : '$'}</span>
                            <Input
                              type="number"
                              placeholder="0.00"
                              value={withdrawAmount}
                              onChange={(e) => setWithdrawAmount(e.target.value)}
                              className="h-7 pl-6 text-[10px] bg-secondary/10 border-border/50 focus:border-destructive/50"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight">Phone Number</label>
                          <Input
                            placeholder="256 XXX XXX XXX"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="h-7 text-[10px] bg-secondary/10 border-border/50 focus:border-destructive/50"
                          />
                        </div>

                        <Button onClick={handleWithdrawAll} variant="outline" size="sm" className="w-full h-8 text-[10px] font-black border-destructive/50 text-destructive hover:bg-destructive/10 uppercase tracking-widest">
                          Withdraw All
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-bold mb-2 text-muted-foreground uppercase tracking-widest">History</h3>
                  <div className="text-[9px] text-center py-6 text-muted-foreground/40 italic bg-secondary/5 rounded-lg border border-dashed border-border/50">
                    No transactions yet
                  </div>
                </div>
              </div>
            )}

            {activeTab === "bets" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 bg-secondary/20 p-1 rounded-lg">
                  {['ACTIVE', 'COMPLETED', 'CASHED OUT'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setBetFilter(filter as any)}
                      className={`flex-1 py-1.5 text-[9px] font-bold rounded-md transition-colors ${
                        betFilter === filter ? 'bg-background shadow-sm' : 'hover:bg-background/50 text-muted-foreground'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <h3 className="text-[9px] font-black text-muted-foreground uppercase tracking-widest px-1">
                    {betFilter === 'ACTIVE' ? 'Live & Pending' : betFilter === 'COMPLETED' ? 'Settled Bets' : 'Cashed Out Matches'}
                  </h3>
                  
                  {filteredBets.length === 0 ? (
                    <div className="text-[9px] text-center py-8 text-muted-foreground/40 italic bg-secondary/5 rounded-lg border border-dashed border-border/50">
                      No {betFilter.toLowerCase()} bets found
                    </div>
                  ) : (
                    filteredBets.map(bet => (
                      <BetItem 
                        key={bet.id} 
                        {...bet} 
                        currency={currency} 
                        onCashout={() => handleCashout(bet.id)}
                      />
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "virtual" && (
              <div className="space-y-4">
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                  <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Virtual Betting
                  </h3>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Your virtual sports betting history and performance.
                  </p>
                </div>
                <div className="space-y-2">
                  <BetItem 
                    id="VIRT-88273641"
                    date="Dec 28, 2025 • 15:10"
                    status="WON"
                    stake={1000}
                    returnAmount={2450}
                    currency={currency}
                    matches={[
                      { teams: "Virtual Arsenal vs Virtual Chelsea", selection: "Over 2.5", status: "WON" }
                    ]}
                  />
                  <div className="text-[9px] text-center py-6 text-muted-foreground/40 italic bg-secondary/5 rounded-lg border border-dashed border-border/50">
                    No more virtual bets found
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="space-y-4">
                <div className="bg-primary/5 p-3 rounded-lg border border-primary/20 flex items-center justify-between">
                  <div>
                    <h4 className="text-[10px] font-black text-primary">OFFERS CENTER</h4>
                    <p className="text-[8px] text-muted-foreground">Boost your balance with rewards</p>
                  </div>
                  <ShoppingBag className="w-5 h-5 text-primary opacity-50" />
                </div>

                <h3 className="text-[9px] font-black text-muted-foreground uppercase tracking-widest px-1">Active Offers</h3>
                
                <div className="space-y-3">
                  {offers.map(offer => (
                    <div key={offer.id} className="bg-card border border-border/50 rounded-lg p-3 space-y-3 relative overflow-hidden group">
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold group-hover:text-primary transition-colors">{offer.title}</span>
                          <p className="text-[8px] text-muted-foreground leading-tight max-w-[180px]">{offer.description}</p>
                        </div>
                        <span className={cn(
                          "text-[8px] px-1.5 py-0.5 rounded font-bold",
                          offer.claimed ? "bg-secondary/20 text-muted-foreground" : "bg-green-500/10 text-green-500"
                        )}>
                          {offer.claimed ? "CLAIMED" : "AVAILABLE"}
                        </span>
                      </div>
                      
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[8px]">
                          <span className="text-muted-foreground uppercase font-bold">Progress</span>
                          <span className="font-bold">{offer.progress}%</span>
                        </div>
                        <div className="w-full bg-secondary/30 h-1 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full transition-all duration-500", offer.claimed ? "bg-muted-foreground" : "bg-primary")}
                            style={{ width: `${offer.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {!offer.claimed && offer.progress === 100 && (
                        <div className="pt-2">
                          <Button 
                            onClick={() => handleClaimOffer(offer.id)}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-8 text-[10px] uppercase tracking-wider gap-2 shadow-lg shadow-primary/20"
                          >
                            CLAIM {formatCurrency(offer.value, currency)}
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="border border-border/50 rounded-lg p-8 text-center text-[9px] text-muted-foreground/50 italic bg-secondary/5 border-dashed">
                  Check back later for more offers
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold">Account Settings</h3>
                <div className="text-[9px] text-center py-6 text-muted-foreground/40 italic bg-secondary/5 rounded-lg border border-dashed border-border/50">
                  Settings are coming soon
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
