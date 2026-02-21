import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { AlertTriangle } from "lucide-react";
import { parseISO, format } from "date-fns";
import type { Driver, DriverStatus } from "@/types";

interface DriverDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingId: number | null;
    form: Omit<Driver, "id">;
    setForm: React.Dispatch<React.SetStateAction<Omit<Driver, "id">>>;
    onSubmit: () => Promise<void>;
    isExpired: (expiry: string) => boolean;
    statusOptions: DriverStatus[];
}

export function DriverDialog({
    open,
    onOpenChange,
    editingId,
    form,
    setForm,
    onSubmit,
    isExpired,
    statusOptions,
}: DriverDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto glass-card border-none shadow-2xl rounded-2xl p-0">
                <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-purple-500 sticky top-0 z-10" />
                <div className="p-8">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-black tracking-tight">
                            {editingId ? "Update Operator" : "Register Operator"}
                        </DialogTitle>
                        <DialogDescription className="font-medium text-muted-foreground">
                            {editingId
                                ? "Update the personnel record for this fleet operator."
                                : "Add a new specialized operator to the fleet management system."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Full Identity</Label>
                            <Input
                                value={form.name}
                                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                placeholder="Enter legal name"
                                className="rounded-xl h-11 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Email Channel</Label>
                                <Input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                                    placeholder="operator@fleet.com"
                                    className="rounded-xl h-11 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Phone Line</Label>
                                <Input
                                    value={form.phone}
                                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                                    placeholder="+91 XXXXX XXXXX"
                                    className="rounded-xl h-11 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">License ID</Label>
                                <Input
                                    value={form.licenseNumber}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, licenseNumber: e.target.value }))
                                    }
                                    placeholder="DL-14 20110012345"
                                    className="rounded-xl h-11 font-mono border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Qualifications</Label>
                                <Input
                                    value={form.licenseCategory}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, licenseCategory: e.target.value }))
                                    }
                                    placeholder="HCV, LCV, etc."
                                    className="rounded-xl h-11 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 flex flex-col">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1 mb-2">Credential Expiry</Label>
                                <DatePicker
                                    date={form.licenseExpiry ? parseISO(form.licenseExpiry) : undefined}
                                    setDate={(d) => setForm((f) => ({ ...f, licenseExpiry: d ? format(d, "yyyy-MM-dd") : "" }))}
                                    className="rounded-xl h-11 w-full border-slate-200 dark:border-slate-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Duty Status</Label>
                                <Select
                                    value={form.status}
                                    onValueChange={(v) =>
                                        setForm((f) => ({ ...f, status: v as DriverStatus }))
                                    }
                                >
                                    <SelectTrigger className="rounded-xl h-11 border-slate-200 dark:border-slate-800">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {statusOptions.map((s) => (
                                            <SelectItem key={s} value={s}>
                                                {s}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {form.licenseExpiry && isExpired(form.licenseExpiry) && (
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-xs font-bold">
                                <AlertTriangle className="h-5 w-5 shrink-0" />
                                <span>
                                    CRITICAL: This license has expired. Compliance protocols prohibit assignment to new operations.
                                </span>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="mt-8 gap-3 sm:gap-2">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="rounded-xl h-11 font-black uppercase text-xs tracking-widest flex-1 border-slate-200 dark:border-slate-800"
                        >
                            Discard
                        </Button>
                        <Button
                            onClick={onSubmit}
                            disabled={!form.name || !form.licenseNumber || !form.licenseExpiry}
                            className="rounded-xl h-11 font-black uppercase text-xs tracking-widest flex-[2] shadow-lg shadow-indigo-500/20"
                        >
                            {editingId ? "Update Member" : "Join Fleet"}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
