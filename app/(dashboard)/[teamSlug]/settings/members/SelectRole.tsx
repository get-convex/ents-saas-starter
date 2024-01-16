import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

export function SelectRole({
  disabled,
  onChange,
  value,
}: {
  disabled?: boolean;
  onChange?: (value: Id<"roles">) => void;
  value?: Id<"roles">;
}) {
  const availableRoles = useQuery(api.users.teams.roles.list);
  if (availableRoles == null) {
    return null;
  }
  return (
    <Select
      disabled={disabled}
      onValueChange={onChange}
      value={value ?? availableRoles.filter((role) => role.isDefault)[0].id}
    >
      <SelectTrigger className="w-[8rem]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {availableRoles.map((role) => (
          <SelectItem key={role.id} value={role.id}>
            {role.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
