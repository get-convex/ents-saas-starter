import { toast } from "@/components/ui/use-toast";
import { ConvexError } from "convex/values";

export function handleFailure<T extends any[]>(
  callback: (...args: T) => Promise<void>
) {
  return (...args: T) => {
    void (async () => {
      try {
        await callback(...args);
      } catch (error) {
        toast({
          title:
            error instanceof ConvexError ? error.data : "Something went wrong",
          variant: "destructive",
        });
      }
    })();
  };
}
