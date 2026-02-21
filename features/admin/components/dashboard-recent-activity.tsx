"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const activities = [
  {
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    amount: "+$1,999.00",
    status: "Paid",
    initials: "OM",
  },
  {
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    amount: "+$39.00",
    status: "Paid",
    initials: "JL",
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    amount: "+$299.00",
    status: "Paid",
    initials: "IN",
  },
  {
    name: "William Kim",
    email: "will@email.com",
    amount: "+$99.00",
    status: "Paid",
    initials: "WK",
  },
  {
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    amount: "+$39.00",
    status: "Paid",
    initials: "SD",
  },
];

export function DashboardRecentActivity() {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>You made 265 sales this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-center group cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
            >
              <Avatar className="h-9 w-9">
                <AvatarFallback>{activity.initials}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                  {activity.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activity.email}
                </p>
              </div>
              <div className="ml-auto font-medium">{activity.amount}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
