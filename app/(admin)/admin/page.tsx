import { DashboardStats } from "@/features/admin/components/dashboard-stats";
import { DashboardCharts } from "@/features/admin/components/dashboard-charts";
import { DashboardRecentActivity } from "@/features/admin/components/dashboard-recent-activity";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-8 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your projects today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Download Report</Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New Project
          </Button>
        </div>
      </div>

      <DashboardStats />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <DashboardCharts />
        <div className="lg:col-span-3">
          <DashboardRecentActivity />
        </div>
      </div>
    </div>
  );
}
