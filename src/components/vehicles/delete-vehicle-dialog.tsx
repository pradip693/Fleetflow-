import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Vehicle } from "@/types";

interface DeleteVehicleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    vehicle: Vehicle | null;
    deleting: boolean;
    onDelete: () => Promise<void>;
}

export function DeleteVehicleDialog({
    open,
    onOpenChange,
    vehicle,
    deleting,
    onDelete,
}: DeleteVehicleDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[420px] max-h-[90vh] overflow-y-auto glass-card border-none shadow-2xl rounded-2xl p-0">
                <div className="h-1.5 w-full bg-destructive sticky top-0 z-10" />
                <div className="p-8">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-xl font-black tracking-tight">Decommission Asset</DialogTitle>
                        <DialogDescription className="font-medium">
                            Are you sure you want to permanently delete{" "}
                            <span className="font-black text-foreground">
                                {vehicle?.name}
                            </span>{" "}
                            ({vehicle?.licensePlate})? This records all historical data as archived.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-3 sm:gap-2">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={deleting}
                            className="rounded-xl h-11 font-black uppercase text-xs tracking-widest flex-1 border-slate-200 dark:border-slate-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={onDelete}
                            disabled={deleting}
                            className="rounded-xl h-11 font-black uppercase text-xs tracking-widest flex-1 shadow-lg shadow-destructive/20"
                        >
                            {deleting ? "Deleting..." : "Confirm Delete"}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
