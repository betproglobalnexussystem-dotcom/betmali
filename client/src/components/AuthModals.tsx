import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/store";
import { cn } from "@/lib/utils";

export function AuthModals() {
  const { login, user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handlePhoneChange = async (val: string) => {
    setPhoneNumber(val);
    if (val.length >= 9) {
      setIsVerifying(true);
      setIsVerified(false);
      // Simulate automatic verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsVerified(true);
      setIsVerifying(false);
    } else {
      setIsVerified(false);
      setIsVerifying(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isVerified) {
      login(phoneNumber);
      setIsOpen(false);
    }
  };

  if (user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-primary hover:text-primary/80 font-bold text-xs" data-auth-trigger>
          LOGIN / REGISTER
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] bg-card border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-primary">
            {isLogin ? "Welcome Back" : "Create Account"}
          </DialogTitle>
        </DialogHeader>
        <div className="hidden">
          <button data-auth-register onClick={() => { setIsLogin(false); setIsOpen(true); }}>Register</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <div className="relative">
              <Input
                id="phoneNumber"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={cn(
                  "bg-secondary/20 pr-10",
                  isVerified && "border-green-500 ring-green-500/20"
                )}
              />
              {isVerifying && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              {isVerified && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 font-bold text-xs animate-in zoom-in duration-300">
                  ✓
                </div>
              )}
            </div>
            {isVerifying && (
              <p className="text-[10px] text-primary animate-pulse font-bold uppercase tracking-wider">
                Automatically verifying number...
              </p>
            )}
            {isVerified && (
              <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider">
                ACTIVE
              </p>
            )}
          </div>
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary/20"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" className="bg-secondary/20" />
          </div>
          <Button type="submit" disabled={!isVerified} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
            {isLogin ? "LOGIN" : "REGISTER"}
          </Button>
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
