import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf, Lock, Mail, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple validation for demo
    if (email && password) {
      toast({
        title: "Welcome back!",
        description: "Successfully logged in as retailer.",
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Login Failed",
        description: "Please enter valid credentials.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  const handleDemoLogin = () => {
    setEmail('demo@agriretailer.com');
    setPassword('demo123');
    toast({
      title: "Demo Credentials Loaded",
      description: "Click 'Sign In' to continue with demo account.",
    });
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-primary text-primary-foreground mb-4">
            <Leaf className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Smart Agri Inventory
          </h1>
          <p className="text-muted-foreground mt-2">
            Retailer Login Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-8 animate-scale-in">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="retailer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-secondary border-border focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 bg-secondary border-border focus:border-primary"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing In...
                </span>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <button
              onClick={handleDemoLogin}
              className="w-full text-center text-sm text-primary hover:underline font-medium"
            >
              Use Demo Credentials
            </button>
          </div>
        </div>

        {/* Hackathon Notice */}
        <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
          <p className="text-xs text-center text-muted-foreground">
            <span className="font-semibold text-primary">Hackathon Demo:</span>{' '}
            This is a demonstration for the Smart Agri-Input Inventory System. 
            No actual authentication is required.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
