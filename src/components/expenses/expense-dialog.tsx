import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { parseISO, format } from "date-fns";
import type { Vehicle, Trip, ExpenseType, Expense } from "@/types";

interface ExpenseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingId: number | null;
    form: Omit<Expense, "id">;
    setForm: React.Dispatch<React.SetStateAction<Omit<Expense, "id">>>;
    vehicles: Vehicle[];
    completedTrips: Trip[];
    expenseTypes: ExpenseType[];
    onSubmit: () => Promise<void>;
}

export function ExpenseDialog({
    open,
    onOpenChange,
    editingId,
    form,
    setForm,
    vehicles,
    completedTrips,
    expenseTypes,
    onSubmit,
}: ExpenseDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto glass-card border-none shadow-2xl rounded-2xl p-0">
                <div className="h-1.5 w-full bg-gradient-to-r from-primary to-indigo-400 sticky top-0 z-10" />
                <div className="p-6">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-2xl font-bold tracking-tight">
                            {editingId ? "Edit Expense" : "Add New Expense"}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground font-medium">
                            {editingId ? "Update the expense details below." : "Log a new expense or fuel purchase."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Vehicle *</Label>
                            <Select
                                value={form.vehicleId ? String(form.vehicleId) : ""}
                                onValueChange={(v) => setForm((f) => ({ ...f, vehicleId: Number(v) }))}
                            >
                                <SelectTrigger className="rounded-xl h-11">
                                    <SelectValue placeholder="Select vehicle" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    {vehicles.map((v) => (
                                        <SelectItem key={v.id} value={String(v.id)}>
                                            {v.name} ({v.licensePlate})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Trip (Optional)</Label>
                            <Select
                                value={form.tripId ? String(form.tripId) : "none"}
                                onValueChange={(v) =>
                                    setForm((f) => ({ ...f, tripId: v === "none" ? null : Number(v) }))
                                }
                            >
                                <SelectTrigger className="rounded-xl h-11">
                                    <SelectValue placeholder="No trip linked" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="none">No trip linked</SelectItem>
                                    {completedTrips.map((t) => (
                                        <SelectItem key={t.id} value={String(t.id)}>
                                            #{t.id} - {t.origin} → {t.destination}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">Type *</Label>
                                <Select
                                    value={form.type}
                                    onValueChange={(v) => setForm((f) => ({ ...f, type: v as ExpenseType }))}
                                >
                                    <SelectTrigger className="rounded-xl h-11">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {expenseTypes.map((t) => (
                                            <SelectItem key={t} value={t}>
                                                {t}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {form.type === "Fuel" ? (
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Liters</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        className="rounded-xl h-11"
                                        value={form.liters || ""}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, liters: parseFloat(e.target.value) || 0 }))
                                        }
                                        placeholder="Liters"
                                    />
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Date *</Label>
                                    <DatePicker
                                        date={form.date ? parseISO(form.date) : undefined}
                                        setDate={(d) => setForm((f) => ({ ...f, date: d ? format(d, "yyyy-MM-dd") : "" }))}
                                        className="rounded-xl h-11"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">Cost (₹) *</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="rounded-xl h-11 font-bold"
                                    value={form.cost || ""}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, cost: parseFloat(e.target.value) || 0 }))
                                    }
                                    placeholder="0.00"
                                />
                            </div>

                            {form.type === "Fuel" && (
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Date *</Label>
                                    <DatePicker
                                        date={form.date ? parseISO(form.date) : undefined}
                                        setDate={(d) => setForm((f) => ({ ...f, date: d ? format(d, "yyyy-MM-dd") : "" }))}
                                        className="rounded-xl h-11"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Notes</Label>
                            <Textarea
                                className="rounded-xl min-h-[80px]"
                                value={form.notes}
                                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                                placeholder="Optional expense notes..."
                                rows={2}
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-4 gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl h-11 font-bold">
                            Cancel
                        </Button>
                        <Button
                            onClick={onSubmit}
                            disabled={!form.vehicleId || form.cost <= 0}
                            className="rounded-xl h-11 font-bold shadow-lg shadow-primary/20"
                        >
                            {editingId ? "Update" : "Add"} Expense
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
