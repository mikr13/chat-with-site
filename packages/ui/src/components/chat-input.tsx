"use client";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import type { PropsWithChildren } from "react";

type Props = PropsWithChildren & {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isDisabled?: boolean;
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isDisabled,
  children,
}: Props) {
  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        value={input}
        placeholder="Ask a question about the webpage..."
        onChange={handleInputChange}
        disabled={isDisabled}
        className="flex-1 bg-transparent border-none focus:ring-0 text-lg px-2 shadow-none focus-visible:ring-0"
      />
      <Button type="submit" disabled={isDisabled || !input.trim()} size="icon">
        {children}
      </Button>
    </form>
  );
}
