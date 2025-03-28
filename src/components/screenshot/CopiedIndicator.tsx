
import React from 'react';
import { CheckIcon } from "lucide-react";

interface CopiedIndicatorProps {
  isVisible: boolean;
}

const CopiedIndicator: React.FC<CopiedIndicatorProps> = ({ isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className="absolute top-3 right-3">
      <CheckIcon size={18} className="text-green-500" />
    </div>
  );
};

export default CopiedIndicator;
