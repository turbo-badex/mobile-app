
import React from 'react';
import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  minHeight?: string;
  optional?: boolean;
  className?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  minHeight = "100px",
  optional = false,
  className = ""
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-xl font-medium text-gray-500 px-4">
        {label}{optional && <span className="text-gray-400 ml-1">(optional)</span>}
      </label>
      <Textarea 
        placeholder={placeholder} 
        className={`min-h-[${minHeight}] bg-white rounded-[32px] text-black text-lg p-6 border-none shadow-sm`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default MessageInput;
