import { SettingsMenu } from "@/app/t/[teamSlug]/settings/SettingsMenu";
import { StickySidebar } from "@/components/layout/sticky-sidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container sm:grid grid-cols-[12rem_minmax(0,1fr)] gap-6 px-4">
      <StickySidebar className="hidden sm:block top-[calc(6rem+1px)] h-[calc(100vh-(6rem+1px))] py-8">
        <SettingsMenu />
      </StickySidebar>
      <main className="min-h-[calc(100vh-(6rem+1px))] flex flex-col gap-6">
        {children}
      </main>
    </div>
  );
}
