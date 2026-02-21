"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Subscriptions",
    value: "+2,350",
    change: "+180.1%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Active Now",
    value: "+573",
    change: "+201",
    trend: "up",
    icon: Activity,
  },
  {
    title: "Churn Rate",
    value: "2.4%",
    change: "-4.2%",
    trend: "down",
    icon: ArrowDownRight,
  },
];

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              {stat.trend === "up" ? (
                <span className="text-emerald-500 flex items-center">
                  <ArrowUpRight className="h-3 w-3" /> {stat.change}
                </span>
              ) : (
                <span className="text-rose-500 flex items-center">
                  <ArrowDownRight className="h-3 w-3" /> {stat.change}
                </span>
              )}
              <span>from last month</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
