"use client";

import { SettingsMenu } from "@/app/t/[teamSlug]/settings/SettingsMenu";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Cross2Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export function SettingsMenuButton() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="sm:hidden"
          variant="ghost"
          size="icon"
          onClick={() => setShowMenu(!showMenu)}
        >
          {showMenu ? (
            <Cross2Icon className="h-6 w-6" />
          ) : (
            <HamburgerMenuIcon className="h-6 w-6" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start">
        <SettingsMenu />
      </PopoverContent>
    </Popover>
  );
}
