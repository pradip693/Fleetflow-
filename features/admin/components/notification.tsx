import * as React from "react";
import { Bell, Mail, MessageSquare, AlertCircle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const notifications = [
  {
    id: 1,
    title: "New Message",
    description: "Alice sent you a direct message.",
    time: "2 min ago",
    icon: MessageSquare,
    color: "text-blue-500",
    read: false,
  },
  {
    id: 2,
    title: "System Alert",
    description: "Your subscription expires in 3 days.",
    time: "1 hour ago",
    icon: AlertCircle,
    color: "text-amber-500",
    read: false,
  },
  {
    id: 3,
    title: "Project Update",
    description: "The dashboard project has been completed.",
    time: "5 hours ago",
    icon: Mail,
    color: "text-green-500",
    read: true,
  },
];

export function NotificationDropdown() {
  const [hasUnread, setHasUnread] = React.useState(true);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "relative h-8 w-8 rounded-full"
        )}
      >
        <Bell className="h-4 w-4" />
        {hasUnread && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        )}
        <span className="sr-only">Toggle notifications</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80" align="end">
        <div className="flex items-center justify-between px-4 py-2">
          {/* Fixed: Used standard HTML instead of DropdownMenuLabel to avoid GroupContext error */}
          <p className="text-sm font-semibold">Notifications</p>
          {hasUnread && (
            <Button
              variant="ghost"
              className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
              onClick={() => setHasUnread(false)}
            >
              Mark all read
            </Button>
          )}
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
          {notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex cursor-pointer flex-col items-start gap-1 p-4"
            >
              <div className="flex w-full items-start gap-3">
                <div className={`mt-0.5 ${notification.color}`}>
                  <notification.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {notification.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {notification.description}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60">
                    {notification.time}
                  </p>
                </div>
                {!notification.read && hasUnread && (
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <div className="p-2">
          <Button
            variant="outline"
            className="w-full h-8 text-xs"
            onClick={() => console.log("View all")}
          >
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}