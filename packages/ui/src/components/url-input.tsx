"use client";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { ArrowRight, LoaderCircleIcon } from "lucide-react";
import { useRef, useState } from "react";

type Mutation<T> = {
  mutate: (url: string) => void;
  isPending: boolean;
  error?: Error | null;
  data?: T;
};

type Props<T> = {
  mutation: Mutation<T>;
};

export const UrlInput = <T,>({ mutation }: Props<T>) => {
  const [url, setUrl] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleLoad = () => {
    if (!url.trim() || mutation.isPending) return;
    mutation.mutate(url);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !mutation.isPending) {
      handleLoad();
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest("button")
    ) {
      return;
    }
    inputRef.current?.focus();
  };

  return (
    <Card onClick={handleCardClick}>
      <CardContent className="flex items-center gap-2">
        <Input
          ref={inputRef}
          type="url"
          placeholder="Enter URL (e.g. https://example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={mutation.isPending}
          className="flex-1 bg-transparent border-none focus:ring-0 text-lg px-2 shadow-none focus-visible:ring-0"
        />
        <Button
          size="icon"
          onClick={handleLoad}
          disabled={mutation.isPending || !url.trim()}
        >
          {mutation.isPending ? <LoaderCircleIcon className="animate-spin" /> : <ArrowRight />}
        </Button>
      </CardContent>
    </Card>
  );
}
