// components/form/FabricPromptDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface FabricPromptDialogProps {
  open: boolean;
  onClose: () => void;
}

export function FabricPromptDialog({ open, onClose }: FabricPromptDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Additional Fabric Requirements</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Please provide the following information for the additional fabric:
          </p>
          <ul className="list-disc list-inside text-sm space-y-2">
            <li>Fabric Name (from available options)</li>
            <li>Per Piece Requirement</li>
            <li>Choose Unit (metre/kg)</li>
            <li>Processes (select applicable)</li>
            <li>Colors with Quantities</li>
            <li>Total Quantity</li>
            <li>Stages to be Skipped (optional)</li>
          </ul>
          <Button onClick={onClose} className="w-full">
            I Understand
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}