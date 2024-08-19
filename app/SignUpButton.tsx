"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { useAuthActions } from "convex-gold-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignUpButton() {
  const { signIn } = useAuthActions();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Sign up</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              setSubmitting(true);
              signIn("password", formData)
                .then(() => {
                  router.push("/t");
                })
                .catch(() => {
                  toast({
                    title:
                      "Could not sign up, did you mean to sign in instead?",
                    variant: "destructive",
                  });
                  setSubmitting(false);
                });
            }}
          >
            <DialogHeader>
              <DialogTitle>Sign Up</DialogTitle>
              <DialogDescription>Create a new account.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">
                  First name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Joe"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">
                  Last name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="joe@example.com"
                  className="col-span-3"
                />
              </div>
              {/* <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="joe"
                  className="col-span-3"
                />
              </div> */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  className="col-span-3"
                />
              </div>
              <input name="flow" type="hidden" value="signUp" />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={submitting}>
                Sign up
              </Button>
            </DialogFooter>
            <Toaster />
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
