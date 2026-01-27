'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function DeleteConfirmDialog({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent className="bg-slate-900 border border-slate-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-3">
          <AlertDialogCancel className="border-slate-600 text-white hover:bg-slate-800">
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
