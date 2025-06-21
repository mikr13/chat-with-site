"use client";

import { ExternalLink } from "lucide-react";

type Props = {
  url: string;
}

export const PageInfo = ({ url }: Props) => {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="font-medium">Loaded webpage: </span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline truncate flex items-center gap-1"
      >
        {url}
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  );
}
