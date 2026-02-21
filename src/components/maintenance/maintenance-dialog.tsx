import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Wrench, Pencil, Plus } from "lucide-react";
import { parseISO, format } from "date-fns";
import type { Maintenance, MaintenanceStatus, Vehicle } from "@/types";

interface MaintenanceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editing: Maintenance | null;
    form: any;
    setForm: any;
    formError: string;
    vehicles: Vehicle[];
    serviceTypes: readonly string[];
    onSave: () => Promise<void>;
    resetForm: () => void;
}

export function MaintenanceDialog({
    open,
    onOpenChange,
    editing,
    form,
    setForm,
    formError,
    vehicles,
    serviceTypes,
    onSave,
    resetForm,
}: MaintenanceDialogProps) {
    return (
        <Dialog open={open} onOpenChange={(val) => { if (!val) resetForm(); onOpenChange(val); }}>
            <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto glass-card border-none shadow-2xl rounded-2xl p-0">
                <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 to-indigo-500 sticky top-0 z-10" />
                <div className="p-8">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-black tracking-tight">
                            {editing ? "Refine Service Log" : "New Service Registry"}
                        </DialogTitle>
                        <DialogDescription className="font-medium text-muted-foreground">
                            {editing
                                ? "Modify the existing maintenance telemetry for this asset."
                                : "Log a new maintenance event or scheduled service for the fleet."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6">
                        {formError && (
                            <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-4 text-[11px] font-black uppercase tracking-widest text-destructive">
                                {formError}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Target Asset *</Label>
                            <Select
                                value={form.vehicleId}
                                onValueChange={(v) => setForm((f: any) => ({ ...f, vehicleId: v }))}
                            >
                                <SelectTrigger className="rounded-xl h-11 border-slate-200 dark:border-slate-800">
                                    <SelectValue placeholder="Select vehicle" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl font-bold">
                                    {vehicles.map((v) => (
                                        <SelectItem key={v.id} value={String(v.id)}>
                                            {v.name} — {v.licensePlate}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Service Classification *</Label>
                                <Select
                                    value={form.type}
                                    onValueChange={(v) => setForm((f: any) => ({ ...f, type: v }))}
                                >
                                    <SelectTrigger className="rounded-xl h-11 border-slate-200 dark:border-slate-800">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl font-bold">
                                        {serviceTypes.map((type) => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Registry Status</Label>
                                <Select
                                    value={form.status}
                                    onValueChange={(v) => setForm((f: any) => ({ ...f, status: v as MaintenanceStatus }))}
                                >
                                    <SelectTrigger className="rounded-xl h-11 border-slate-200 dark:border-slate-800">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl font-bold">
                                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Service Directives</Label>
                            <Textarea
                                placeholder="Describe the maintenance requirements or identified issues..."
                                value={form.description}
                                onChange={(e) => setForm((f: any) => ({ ...f, description: e.target.value }))}
                                className="rounded-2xl border-slate-200 dark:border-slate-800 font-semibold"
                                rows={2}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Financial Impact (₹) *</Label>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={form.cost}
                                    onChange={(e) => setForm((f: any) => ({ ...f, cost: e.target.value }))}
                                    className="rounded-xl h-11 border-slate-200 dark:border-slate-800 font-black"
                                />
                            </div>
                            <div className="space-y-2 flex flex-col">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1 mb-2">Service Timestamp *</Label>
                                <DatePicker
                                    date={form.date ? parseISO(form.date) : undefined}
                                    setDate={(d) => setForm((f: any) => ({ ...f, date: d ? format(d, "yyyy-MM-dd") : "" }))}
                                    className="rounded-xl h-11 w-full border-slate-200 dark:border-slate-800"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Assigned Technician *</Label>
                            <Input
                                placeholder="Full name of mechanic or facility"
                                value={form.mechanic}
                                onChange={(e) => setForm((f: any) => ({ ...f, mechanic: e.target.value }))}
                                className="rounded-xl h-11 border-slate-200 dark:border-slate-800 font-bold"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 flex flex-col">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1 mb-2">Next Cycle Date</Label>
                                <DatePicker
                                    date={form.nextDueDate ? parseISO(form.nextDueDate) : undefined}
                                    setDate={(d) => setForm((f: any) => ({ ...f, nextDueDate: d ? format(d, "yyyy-MM-dd") : "" }))}
                                    className="rounded-xl h-11 w-full border-slate-200 dark:border-slate-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Next Log Metric (km)</Label>
                                <Input
                                    type="number"
                                    placeholder="Odometer target"
                                    value={form.nextDueOdometer}
                                    onChange={(e) => setForm((f: any) => ({ ...f, nextDueOdometer: e.target.value }))}
                                    className="rounded-xl h-11 border-slate-200 dark:border-slate-800 font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-8 gap-3 sm:gap-2">
                        <Button
                            variant="outline"
                            onClick={() => { resetForm(); onOpenChange(false); }}
                            className="rounded-xl h-11 font-black uppercase text-xs tracking-widest flex-1 border-slate-200 dark:border-slate-800"
                        >
                            Discard
                        </Button>
                        <Button
                            onClick={onSave}
                            className="rounded-xl h-11 font-black uppercase text-xs tracking-widest flex-[2] shadow-lg shadow-indigo-500/20"
                        >
                            {editing ? (
                                <><Pencil className="mr-2 h-4 w-4" /> Finalize Edit</>
                            ) : (
                                <><Plus className="mr-2 h-4 w-4" /> Commit Registry</>
                            )}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
