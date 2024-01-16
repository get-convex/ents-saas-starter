import { RedirectToHome } from "@/app/(dashboard)/RedirectToHome";
import { TeamMenu } from "@/app/(dashboard)/TeamMenu";
import { ProfileButton } from "@/app/(dashboard)/[teamSlug]/ProfileButton";
import ConvexClientProvider from "@/app/ConvexClientProvider";
import { StickyHeader } from "@/components/layout/sticky-header";
import TeamSwitcher from "@/components/team-switcher";
import { Toaster } from "@/components/ui/toaster";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexClientProvider>
      <RedirectToHome />

      <StickyHeader className="px-4 py-2 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <TeamSwitcher />
          <ProfileButton />
        </div>
        <TeamMenu />
      </StickyHeader>
      {children}
      <Toaster />
    </ConvexClientProvider>
  );
}
