import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function PopoverDemo({ children, buttonText = "Open Dialog" }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{buttonText}</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[80vh]">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
