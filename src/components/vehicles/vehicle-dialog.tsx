import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/date-picker";
import { parseISO, format } from "date-fns";
import type { Vehicle, VehicleType, VehicleStatus } from "@/types";

interface VehicleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingVehicle: Vehicle | null;
    form: any;
    setForm: any;
    saving: boolean;
    onSave: () => Promise<void>;
    vehicleTypes: VehicleType[];
    regions: string[];
}

export function VehicleDialog({
    open,
    onOpenChange,
    editingVehicle,
    form,
    setForm,
    saving,
    onSave,
    vehicleTypes,
    regions,
}: VehicleDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto glass-card border-none shadow-2xl rounded-2xl p-0">
                <div className="h-1.5 w-full bg-gradient-to-r from-primary to-indigo-400 sticky top-0 z-10" />
                <div className="p-8">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-black tracking-tight">
                            {editingVehicle ? "Edit Vehicle" : "Add Vehicle"}
                        </DialogTitle>
                        <DialogDescription className="font-medium text-muted-foreground">
                            {editingVehicle
                                ? "Update the configuration for this fleet asset."
                                : "Enter the specifications for the new vehicle asset."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Name</Label>
                                <Input
                                    placeholder="e.g. Van-06"
                                    className="rounded-xl h-11 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20"
                                    value={form.name}
                                    onChange={(e) => setForm((f: any) => ({ ...f, name: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Model</Label>
                                <Input
                                    placeholder="e.g. Ford Transit 2024"
                                    className="rounded-xl h-11 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20"
                                    value={form.model}
                                    onChange={(e) => setForm((f: any) => ({ ...f, model: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">License Plate</Label>
                                <Input
                                    placeholder="e.g. MH 12 AB 1234"
                                    className="rounded-xl h-11 font-mono border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20"
                                    value={form.licensePlate}
                                    onChange={(e) => setForm((f: any) => ({ ...f, licensePlate: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Category</Label>
                                <Select
                                    value={form.type}
                                    onValueChange={(v) => setForm((f: any) => ({ ...f, type: v as VehicleType }))}
                                >
                                    <SelectTrigger className="rounded-xl h-11 border-slate-200 dark:border-slate-800">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
                                        {vehicleTypes.map((t) => (
                                            <SelectItem key={t} value={t}>{t}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 flex flex-col">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1 mb-2">Acquired Date</Label>
                                <DatePicker
                                    date={form.acquiredDate ? parseISO(form.acquiredDate) : undefined}
                                    setDate={(d) => setForm((f: any) => ({ ...f, acquiredDate: d ? format(d, "yyyy-MM-dd") : "" }))}
                                    className="rounded-xl h-11 w-full border-slate-200 dark:border-slate-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Acquisition Cost (₹)</Label>
                                <Input
                                    type="number"
                                    className="rounded-xl h-11 font-bold border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20"
                                    value={form.acquisitionCost}
                                    onChange={(e) => setForm((f: any) => ({ ...f, acquisitionCost: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Payload Cap (kg)</Label>
                                <Input
                                    type="number"
                                    className="rounded-xl h-11 font-bold border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20"
                                    value={form.maxCapacity}
                                    onChange={(e) => setForm((f: any) => ({ ...f, maxCapacity: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Operational Region</Label>
                                <Select
                                    value={form.region}
                                    onValueChange={(v) => setForm((f: any) => ({ ...f, region: v }))}
                                >
                                    <SelectTrigger className="rounded-xl h-11 border-slate-200 dark:border-slate-800">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
                                        {regions.map((r) => (
                                            <SelectItem key={r} value={r}>{r}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {editingVehicle && (
                            <div className="flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4">
                                <div className="space-y-0.5">
                                    <Label className="font-bold text-sm">Asset Availability</Label>
                                    <p className="text-[11px] font-bold text-muted-foreground uppercase opacity-70">
                                        Manually mark as out of service
                                    </p>
                                </div>
                                <Switch
                                    checked={form.status === "Out of Service"}
                                    onCheckedChange={(checked) =>
                                        setForm((f: any) => ({
                                            ...f,
                                            status: checked ? "Out of Service" : "Available",
                                        }))
                                    }
                                />
                            </div>
                        )}
                    </div>

                    <DialogFooter className="mt-8 gap-3 sm:gap-2">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={saving}
                            className="rounded-xl h-11 font-black uppercase text-xs tracking-widest flex-1 border-slate-200 dark:border-slate-800"
                        >
                            Discard
                        </Button>
                        <Button
                            onClick={onSave}
                            disabled={saving || !form.name || !form.model || !form.licensePlate || !form.maxCapacity}
                            className="rounded-xl h-11 font-black uppercase text-xs tracking-widest flex-[2] shadow-lg shadow-indigo-500/20"
                        >
                            {saving ? "Processing..." : editingVehicle ? "Update Asset" : "Register Vehicle"}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
