import {
  useCurrentTeam,
  useViewerPermissions,
} from "@/app/(dashboard)/[teamSlug]/hooks";
import { Button } from "@/components/ui/button";
import { zid } from "convex-helpers/server/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { PlusIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery } from "convex/react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SelectRole } from "@/app/(dashboard)/[teamSlug]/settings/members/SelectRole";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

export function AddMember() {
  const team = useCurrentTeam();
  const permissions = useViewerPermissions();
  const availableRoles = useQuery(api.users.teams.roles.list);
  const createInvite = useMutation(api.users.teams.members.invites.create);
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
                await createInvite({ email, role, teamId: team._id });
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
                    <Input placeholder="jane@doe.com" {...field} />
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
