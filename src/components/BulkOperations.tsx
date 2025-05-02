import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Check, X, Trash2, Download, Archive, Clock, Send } from "lucide-react";
import { toast } from "sonner";

type BulkAction = {
  id: string;
  label: string;
  icon: React.ReactNode;
  destructive?: boolean;
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
  onAction: (selectedIds: string[]) => void | Promise<void>;
};

interface BulkOperationsProps {
  selectedIds: string[];
  itemName: string;
  actions: BulkAction[];
  onClearSelection: () => void;
  className?: string;
}

export default function BulkOperations({
  selectedIds,
  itemName,
  actions,
  onClearSelection,
  className,
}: BulkOperationsProps) {
  const [confirmAction, setConfirmAction] = useState<BulkAction | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleActionClick = async (action: BulkAction) => {
    if (action.requiresConfirmation) {
      setConfirmAction(action);
      return;
    }

    await executeAction(action);
  };

  const executeAction = async (action: BulkAction) => {
    try {
      setIsProcessing(true);
      await action.onAction(selectedIds);
      setIsProcessing(false);
      setConfirmAction(null);
    } catch (error) {
      console.error("Error executing bulk action:", error);
      toast.error(`Failed to ${action.label.toLowerCase()} ${itemName}s`);
      setIsProcessing(false);
    }
  };

  if (selectedIds.length === 0) {
    return null;
  }

  return (
    <>
      <div className={`bg-primary-50 p-3 rounded-md flex flex-wrap items-center gap-2 ${className}`}>
        <Badge variant="outline" className="bg-primary-100 text-primary-700 border-primary-200">
          {selectedIds.length} {itemName}{selectedIds.length > 1 ? 's' : ''} selected
        </Badge>
        
        <div className="flex-1"></div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Bulk Actions"}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {actions.map((action) => (
              <DropdownMenuItem
                key={action.id}
                onClick={() => handleActionClick(action)}
                className={action.destructive ? "text-red-600 focus:text-red-600" : ""}
              >
                {action.icon}
                {action.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onClearSelection}
          className="text-muted-foreground"
        >
          <X className="mr-2 h-4 w-4" />
          Clear Selection
        </Button>
      </div>

      <AlertDialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction?.label} {selectedIds.length} {itemName}{selectedIds.length > 1 ? 's' : ''}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.confirmationMessage || 
                `This action will ${confirmAction?.label.toLowerCase()} ${selectedIds.length} ${itemName}${selectedIds.length > 1 ? 's' : ''}. This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmAction && executeAction(confirmAction)}
              disabled={isProcessing}
              className={confirmAction?.destructive ? "bg-red-600 hover:bg-red-700" : ""}
            >
              {isProcessing ? "Processing..." : confirmAction?.label}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Predefined bulk actions that can be imported and used
export const commonBulkActions = {
  delete: (onDelete: (ids: string[]) => void | Promise<void>): BulkAction => ({
    id: "delete",
    label: "Delete",
    icon: <Trash2 className="mr-2 h-4 w-4" />,
    destructive: true,
    requiresConfirmation: true,
    confirmationMessage: "This will permanently delete the selected items. This action cannot be undone.",
    onAction: onDelete,
  }),
  
  export: (onExport: (ids: string[]) => void | Promise<void>): BulkAction => ({
    id: "export",
    label: "Export",
    icon: <Download className="mr-2 h-4 w-4" />,
    onAction: onExport,
  }),
  
  archive: (onArchive: (ids: string[]) => void | Promise<void>): BulkAction => ({
    id: "archive",
    label: "Archive",
    icon: <Archive className="mr-2 h-4 w-4" />,
    requiresConfirmation: true,
    onAction: onArchive,
  }),
  
  markAsPending: (onMark: (ids: string[]) => void | Promise<void>): BulkAction => ({
    id: "markAsPending",
    label: "Mark as Pending",
    icon: <Clock className="mr-2 h-4 w-4" />,
    onAction: onMark,
  }),
  
  markAsComplete: (onMark: (ids: string[]) => void | Promise<void>): BulkAction => ({
    id: "markAsComplete",
    label: "Mark as Complete",
    icon: <Check className="mr-2 h-4 w-4" />,
    onAction: onMark,
  }),
  
  send: (onSend: (ids: string[]) => void | Promise<void>): BulkAction => ({
    id: "send",
    label: "Send",
    icon: <Send className="mr-2 h-4 w-4" />,
    requiresConfirmation: true,
    onAction: onSend,
  }),
};
