"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChangePasswordForm } from "@/features/profile-settings/components/change-password-form";
import { UpdateProfileForm } from "@/features/profile-settings/components/update-profile-form";
import { Lock, User } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function ProfileSettingsPage() {
  const searchParams = useSearchParams();
  const defaultTab =
    searchParams.get("tab") === "settings" ? "settings" : "profile";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile information and security settings
        </p>
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Lock className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="p-6">
            <UpdateProfileForm />
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-6">
            <ChangePasswordForm />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
