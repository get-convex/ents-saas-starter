import { ProfileButton } from "@/app/(dashboard)/[teamSlug]/ProfileButton";
import ConvexClientProvider from "@/app/ConvexClientProvider";
import { StickyHeader } from "@/components/layout/sticky-header";
import TeamSwitcher from "@/components/team-switcher";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexClientProvider>
      <StickyHeader className="px-4 py-2">
        <div className="flex justify-between items-center">
          <TeamSwitcher />
          <ProfileButton />
        </div>
      </StickyHeader>
      <main className="container max-w-2xl flex flex-col gap-8">
        {children}
      </main>
    </ConvexClientProvider>
  );
}
