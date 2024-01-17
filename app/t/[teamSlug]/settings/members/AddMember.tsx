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
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "@radix-ui/react-icons";
import { zid } from "convex-helpers/server/zod";
import { useAction, useQuery } from "convex/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function AddMember() {
  const team = useCurrentTeam();
  const permissions = useViewerPermissions();
  const availableRoles = useQuery(api.users.teams.roles.list);
  const sendInvite = useAction(api.users.teams.members.invites.send);
  const defaultRole = availableRoles?.filter((role) => role.isDefault)[0].id;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: defaultRole,
    },
  });
  useEffect(() => {
    form.reset({ email: "", role: defaultRole });
  }, [form, defaultRole]);
  if (team == null || permissions == null || availableRoles == null) {
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
            onSubmit={
              form.handleSubmit(async ({ email, role }) => {
                await sendInvite({ email, roleId: role, teamId: team._id });
                form.reset();
                toast({ title: "Member invite created." });
              }) as any
            }
            className="flex flex-col sm:flex-row gap-6 sm:items-end"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
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
                    <SelectRole value={field.value} onChange={field.onChange} />
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
