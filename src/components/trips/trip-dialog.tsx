import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import type { Vehicle, Driver } from "@/types";

interface TripDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    form: any;
    setForm: any;
    formError: string;
    setFormError: (err: string) => void;
    availableVehicles: Vehicle[];
    availableDrivers: Driver[];
    selectedVehicle: Vehicle | null | undefined;
    onSubmit: () => Promise<void>;
    resetForm: () => void;
}

export function TripDialog({
    open,
    onOpenChange,
    form,
    setForm,
    formError,
    setFormError,
    availableVehicles,
    availableDrivers,
    selectedVehicle,
    onSubmit,
    resetForm,
}: TripDialogProps) {
    return (
        <Dialog open={open} onOpenChange={(val) => { if (!val) resetForm(); onOpenChange(val); }}>
            <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto glass-card border-none shadow-2xl rounded-2xl p-0">
                <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-emerald-500 sticky top-0 z-10" />
                <div className="p-8">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-black tracking-tight">Create Logistics Manifest</DialogTitle>
                        <DialogDescription className="font-medium text-muted-foreground">
                            Define the parameters for a new fleet deployment task.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6">
                        {formError && (
                            <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-4 text-[11px] font-black uppercase tracking-widest text-destructive">
                                {formError}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Deployment Asset *</Label>
                                <Select
                                    value={form.vehicleId}
                                    onValueChange={(v) => { setForm((f: any) => ({ ...f, vehicleId: v })); setFormError(""); }}
                                >
                                    <SelectTrigger className="rounded-xl h-11 border-slate-200 dark:border-slate-800">
                                        <SelectValue placeholder="Select vehicle" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl font-bold">
                                        {availableVehicles.length === 0 ? (
                                            <SelectItem value="__none" disabled>No field-ready assets</SelectItem>
                                        ) : (
                                            availableVehicles.map((v) => (
                                                <SelectItem key={v.id} value={String(v.id)}>
                                                    {v.name} ({v.maxCapacity}kg)
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Authorized Operator *</Label>
                                <Select
                                    value={form.driverId}
                                    onValueChange={(v) => setForm((f: any) => ({ ...f, driverId: v }))}
                                >
                                    <SelectTrigger className="rounded-xl h-11 border-slate-200 dark:border-slate-800">
                                        <SelectValue placeholder="Select operator" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl font-bold">
                                        {availableDrivers.length === 0 ? (
                                            <SelectItem value="__none" disabled>No operators on duty</SelectItem>
                                        ) : (
                                            availableDrivers.map((d) => (
                                                <SelectItem key={d.id} value={String(d.id)}>
                                                    {d.name}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Logistic Origin *</Label>
                                <Input
                                    placeholder="Dispatch Point"
                                    className="rounded-xl h-11 border-slate-200 dark:border-slate-800 font-bold"
                                    value={form.origin}
                                    onChange={(e) => setForm((f: any) => ({ ...f, origin: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Delivery Endpoint *</Label>
                                <Input
                                    placeholder="Target Destination"
                                    className="rounded-xl h-11 border-slate-200 dark:border-slate-800 font-bold"
                                    value={form.destination}
                                    onChange={(e) => setForm((f: any) => ({ ...f, destination: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Cargo Payload (kg) *</Label>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    className="rounded-xl h-11 border-slate-200 dark:border-slate-800 font-black"
                                    value={form.cargoWeight}
                                    onChange={(e) => { setForm((f: any) => ({ ...f, cargoWeight: e.target.value })); setFormError(""); }}
                                />
                                {selectedVehicle && (
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter pl-1">
                                        Asset Capacity: {selectedVehicle.maxCapacity.toLocaleString()} kg
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Manifest Distance (km)</Label>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    className="rounded-xl h-11 border-slate-200 dark:border-slate-800 font-black"
                                    value={form.estimatedDistance}
                                    onChange={(e) => setForm((f: any) => ({ ...f, estimatedDistance: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Logistics Detail</Label>
                            <Input
                                placeholder="What payload is being transported?"
                                className="rounded-xl h-11 border-slate-200 dark:border-slate-800 font-bold"
                                value={form.cargoDescription}
                                onChange={(e) => setForm((f: any) => ({ ...f, cargoDescription: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Operational Directives</Label>
                            <Textarea
                                placeholder="Special handling instructions or field notes..."
                                className="rounded-2xl border-slate-200 dark:border-slate-800 font-semibold"
                                value={form.notes}
                                onChange={(e) => setForm((f: any) => ({ ...f, notes: e.target.value }))}
                                rows={3}
                            />
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
                            onClick={onSubmit}
                            className="rounded-xl h-11 font-black uppercase text-xs tracking-widest flex-[2] shadow-lg shadow-indigo-500/20"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Finalize Manifest
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
