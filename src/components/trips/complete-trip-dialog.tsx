import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckCircle2 } from "lucide-react";
import type { Trip } from "@/types";

interface CompleteTripDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    trip: Trip | null;
    endOdometer: string;
    setEndOdometer: (val: string) => void;
    onComplete: () => Promise<void>;
}

export function CompleteTripDialog({
    open,
    onOpenChange,
    trip,
    endOdometer,
    setEndOdometer,
    onComplete,
}: CompleteTripDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] max-h-[90vh] overflow-y-auto glass-card border-none shadow-2xl rounded-2xl p-0">
                <div className="h-1.5 w-full bg-emerald-500 sticky top-0 z-10" />
                <div className="p-8">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-black tracking-tight text-center">Terminate Manifest</DialogTitle>
                        <DialogDescription className="font-medium text-muted-foreground text-center">
                            Validate task completion by logging the final odometer telemetry.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6">
                        {trip?.startOdometer != null && (
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Initial Log</span>
                                <span className="font-black text-sm">{trip.startOdometer.toLocaleString()} km</span>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Final Telemetry (km) *</Label>
                            <Input
                                type="number"
                                placeholder="Current vehicle log"
                                className="rounded-xl h-11 border-slate-200 dark:border-slate-800 font-black text-lg text-center"
                                value={endOdometer}
                                onChange={(e) => setEndOdometer(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-8 flex-col gap-3">
                        <Button
                            onClick={onComplete}
                            disabled={!endOdometer || Number(endOdometer) <= (trip?.startOdometer || 0)}
                            className="rounded-xl h-12 font-black uppercase text-xs tracking-widest w-full shadow-lg shadow-emerald-500/20"
                        >
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Verify Completion
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
