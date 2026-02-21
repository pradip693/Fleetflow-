import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";
import { Pagination } from "@/components/ui/pagination";
import type { Expense, ExpenseType, Vehicle } from "@/types";

interface ExpenseTableProps {
    expenses: Expense[];
    vehicleMap: Map<number, Vehicle>;
    page: number;
    pageSize: number;
    totalFiltered: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    onEdit: (expense: Expense) => void;
}

export function ExpenseTable({
    expenses,
    vehicleMap,
    page,
    pageSize,
    totalFiltered,
    onPageChange,
    onPageSizeChange,
    onEdit,
}: ExpenseTableProps) {
    const typeBadgeVariant = (type: ExpenseType) => {
        switch (type) {
            case "Fuel":
                return "info" as const;
            case "Toll":
                return "warning" as const;
            case "Parking":
                return "secondary" as const;
            default:
                return "outline" as const;
        }
    };

    return (
        <Card className="glass-card border-none shadow-xl shadow-indigo-500/5 overflow-hidden">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-lg font-bold">Expense Records</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                            <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground pl-6">Vehicle</TableHead>
                            <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Trip ID</TableHead>
                            <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Type</TableHead>
                            <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Liters</TableHead>
                            <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Cost</TableHead>
                            <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Date</TableHead>
                            <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Notes</TableHead>
                            <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest text-muted-foreground pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {expenses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-32 text-center text-muted-foreground font-medium">
                                    No expenses found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            expenses.map((expense) => (
                                <TableRow key={expense.id} className="border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                    <TableCell className="font-bold pl-6">
                                        {vehicleMap.get(expense.vehicleId)?.name ?? `Vehicle #${expense.vehicleId}`}
                                    </TableCell>
                                    <TableCell>
                                        {expense.tripId ? (
                                            <Badge variant="outline" className="font-mono text-[10px]">#{expense.tripId}</Badge>
                                        ) : (
                                            <span className="text-muted-foreground text-xs font-medium">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={typeBadgeVariant(expense.type)} className="font-bold uppercase text-[10px] px-2">{expense.type}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        {expense.type === "Fuel" ? `${formatNumber(expense.liters)} L` : <span className="text-muted-foreground opacity-30">-</span>}
                                    </TableCell>
                                    <TableCell className="text-right font-black tracking-tighter text-indigo-600 dark:text-indigo-400">
                                        {formatCurrency(expense.cost)}
                                    </TableCell>
                                    <TableCell className="text-xs font-medium text-muted-foreground">{formatDate(expense.date)}</TableCell>
                                    <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground italic">
                                        {expense.notes || <span className="text-muted-foreground opacity-30">-</span>}
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEdit(expense)}
                                            className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors rounded-lg"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <div className="border-t border-slate-100 dark:border-slate-800 p-4">
                    <Pagination
                        totalItems={totalFiltered}
                        pageSize={pageSize}
                        currentPage={page}
                        onPageChange={onPageChange}
                        onPageSizeChange={onPageSizeChange}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
