import { handleFailure } from "@/app/handleFailure";
import { useCurrentTeam, useViewerPermissions } from "@/app/t/[teamSlug]/hooks";
import { SelectRole } from "@/app/t/[teamSlug]/settings/members/SelectRole";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Permission } from "@/convex/permissions";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "@radix-ui/react-icons";
import { zid } from "convex-helpers/server/zod";
import { useAction, useQuery } from "convex/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function AddMember() {
  const permissions = useViewerPermissions();
  const availableRoles = useQuery(api.users.teams.roles.list);
  const defaultRole = availableRoles?.filter((role) => role.isDefault)[0]._id;
  if (permissions == null || availableRoles == null || defaultRole == null) {
    return null;
  }
  return <AddMemberForm defaultRole={defaultRole} permissions={permissions} />;
}

function AddMemberForm({
  defaultRole,
  permissions,
}: {
  defaultRole: Id<"roles">;
  permissions: Set<Permission>;
}) {
  const team = useCurrentTeam();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: defaultRole,
    },
  });
  const sendInvite = useAction(api.users.teams.members.invites.send);
  if (team == null) {
    return null;
  }
  const hasManagePermission = permissions.has("Manage Members");
  return (
    <Card disabled={!hasManagePermission}>
      <CardHeader>
        <CardTitle>Add member</CardTitle>
        <CardDescription>Add a member to your team.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            autoComplete="off"
            onSubmit={handleFailure(
              form.handleSubmit(async ({ email, role }) => {
                await sendInvite({ email, roleId: role, teamId: team._id });
                form.reset();
                toast({ title: "Member invite created." });
              })
            )}
            className="flex flex-col sm:flex-row gap-6 sm:items-end hide-lastpass-icon"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={!hasManagePermission}
                      placeholder="jane@doe.com"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <SelectRole
                      disabled={!hasManagePermission}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!hasManagePermission} type="submit">
              <PlusIcon className="mr-2 h-4 w-4" /> Add
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

const formSchema = z.object({
  email: z.string().email(),
  role: zid("roles"),
});
