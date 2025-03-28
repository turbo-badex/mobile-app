
import React from "react";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, CheckCircle, Mail, RefreshCw } from "lucide-react";

interface SubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  onSubscribe: () => void;
  onRestore?: () => void;
  onEmailSupport?: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  open,
  onClose,
  onSubscribe,
  onRestore,
  onEmailSupport,
}) => {
  const { isInTrial, trialDaysLeft } = useSubscription();

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md w-[95%] rounded-xl bg-[#1A1F2C] border-none text-white">
        <button 
          onClick={onClose}
          className="absolute left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <DialogHeader className="pt-6">
          <div className="mx-auto bg-gradient-to-r from-[#9b87f5] to-[#6E59A5] text-white px-4 py-1 rounded-full text-sm font-medium">
            Naija Rizz
          </div>
          
          <DialogTitle className="text-2xl mt-4 text-center font-bold">
            Send the Perfect Reply
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="space-y-2.5 w-full">
            <FeatureItem>Get unlimited daily message credits</FeatureItem>
            <FeatureItem>Generate perfect replies for any situation</FeatureItem>
            <FeatureItem>Advanced reply types (flirty, casual, etc.)</FeatureItem>
            <FeatureItem>Upload screenshots to get customized replies</FeatureItem>
          </div>
        </div>

        <div className="flex flex-col space-y-4 mt-2">
          <Button 
            onClick={onSubscribe}
            className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:from-[#7C4BF1] hover:to-[#C935DE] text-white py-6 rounded-lg font-semibold"
          >
            Unlock Free Trial
          </Button>
          
          <p className="text-center text-sm text-gray-400">
            {isInTrial 
              ? `${trialDaysLeft}-day trial in progress` 
              : "3-day risk-free trial, then $9.99/week"}
          </p>
          
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <button 
              className="hover:text-white transition-colors flex items-center gap-1"
              onClick={onEmailSupport}
            >
              <Mail className="h-4 w-4" />
              Email
            </button>
            <button 
              className="hover:text-white transition-colors flex items-center gap-1"
              onClick={onRestore}
            >
              <RefreshCw className="h-4 w-4" />
              Restore
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const FeatureItem = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center space-x-2 px-4 py-2">
    <CheckCircle className="h-5 w-5 text-[#9b87f5] flex-shrink-0" />
    <span className="text-sm">{children}</span>
  </div>
);

export default SubscriptionModal;
