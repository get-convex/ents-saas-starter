import {
  useCurrentTeam,
  useViewerPermissions,
} from "@/app/(dashboard)/[teamSlug]/hooks";
import { SelectRole } from "@/app/(dashboard)/[teamSlug]/settings/members/SelectRole";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export function MembersList() {
  const team = useCurrentTeam();
  const availableRoles = useQuery(api.users.teams.roles.list);
  const viewerPermissions = useViewerPermissions();
  const members = useQuery(api.users.teams.members.list, {
    teamId: team?._id,
  });
  if (
    team == null ||
    availableRoles == null ||
    viewerPermissions == null ||
    members == null ||
    !viewerPermissions.has("Read Members")
  ) {
    return null;
  }
  const hasManagePermission = viewerPermissions.has("Manage Members");
  return (
    <Card>
      <CardHeader>
        <CardTitle>Members</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
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
                      value={member.role}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
