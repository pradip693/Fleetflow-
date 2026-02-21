"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Shield,
  Mail,
  User,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  LayoutDashboard,
  Truck,
  Route,
  Wrench,
  Receipt,
  Users,
  BarChart3,
} from "lucide-react";
import type { UserRole } from "@/types";

const ROLE_CONFIG: Record<UserRole, { label: string; description: string; color: string; permissions: { label: string; icon: React.ComponentType<{ className?: string }> }[] }> = {
  manager: {
    label: "Fleet Manager",
    description: "Full access to all system modules. Oversees vehicle health, asset lifecycle, and scheduling.",
    color: "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200",
    permissions: [
      { label: "Command Center", icon: LayoutDashboard },
      { label: "Vehicle Registry", icon: Truck },
      { label: "Trip Dispatcher", icon: Route },
      { label: "Maintenance", icon: Wrench },
      { label: "Expenses & Fuel", icon: Receipt },
      { label: "Driver Profiles", icon: Users },
      { label: "Analytics", icon: BarChart3 },
    ],
  },
  dispatcher: {
    label: "Dispatcher",
    description: "Creates trips, assigns drivers, and validates cargo loads.",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    permissions: [
      { label: "Command Center", icon: LayoutDashboard },
      { label: "Vehicle Registry", icon: Truck },
      { label: "Trip Dispatcher", icon: Route },
    ],
  },
  safety_officer: {
    label: "Safety Officer",
    description: "Monitors driver compliance, license expirations, and safety scores.",
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    permissions: [
      { label: "Command Center", icon: LayoutDashboard },
      { label: "Driver Profiles", icon: Users },
    ],
  },
  financial_analyst: {
    label: "Financial Analyst",
    description: "Audits fuel spend, maintenance ROI, and operational costs.",
    color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    permissions: [
      { label: "Command Center", icon: LayoutDashboard },
      { label: "Expenses & Fuel", icon: Receipt },
      { label: "Analytics", icon: BarChart3 },
    ],
  },
};

export default function ProfilePage() {
  const { user, updateProfile, updatePassword } = useAuthStore();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  if (!user) return null;

  const roleConfig = ROLE_CONFIG[user.role];
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  async function handleProfileSave() {
    if (!name.trim() || !email.trim()) {
      setProfileMsg({ type: "error", text: "Name and email are required." });
      return;
    }
    setProfileSaving(true);
    setProfileMsg(null);
    const success = await updateProfile({ name: name.trim(), email: email.trim() });
    setProfileSaving(false);
    setProfileMsg(success
      ? { type: "success", text: "Profile updated successfully." }
      : { type: "error", text: "Failed to update profile." }
    );
  }

  async function handlePasswordSave() {
    setPasswordMsg(null);
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMsg({ type: "error", text: "All password fields are required." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }
    setPasswordSaving(true);
    const result = await updatePassword(currentPassword, newPassword);
    setPasswordSaving(false);
    if (result.success) {
      setPasswordMsg({ type: "success", text: "Password updated successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setPasswordMsg({ type: "error", text: result.error ?? "Failed to update password." });
    }
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Profile" description="Manage your account settings and security" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-3xl space-y-6">

          {/* User Overview */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left space-y-2 flex-1">
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </div>
                  </div>
                  <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${roleConfig.color}`}>
                    <Shield className="h-3.5 w-3.5" />
                    {roleConfig.label}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role & Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Role & Permissions
              </CardTitle>
              <CardDescription>{roleConfig.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-3">Accessible Modules</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {roleConfig.permissions.map((perm) => (
                    <div key={perm.label} className="flex items-center gap-3 rounded-lg border p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                        <perm.icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">{perm.label}</span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 ml-auto" />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium mb-3">All System Modules</p>
                <div className="flex flex-wrap gap-2">
                  {Object.values(ROLE_CONFIG).flatMap(r => r.permissions).filter((p, i, arr) =>
                    arr.findIndex(x => x.label === p.label) === i
                  ).map((perm) => {
                    const hasAccess = roleConfig.permissions.some((p) => p.label === perm.label);
                    return (
                      <Badge
                        key={perm.label}
                        variant={hasAccess ? "success" : "secondary"}
                        className={!hasAccess ? "opacity-50 line-through" : ""}
                      >
                        {perm.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Edit Profile
              </CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileMsg && (
                <div className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
                  profileMsg.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400"
                    : "border-destructive/50 bg-destructive/10 text-destructive"
                }`}>
                  {profileMsg.type === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
                  {profileMsg.text}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Full Name</Label>
                  <Input
                    id="profile-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-email">Email</Label>
                  <Input
                    id="profile-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input value={roleConfig.label} disabled className="opacity-60" />
                <p className="text-xs text-muted-foreground">Role can only be changed by a system administrator.</p>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleProfileSave} disabled={profileSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  {profileSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5" />
                Change Password
              </CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {passwordMsg && (
                <div className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
                  passwordMsg.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400"
                    : "border-destructive/50 bg-destructive/10 text-destructive"
                }`}>
                  {passwordMsg.type === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
                  {passwordMsg.text}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="current-pw">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-pw"
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-pw">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-pw"
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-pw">Confirm New Password</Label>
                  <Input
                    id="confirm-pw"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                  />
                </div>
              </div>
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-destructive">Passwords do not match.</p>
              )}
              <div className="flex justify-end">
                <Button
                  onClick={handlePasswordSave}
                  disabled={passwordSaving || !currentPassword || !newPassword || !confirmPassword}
                >
                  <KeyRound className="mr-2 h-4 w-4" />
                  {passwordSaving ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
