"use client";

import { Card, CardContent } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";
import type { PropsWithChildren } from "react";

type ChatWindowProps = PropsWithChildren & {
  className?: string;
}

const ChatWindow = ({ children, className }: ChatWindowProps) => {
  return (
    <Card className={cn("flex-1", className)}>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}

type ChatWindowMessagesProps<T> = {
  messages: T;
  maxWidth?: string;
}

const ChatWindowMessages = <T extends { id: string; role: "data" | "system" | "user" | "assistant"; content: string }[]>({ messages, maxWidth = "max-w-[70%]" }: ChatWindowMessagesProps<T>) => {

  if (messages.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Start a conversation by asking a question about the webpage content.
      </div>
    );
  }

  return (
    <>
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex",
            message.role === "user" ? "justify-end" : "justify-start"
          )}
        >
          <div
            className={cn(
              maxWidth,
              "rounded-lg px-4 py-2",
              message.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            )}
          >
            <div className="whitespace-pre-wrap break-words prose dark:prose-invert">
              {message.content}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

const ChatLoadingSkeleton = () => {
  return (
    <div className="flex justify-start w-[70%]">
      <div className="w-full rounded-lg px-4 py-2 bg-accent flex items-center space-x-2 animate-pulse">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex flex-col items-center gap-2 w-full">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  );
}

export { ChatLoadingSkeleton, ChatWindow, ChatWindowMessages };
