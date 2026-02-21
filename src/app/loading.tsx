export default function Loading() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background/50 backdrop-blur-sm">
            <div className="relative flex items-center justify-center">
                <div className="h-20 w-20 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                <div className="absolute h-10 w-10 animate-pulse rounded-full bg-primary/20" />
            </div>
            <div className="mt-8 flex flex-col items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-foreground/80">FleetFlow</h2>
                <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
                </div>
                <p className="mt-2 text-sm font-medium text-muted-foreground">Initializing logistics data...</p>
            </div>
        </div>
    );
}
