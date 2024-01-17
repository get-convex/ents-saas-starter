import { ConvexClientProvider } from "@/app/ConvexClientProvider";
import { AcceptInviteDialog } from "@/app/t/AcceptInviteDialog";
import { Notifications } from "@/app/t/Notifications";
import { TeamMenu } from "@/app/t/TeamMenu";
import { ProfileButton } from "@/app/t/[teamSlug]/ProfileButton";
import { StickyHeader } from "@/components/layout/sticky-header";
import { TeamSwitcher } from "@/app/t/TeamSwitcher";
import { Toaster } from "@/components/ui/toaster";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexClientProvider>
      <StickyHeader className="px-4 py-2 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <TeamSwitcher />
          <div className="flex items-center gap-4">
            <Notifications />
            <ProfileButton />
          </div>
        </div>
        <TeamMenu />
      </StickyHeader>
      {children}
      <AcceptInviteDialog />
      <Toaster />
    </ConvexClientProvider>
  );
}
