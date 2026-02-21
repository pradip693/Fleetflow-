import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import type { Maintenance, Vehicle } from "@/types";

interface CompleteMaintenanceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    record: Maintenance | null;
    vehicleMap: Map<number, Vehicle>;
    onMarkCompleted: (restoreVehicle: boolean) => Promise<void>;
}

export function CompleteMaintenanceDialog({
    open,
    onOpenChange,
    record,
    vehicleMap,
    onMarkCompleted,
}: CompleteMaintenanceDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[440px] max-h-[90vh] overflow-y-auto glass-card border-none shadow-2xl rounded-2xl p-0">
                <div className="h-1.5 w-full bg-emerald-500 sticky top-0 z-10" />
                <div className="p-8">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-black tracking-tight text-center">Protocol Termination</DialogTitle>
                        <DialogDescription className="font-medium text-muted-foreground text-center">
                            Acknowledge service completion and define the asset's next operational status.
                        </DialogDescription>
                    </DialogHeader>
                    {record && (
                        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-3 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Asset Identity</span>
                                <span className="font-black text-sm">{vehicleMap.get(record.vehicleId)?.name}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Service Protocol</span>
                                <span className="font-black text-indigo-600">{record.type}</span>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="flex-col gap-3">
                        <Button
                            onClick={() => onMarkCompleted(true)}
                            className="rounded-xl h-12 font-black uppercase text-xs tracking-widest w-full shadow-lg shadow-emerald-500/20"
                        >
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Terminate & Restore Asset
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => onMarkCompleted(false)}
                            className="rounded-xl h-12 font-black uppercase text-xs tracking-widest w-full"
                        >
                            Terminate Protocol Only
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="rounded-xl h-10 font-black uppercase text-[10px] tracking-widest w-full text-muted-foreground"
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
