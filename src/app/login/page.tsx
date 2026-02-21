"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Loader2, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) router.push("/dashboard");
  };

  const demoAccounts = [
    { email: "admin@fleetflow.com", password: "admin123", role: "Fleet Manager" },
    { email: "dispatch@fleetflow.com", password: "dispatch123", role: "Dispatcher" },
    { email: "safety@fleetflow.com", password: "safety123", role: "Safety Officer" },
    { email: "finance@fleetflow.com", password: "finance123", role: "Financial Analyst" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] animation-delay-2000" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="flex flex-col items-center space-y-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/20 transition-transform hover:scale-105 duration-300">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter gradient-text">FleetFlow</h1>
            <p className="text-muted-foreground font-medium">Modular Logistics OS</p>
          </div>
        </div>

        <Card className="glass-card shadow-2xl border-white/20 dark:border-white/10 overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-primary to-indigo-400" />
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
            <CardDescription className="text-muted-foreground/80">
              Access your fleet management dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <div className="h-2 w-2 rounded-full bg-destructive animate-ping" />
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                <Input
                  id="email"
                  type="email"
                  className="rounded-xl bg-white/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-800/60 focus:ring-primary h-11"
                  placeholder="admin@fleetflow.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
                  <button type="button" className="text-xs font-medium text-primary hover:underline">
                    Forgot password?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  className="rounded-xl bg-white/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-800/60 h-11"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button type="submit" className="w-full h-11 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 active:scale-[0.98]" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card className="glass-card shadow-xl border-white/20 dark:border-white/10">
          <CardHeader className="pb-3 border-b border-slate-100/50 dark:border-slate-800/50">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Demo Accounts</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 p-4">
            {demoAccounts.map((acc, i) => (
              <button
                key={acc.email}
                type="button"
                className="group flex items-center justify-between rounded-xl border border-slate-200/50 dark:border-slate-800/50 p-3 text-left transition-all hover:bg-white/60 dark:hover:bg-slate-800/60 hover:border-primary/30 hover:shadow-md cursor-pointer"
                onClick={() => { setEmail(acc.email); setPassword(acc.password); }}
                style={{ animationDelay: `${(i + 1) * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center transition-colors group-hover:bg-primary/10">
                    <User className="h-5 w-5 text-slate-500 group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{acc.role}</p>
                    <p className="text-[11px] text-muted-foreground font-medium">{acc.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-tighter font-bold text-slate-400 group-hover:text-primary transition-colors">Select</p>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
