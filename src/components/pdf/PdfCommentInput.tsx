import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface PdfCommentInputProps {
  onSubmit: (comment: string) => void;
  onTyping?: (typing: boolean) => void;
  disabled?: boolean;
}

export const PdfCommentInput: React.FC<PdfCommentInputProps> = ({ onSubmit, onTyping, disabled }) => {
  const [value, setValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      onTyping?.(true);
    }
  };

  const handleBlur = () => {
    setIsTyping(false);
    onTyping?.(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
      setValue('');
      setIsTyping(false);
      onTyping?.(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center mt-2">
      <Input
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Add a comment..."
        disabled={disabled}
        className="flex-1"
      />
      <Button type="submit" disabled={!value.trim() || disabled} size="sm">
        Send
      </Button>
    </form>
  );
};

export default PdfCommentInput;
