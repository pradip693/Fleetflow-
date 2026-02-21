"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useUserStore } from "@/store/user-store";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pagination } from "@/components/ui/pagination";
import {
  Search, MoreHorizontal, Pencil, Trash2, Shield, ShieldCheck,
  CheckCircle2, XCircle, LayoutDashboard, Truck, Route, Wrench,
  Receipt, Users, BarChart3, Eye, EyeOff, UserPlus, KeyRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { User, UserRole } from "@/types";

const ALL_ROLES: { value: UserRole; label: string; color: string; description: string }[] = [
  { value: "manager", label: "Fleet Manager", color: "bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300", description: "Full system access" },
  { value: "dispatcher", label: "Dispatcher", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300", description: "Trips & vehicle management" },
  { value: "safety_officer", label: "Safety Officer", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300", description: "Driver compliance" },
  { value: "financial_analyst", label: "Financial Analyst", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300", description: "Cost & analytics" },
];

const MODULES = [
  { key: "dashboard", label: "Command Center", icon: LayoutDashboard },
  { key: "vehicles", label: "Vehicle Registry", icon: Truck },
  { key: "trips", label: "Trip Dispatcher", icon: Route },
  { key: "maintenance", label: "Maintenance", icon: Wrench },
  { key: "expenses", label: "Expenses & Fuel", icon: Receipt },
  { key: "drivers", label: "Driver Profiles", icon: Users },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "admin", label: "Access Control", icon: ShieldCheck },
];

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  manager: ["dashboard", "vehicles", "trips", "maintenance", "expenses", "drivers", "analytics", "admin"],
  dispatcher: ["dashboard", "vehicles", "trips"],
  safety_officer: ["dashboard", "drivers"],
  financial_analyst: ["dashboard", "expenses", "analytics"],
};

const INITIAL_FORM = {
  name: "",
  email: "",
  password: "",
  role: "dispatcher" as UserRole,
};

export default function AccessControlPage() {
  const { user: currentUser, hasRole } = useAuthStore();
  const { users, isLoading, fetchUsers, addUser, updateUser, deleteUser } = useUserStore();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [resetPwDialogOpen, setResetPwDialogOpen] = useState(false);
  const [resetPwUser, setResetPwUser] = useState<User | null>(null);
  const [newPw, setNewPw] = useState("");
  const [resetPwSaving, setResetPwSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setPage(1);
  }, [search, roleFilter]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [users, search, roleFilter]);

  const totalFiltered = filtered.length;
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    users.forEach((u) => { counts[u.role] = (counts[u.role] ?? 0) + 1; });
    return counts;
  }, [users]);

  if (!hasRole(["manager"])) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground">
        <Shield className="h-16 w-16 opacity-30" />
        <h2 className="text-xl font-semibold text-foreground">Access Denied</h2>
        <p className="text-sm">Only Fleet Managers can access the RBAC admin panel.</p>
      </div>
    );
  }

  function openCreate() {
    setEditingUser(null);
    setForm(INITIAL_FORM);
    setFormError("");
    setShowPassword(false);
    setDialogOpen(true);
  }

  function openEdit(user: User) {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, password: "", role: user.role });
    setFormError("");
    setShowPassword(false);
    setDialogOpen(true);
  }

  async function handleSave() {
    setFormError("");
    if (!form.name.trim() || !form.email.trim()) {
      setFormError("Name and email are required.");
      return;
    }
    if (!editingUser && !form.password) {
      setFormError("Password is required for new users.");
      return;
    }
    if (!editingUser && form.password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    const emailExists = users.some((u) =>
      u.email.toLowerCase() === form.email.trim().toLowerCase() && u.id !== editingUser?.id
    );
    if (emailExists) {
      setFormError("A user with this email already exists.");
      return;
    }

    setSaving(true);
    try {
      if (editingUser) {
        const data: Partial<User> = { name: form.name.trim(), email: form.email.trim(), role: form.role };
        if (form.password) data.password = form.password;
        await updateUser(editingUser.id, data);
      } else {
        await addUser({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
          avatar: "",
        });
      }
      setDialogOpen(false);
    } catch {
      setFormError("Failed to save user.");
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete(user: User) {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  }

  async function handleDelete() {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await deleteUser(userToDelete.id);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } finally {
      setDeleting(false);
    }
  }

  function openResetPw(user: User) {
    setResetPwUser(user);
    setNewPw("");
    setResetPwDialogOpen(true);
  }

  async function handleResetPw() {
    if (!resetPwUser || newPw.length < 6) return;
    setResetPwSaving(true);
    try {
      await updateUser(resetPwUser.id, { password: newPw });
      setResetPwDialogOpen(false);
    } finally {
      setResetPwSaving(false);
    }
  }

  async function handleRoleChange(userId: number, newRole: UserRole) {
    await updateUser(userId, { role: newRole });
  }

  function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  }

  function getRoleConfig(role: UserRole) {
    return ALL_ROLES.find((r) => r.value === role)!;
  }

  return (
    <div className="flex flex-col min-h-full bg-slate-50/30 dark:bg-transparent">
      <Header
        title="Access Control"
        description="Manage users, roles, and module permissions"
        actions={
          <Button onClick={openCreate} size="sm" className="rounded-xl shadow-lg shadow-indigo-500/20">
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        }
      />

      <div className="flex-1 space-y-6 p-6">
        <Tabs defaultValue="users">
          <TabsList className="bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-1 rounded-xl h-11">
            <TabsTrigger value="users" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm px-6 font-bold text-xs uppercase tracking-widest transition-all">User Management</TabsTrigger>
            <TabsTrigger value="roles" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm px-6 font-bold text-xs uppercase tracking-widest transition-all">Role Permissions</TabsTrigger>
          </TabsList>

          {/* ======================== TAB 1: USER MANAGEMENT ======================== */}
          <TabsContent value="users" className="space-y-6 mt-6">
            {/* Role summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {ALL_ROLES.map((role) => (
                <Card
                  key={role.value}
                  className={cn(
                    "glass-card border-none shadow-xl shadow-indigo-500/5 cursor-pointer hover:shadow-indigo-500/10 transition-all",
                    roleFilter === role.value && "ring-2 ring-indigo-500/50"
                  )}
                  onClick={() => setRoleFilter(roleFilter === role.value ? "all" : role.value)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest", role.color)}>
                        <Shield className="h-3 w-3" />
                        {role.label}
                      </div>
                      <span className="text-2xl font-black tracking-tighter">{roleCounts[role.value] ?? 0}</span>
                    </div>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">{role.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Search + filters */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[260px] max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 rounded-xl border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20 transition-all font-bold shadow-sm"
                />
              </div>

              <div className="flex items-center gap-3">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[180px] rounded-xl border-slate-200 dark:border-slate-800 font-bold shadow-sm">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all" className="font-bold">All Roles</SelectItem>
                    {ALL_ROLES.map((r) => (
                      <SelectItem key={r.value} value={r.value} className="font-bold">{r.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="ml-auto flex items-center gap-3">
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-xl flex items-center gap-2 border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
                  <Users className="h-3 w-3" />
                  <span className="text-slate-900 dark:text-slate-100">{totalFiltered}</span>
                  <span className="opacity-50">of</span>
                  <span className="text-slate-900 dark:text-slate-100">{users.length} users</span>
                </div>
              </div>
            </div>

            {/* Users table */}
            <Card className="glass-card border-none shadow-xl shadow-indigo-500/5 overflow-hidden">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                      <TableHead className="font-bold uppercase text-[10px] tracking-widest pl-6">Operator Identity</TableHead>
                      <TableHead className="font-bold uppercase text-[10px] tracking-widest">Email Channel</TableHead>
                      <TableHead className="font-bold uppercase text-[10px] tracking-widest text-center">Clearance</TableHead>
                      <TableHead className="font-bold uppercase text-[10px] tracking-widest">Auth Vector</TableHead>
                      <TableHead className="w-[80px] pr-6 font-bold uppercase text-[10px] tracking-widest text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                          {isLoading ? "Loading..." : "No users found."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedUsers.map((u) => {
                        const roleConf = getRoleConfig(u.role);
                        const perms = ROLE_PERMISSIONS[u.role];
                        const isSelf = u.id === currentUser?.id;
                        return (
                          <TableRow key={u.id} className="border-slate-100 dark:border-slate-800">
                            <TableCell className="pl-6">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 ring-2 ring-slate-100 dark:ring-slate-800 shadow-sm">
                                  <AvatarFallback className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-tighter">
                                    {getInitials(u.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-black text-xs uppercase tracking-tight text-slate-700 dark:text-slate-200">
                                    {u.name}
                                    {isSelf && <span className="ml-2 py-0.5 px-1.5 rounded-md bg-indigo-500 text-white text-[9px] font-black uppercase tracking-widest">You</span>}
                                  </p>
                                  <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">ID #FF-{u.id.toString().padStart(4, "0")}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{u.email}</TableCell>
                            <TableCell className="text-center">
                              <Select
                                value={u.role}
                                onValueChange={(v) => handleRoleChange(u.id, v as UserRole)}
                                disabled={isSelf}
                              >
                                <SelectTrigger className={cn("h-7 w-[160px] mx-auto text-[9px] font-black uppercase tracking-widest border-0 rounded-full pr-8", roleConf.color)}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                  {ALL_ROLES.map((r) => (
                                    <SelectItem key={r.value} value={r.value} className="rounded-lg font-bold">
                                      <div className="flex items-center gap-2">
                                        <Shield className="h-3 w-3" />
                                        {r.label}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {perms.slice(0, 4).map((p) => (
                                  <Badge key={p} variant="secondary" className="text-[9px] font-black uppercase tracking-tight px-1.5 py-0 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-0">
                                    {MODULES.find((m) => m.key === p)?.label ?? p}
                                  </Badge>
                                ))}
                                {perms.length > 4 && (
                                  <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-tight px-1.5 py-0 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border-0">
                                    +{perms.length - 4} MORE
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="pr-6 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                                    <MoreHorizontal className="h-4 w-4 text-slate-400" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-xl border-slate-200 dark:border-slate-800 shadow-2xl p-2 min-w-[180px]">
                                  <DropdownMenuItem onClick={() => openEdit(u)} className="rounded-lg cursor-pointer font-bold text-xs">
                                    <Pencil className="mr-2 h-3.5 w-3.5" />
                                    Edit Operator
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => openResetPw(u)} className="rounded-lg cursor-pointer font-bold text-xs">
                                    <KeyRound className="mr-2 h-3.5 w-3.5" />
                                    Security Override
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="my-2" />
                                  <DropdownMenuItem
                                    onClick={() => confirmDelete(u)}
                                    disabled={isSelf}
                                    className={cn("rounded-lg cursor-pointer font-black text-xs uppercase tracking-widest", !isSelf && "text-destructive focus:text-destructive focus:bg-destructive/10")}
                                  >
                                    <Trash2 className="mr-2 h-3.5 w-3.5" />
                                    Revoke Access
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
                <Pagination
                  totalItems={totalFiltered}
                  pageSize={pageSize}
                  currentPage={page}
                  onPageChange={setPage}
                  onPageSizeChange={setPageSize}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ======================== TAB 2: ROLE PERMISSIONS ======================== */}
          <TabsContent value="roles" className="space-y-6 mt-6">
            <Card className="glass-card border-none shadow-xl shadow-indigo-500/5 overflow-hidden">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 py-4">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Service Matrix
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                        <TableHead className="w-[240px] sticky left-0 bg-background p-4 font-bold uppercase text-[10px] tracking-widest pl-8">Service Module</TableHead>
                        {ALL_ROLES.map((r) => (
                          <TableHead key={r.value} className="text-center min-w-[140px] font-bold uppercase text-[10px] tracking-widest px-4">
                            <div className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-black tracking-widest border border-black/5 dark:border-white/5", r.color)}>
                              <Shield className="h-3 w-3" />
                              {r.label}
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MODULES.map((mod) => (
                        <TableRow key={mod.key} className="border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                          <TableCell className="sticky left-0 bg-background/95 backdrop-blur-sm pl-8">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50">
                                <mod.icon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                              </div>
                              <div>
                                <p className="font-black text-[11px] uppercase tracking-tight text-slate-700 dark:text-slate-200">{mod.label}</p>
                                <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-50">Component Module</p>
                              </div>
                            </div>
                          </TableCell>
                          {ALL_ROLES.map((role) => {
                            const hasAccess = ROLE_PERMISSIONS[role.value].includes(mod.key);
                            return (
                              <TableCell key={role.value} className="text-center">
                                {hasAccess ? (
                                  <div className="inline-flex items-center justify-center p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shadow-sm shadow-emerald-500/10" />
                                  </div>
                                ) : (
                                  <div className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                                    <XCircle className="h-4 w-4 text-slate-300 dark:text-slate-700" />
                                  </div>
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Role detail cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {ALL_ROLES.map((role) => {
                const perms = ROLE_PERMISSIONS[role.value];
                const count = roleCounts[role.value] ?? 0;
                return (
                  <Card key={role.value} className="glass-card border-none shadow-xl shadow-indigo-500/5">
                    <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/20">
                      <div className="flex items-center justify-between">
                        <div className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-widest", role.color)}>
                          <Shield className="h-3.5 w-3.5" />
                          {role.label}
                        </div>
                        <Badge variant="secondary" className="rounded-full px-3 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] font-black border-0">{count} Operators</Badge>
                      </div>
                      <CardDescription className="pt-2 text-[11px] font-bold uppercase tracking-tight opacity-70">{role.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4"> Authorized Access Vector </p>
                      <div className="grid grid-cols-2 gap-2">
                        {MODULES.map((mod) => {
                          const has = perms.includes(mod.key);
                          return (
                            <div
                              key={mod.key}
                              className={cn(
                                "flex items-center gap-3 rounded-xl px-3 py-2 text-[10px] font-bold transition-all border",
                                has
                                  ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/30 text-emerald-700 dark:text-emerald-400"
                                  : "bg-slate-50/50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800/50 text-slate-400 dark:text-slate-600 opacity-60"
                              )}
                            >
                              <mod.icon className={cn("h-3.5 w-3.5", has ? "text-emerald-500" : "text-muted-foreground")} />
                              <span className="uppercase tracking-tight">{mod.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
