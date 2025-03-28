
import { Toast as ToastPrimitive, ToastActionElement } from "@/components/ui/toast";
import {
  useToast as useToastInternal,
} from "@/components/ui/use-toast";

export type ToastProps = Omit<React.ComponentPropsWithoutRef<typeof ToastPrimitive>, 'id'> & {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
};

export const useToast = useToastInternal;

// Create a wrapper around toast to automatically generate an ID
export const toast = ({ ...props }: ToastProps) => {
  const { toast } = useToastInternal();
  
  // The internal toast function will handle ID generation
  return toast({
    ...props,
  });
};

export type { ToastActionElement };
