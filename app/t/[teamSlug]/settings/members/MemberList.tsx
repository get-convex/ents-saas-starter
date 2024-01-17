import { useCurrentTeam, useViewerPermissions } from "@/app/t/[teamSlug]/hooks";
import { SelectRole } from "@/app/t/[teamSlug]/settings/members/SelectRole";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/convex/_generated/api";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery } from "convex/react";
import { FunctionReturnType } from "convex/server";
import { ConvexError } from "convex/values";

export function MembersList() {
  const team = useCurrentTeam();
  const viewerPermissions = useViewerPermissions();

  const members = useQuery(api.users.teams.members.list, {
    teamId: team?._id,
  });
  const invites = useQuery(api.users.teams.members.invites.list, {
    teamId: team?._id,
  });

  if (
    team == null ||
    members == null ||
    viewerPermissions == null ||
    invites == null
  ) {
    return null;
  }
  return (
    <Card>
      <CardContent>
        <Tabs defaultValue="members" className="pt-6">
          <TabsList>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="invites">Pending Invites</TabsTrigger>
          </TabsList>
          <TabsContent value="members">
            <MembersTable
              members={members}
              viewerPermissions={viewerPermissions}
            />
          </TabsContent>
          <TabsContent value="invites">
            <InvitesTable
              invites={invites}
              viewerPermissions={viewerPermissions}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function MembersTable({
  members,
  viewerPermissions,
}: {
  members: NonNullable<FunctionReturnType<typeof api.users.teams.members.list>>;
  viewerPermissions: NonNullable<ReturnType<typeof useViewerPermissions>>;
}) {
  const deleteMember = useMutation(api.users.teams.members.deleteMember);
  const hasManagePermission = viewerPermissions.has("Manage Members");
  return (
    <Table>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member._id}>
            <TableCell>
              <div className="flex flex-col">
                <div className="font-medium">{member.fullName}</div>
                <div className="text-muted-foreground">{member.email}</div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex justify-end">
                <SelectRole
                  disabled={!hasManagePermission}
                  value={member.roleId}
                />
              </div>
            </TableCell>
            <TableCell width={10}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    disabled={!hasManagePermission}
                    variant="ghost"
                    size="icon"
                  >
                    <DotsHorizontalIcon className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                  <DropdownMenuItem
                    onSelect={() => {
                      deleteMember({ memberId: member._id }).catch((error) => {
                        toast({
                          title:
                            error instanceof ConvexError
                              ? error.data
                              : "Could not delete member.",
                          variant: "destructive",
                        });
                      });
                    }}
                  >
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function InvitesTable({
  invites,
  viewerPermissions,
}: {
  invites: NonNullable<
    FunctionReturnType<typeof api.users.teams.members.invites.list>
  >;
  viewerPermissions: NonNullable<ReturnType<typeof useViewerPermissions>>;
}) {
  const deleteInvite = useMutation(
    api.users.teams.members.invites.deleteInvite
  );
  const hasManagePermission = viewerPermissions.has("Manage Members");
  if (invites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="text-muted-foreground text-sm">
          There are no pending invites
        </div>
      </div>
    );
  }
  return (
    <Table>
      <TableBody>
        {invites.map((invite) => (
          <TableRow key={invite._id}>
            <TableCell>
              <div className="font-medium">{invite.email}</div>
            </TableCell>
            <TableCell>
              <div className="flex justify-end">{invite.role}</div>
            </TableCell>
            <TableCell width={10}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    disabled={!hasManagePermission}
                    variant="ghost"
                    size="icon"
                  >
                    <DotsHorizontalIcon className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                  <DropdownMenuItem
                    onSelect={() => {
                      void deleteInvite({ inviteId: invite._id });
                    }}
                  >
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
