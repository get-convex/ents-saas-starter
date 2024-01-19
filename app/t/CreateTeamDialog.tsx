"use client";

import { handleFailure } from "@/app/handleFailure";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Hook instead of a component because we need to wrap
// the dialog around the popover, see Notes in
// https://ui.shadcn.com/docs/components/dialog.
export function useCreateTeamDialog() {
  const createTeam = useMutation(api.users.teams.create);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  const [showNewTeamDialog, setShowNewTeamDialog] = useState(false);
  const handleShowNewTeamDialog = (state: boolean) => {
    form.reset();
    setShowNewTeamDialog(state);
  };

  const router = useRouter();

  const content = (
    <DialogContent>
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleFailure(
            form.handleSubmit(async ({ name }) => {
              const teamSlug = await createTeam({ name });
              handleShowNewTeamDialog(false);
              router.push(`/t/${teamSlug}`);
            })
          )}
        >
          <DialogHeader>
            <DialogTitle>Create team</DialogTitle>
            <DialogDescription>
              Add a new team to manage products and customers.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Acme Inc."
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2">
              <Label htmlFor="plan">Subscription plan</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">
                    <span className="font-medium">Free</span> -{" "}
                    <span className="text-muted-foreground">
                      Trial for two weeks
                    </span>
                  </SelectItem>
                  <SelectItem value="pro">
                    <span className="font-medium">Pro</span> -{" "}
                    <span className="text-muted-foreground">
                      $9/month per user
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => handleShowNewTeamDialog(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Continue</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
  return [showNewTeamDialog, handleShowNewTeamDialog, content] as const;
}

const FormSchema = z.object({
  name: z.string().min(4, "Team name must be at least 4 characters long."),
  // TODO if you want plans:
  // plan: z.enum(["free", "pro"]),
});
