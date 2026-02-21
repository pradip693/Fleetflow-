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
import { Separator } from "@/components/ui/separator";
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
  Plus, Search, MoreHorizontal, Pencil, Trash2, Shield, ShieldCheck,
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
    <div className="flex flex-col h-full">
      <Header
        title="Access Control"
        description="Manage users, roles, and module permissions"
        actions={
          <Button size="sm" onClick={openCreate}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="roles">Role Permissions</TabsTrigger>
          </TabsList>

          {/* ======================== TAB 1: USER MANAGEMENT ======================== */}
          <TabsContent value="users" className="space-y-4 mt-4">
            {/* Role summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {ALL_ROLES.map((role) => (
                <Card key={role.value} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setRoleFilter(roleFilter === role.value ? "all" : role.value)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", role.color)}>
                        <Shield className="h-3 w-3" />
                        {role.label}
                      </div>
                      <span className="text-2xl font-bold">{roleCounts[role.value] ?? 0}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{role.description}</p>
                    {roleFilter === role.value && (
                      <Badge variant="secondary" className="mt-2 text-[10px]">Filtered</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Search + filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[220px] max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {ALL_ROLES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="ml-auto text-sm text-muted-foreground">
                {totalFiltered} of {users.length} users
              </div>
            </div>

            {/* Users table */}
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
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
                        <TableRow key={u.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                  {getInitials(u.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {u.name}
                                  {isSelf && <span className="ml-1.5 text-xs text-muted-foreground">(You)</span>}
                                </p>
                                <p className="text-xs text-muted-foreground">ID: {u.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{u.email}</TableCell>
                          <TableCell>
                            <Select
                              value={u.role}
                              onValueChange={(v) => handleRoleChange(u.id, v as UserRole)}
                              disabled={isSelf}
                            >
                              <SelectTrigger className={cn("h-8 w-[180px] text-xs font-semibold border-0", roleConf.color)}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {ALL_ROLES.map((r) => (
                                  <SelectItem key={r.value} value={r.value}>
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
                              {perms.map((p) => (
                                <Badge key={p} variant="secondary" className="text-[10px] px-1.5 py-0">
                                  {MODULES.find((m) => m.key === p)?.label ?? p}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEdit(u)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openResetPw(u)}>
                                  <KeyRound className="mr-2 h-4 w-4" />
                                  Reset Password
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => confirmDelete(u)}
                                  disabled={isSelf}
                                  className={cn(!isSelf && "text-destructive focus:text-destructive")}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete User
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
            </Card>
          </TabsContent>

          {/* ======================== TAB 2: ROLE PERMISSIONS ======================== */}
          <TabsContent value="roles" className="space-y-6 mt-4">
            {/* Permission Matrix */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  Role-Permission Matrix
                </CardTitle>
                <CardDescription>
                  Overview of which modules each role can access. Roles are defined by the system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px] sticky left-0 bg-background">Module</TableHead>
                        {ALL_ROLES.map((r) => (
                          <TableHead key={r.value} className="text-center min-w-[140px]">
                            <div className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", r.color)}>
                              <Shield className="h-3 w-3" />
                              {r.label}
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MODULES.map((mod) => (
                        <TableRow key={mod.key}>
                          <TableCell className="sticky left-0 bg-background">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                                <mod.icon className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <span className="font-medium text-sm">{mod.label}</span>
                            </div>
                          </TableCell>
                          {ALL_ROLES.map((role) => {
                            const hasAccess = ROLE_PERMISSIONS[role.value].includes(mod.key);
                            return (
                              <TableCell key={role.value} className="text-center">
                                {hasAccess ? (
                                  <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                  </div>
                                ) : (
                                  <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-muted">
                                    <XCircle className="h-4 w-4 text-muted-foreground/40" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ALL_ROLES.map((role) => {
                const perms = ROLE_PERMISSIONS[role.value];
                const count = roleCounts[role.value] ?? 0;
                return (
                  <Card key={role.value}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold", role.color)}>
                          <Shield className="h-3.5 w-3.5" />
                          {role.label}
                        </div>
                        <Badge variant="secondary">{count} user{count !== 1 ? "s" : ""}</Badge>
                      </div>
                      <CardDescription className="pt-1">{role.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Accessible Modules ({perms.length} of {MODULES.length})
                      </p>
                      <div className="space-y-1.5">
                        {MODULES.map((mod) => {
                          const has = perms.includes(mod.key);
                          return (
                            <div
                              key={mod.key}
                              className={cn(
                                "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm",
                                has ? "bg-emerald-50 dark:bg-emerald-950/20" : "opacity-40"
                              )}
                            >
                              <mod.icon className={cn("h-3.5 w-3.5", has ? "text-emerald-600" : "text-muted-foreground")} />
                              <span className={cn(has ? "font-medium" : "line-through text-muted-foreground")}>{mod.label}</span>
                              {has && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 ml-auto" />}
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

      {/* ======================== ADD / EDIT USER DIALOG ======================== */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) setDialogOpen(false); }}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Create New User"}</DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Update user details and role assignment."
                : "Add a new user to the system with a role."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {formError && (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                {formError}
              </div>
            )}

            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="user@fleetflow.com"
              />
            </div>

            <div className="space-y-2">
              <Label>{editingUser ? "New Password (leave blank to keep)" : "Password *"}</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder={editingUser ? "Leave blank to keep current" : "Min. 6 characters"}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Role *</Label>
              <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v as UserRole }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_ROLES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      <div className="flex items-center gap-2">
                        <Shield className="h-3.5 w-3.5" />
                        <span>{r.label}</span>
                        <span className="text-xs text-muted-foreground ml-1">— {r.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">This role will have access to:</p>
              <div className="flex flex-wrap gap-1.5">
                {ROLE_PERMISSIONS[form.role].map((p) => (
                  <Badge key={p} variant="success" className="text-[10px]">
                    {MODULES.find((m) => m.key === p)?.label ?? p}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : editingUser ? "Save Changes" : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ======================== DELETE DIALOG ======================== */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">{userToDelete?.name}</span>{" "}
              ({userToDelete?.email})? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ======================== RESET PASSWORD DIALOG ======================== */}
      <Dialog open={resetPwDialogOpen} onOpenChange={setResetPwDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Set a new password for <span className="font-semibold text-foreground">{resetPwUser?.name}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="text"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="Min. 6 characters"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetPwDialogOpen(false)} disabled={resetPwSaving}>Cancel</Button>
            <Button onClick={handleResetPw} disabled={resetPwSaving || newPw.length < 6}>
              <KeyRound className="mr-2 h-4 w-4" />
              {resetPwSaving ? "Resetting..." : "Reset Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
