import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

interface TripFiltersProps {
    search: string;
    setSearch: (val: string) => void;
    activeTab: string;
    setActiveTab: (val: string) => void;
    counts: Record<string, number>;
}

export function TripFilters({ search, setSearch, activeTab, setActiveTab, counts }: TripFiltersProps) {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search manifests, routes, drivers..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 rounded-xl border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20"
                    />
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl h-auto flex-wrap">
                    <TabsTrigger value="all" className="rounded-xl px-6 py-2.5 font-black uppercase text-[10px] tracking-widest data-[state=active]:shadow-lg">
                        All Tasks ({counts.all ?? 0})
                    </TabsTrigger>
                    <TabsTrigger value="Draft" className="rounded-xl px-6 py-2.5 font-black uppercase text-[10px] tracking-widest data-[state=active]:shadow-lg">
                        Drafts ({counts["Draft"] ?? 0})
                    </TabsTrigger>
                    <TabsTrigger value="Dispatched" className="rounded-xl px-6 py-2.5 font-black uppercase text-[10px] tracking-widest data-[state=active]:shadow-lg">
                        En Route ({counts["Dispatched"] ?? 0})
                    </TabsTrigger>
                    <TabsTrigger value="Completed" className="rounded-xl px-6 py-2.5 font-black uppercase text-[10px] tracking-widest data-[state=active]:shadow-lg">
                        Verified ({counts["Completed"] ?? 0})
                    </TabsTrigger>
                    <TabsTrigger value="Cancelled" className="rounded-xl px-6 py-2.5 font-black uppercase text-[10px] tracking-widest data-[state=active]:shadow-lg text-destructive">
                        Aborted ({counts["Cancelled"] ?? 0})
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    );
}
