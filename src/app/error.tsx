"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Application Error:", error);
    }, [error]);

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center p-6 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertCircle className="h-10 w-10" />
            </div>

            <h1 className="mb-2 text-3xl font-bold tracking-tight">Something went wrong</h1>
            <p className="mb-8 max-w-md text-muted-foreground">
                An unexpected error occurred in the fleet management system.
                We've logged the details and our team will look into it.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
                <Button onClick={() => reset()} className="gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Try again
                </Button>

                <Button variant="outline" asChild className="gap-2">
                    <Link href="/">
                        <Home className="h-4 w-4" />
                        Back to Home
                    </Link>
                </Button>
            </div>

            <div className="mt-12 text-left">
                <details className="cursor-pointer text-xs text-muted-foreground">
                    <summary className="hover:text-foreground transition-colors">Technical Details</summary>
                    <pre className="mt-4 max-w-lg overflow-auto rounded-lg bg-muted p-4 font-mono text-[10px]">
                        {error.message || "Unknown error"}
                        {error.digest && `\nDigest: ${error.digest}`}
                        {error.stack && `\n\nStack Trace:\n${error.stack.slice(0, 500)}...`}
                    </pre>
                </details>
            </div>
        </div>
    );
}
