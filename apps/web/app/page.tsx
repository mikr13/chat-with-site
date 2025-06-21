"use client";

import { fetchPageContent } from "@/lib/page-content";
import { useChat, type Message } from "@ai-sdk/react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardTitle } from "@workspace/ui/components/card";
import { ChatInput } from "@workspace/ui/components/chat-input";
import { ChatLoadingSkeleton, ChatWindow, ChatWindowMessages } from "@workspace/ui/components/chat-window";
import { PageInfo } from "@workspace/ui/components/page-info";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { SuggestedQuestions } from "@workspace/ui/components/suggested-questions";
import { UrlInput } from "@workspace/ui/components/url-input";
import { SendIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Page() {
  const [pageContent, setPageContent] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    body: {
      pageContent,
    },
  });

  useEffect(() => {
    if (pageContent) {
      fetchSuggestedQuestions(pageContent);
    }
  }, [pageContent]);

  const fetchSuggestedQuestions = async (content: string) => {
    setIsLoadingQuestions(true);
    try {
      const response = await fetch("/api/suggest-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageContent: content }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestedQuestions(data.questions || []);
      }
    } catch (error) {
      console.error("Error fetching suggested questions:", error);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleQuestionClick = (question: string) => {
    // Create a synthetic event for input change
    const syntheticEvent = {
      target: { value: question },
    } as React.ChangeEvent<HTMLInputElement>;

    handleInputChange(syntheticEvent);

    // Submit after a brief delay to ensure state update
    setTimeout(() => {
      const syntheticSubmitEvent = {
        preventDefault: () => { },
      } as React.FormEvent<HTMLFormElement>;

      handleSubmit(syntheticSubmitEvent);
    }, 50);
  };

  const handleContentFetched = (fetchedUrl: string, content: string) => {
    setUrl(fetchedUrl);
    setPageContent(content);
    setSuggestedQuestions([]);
  };

  const mutation = useMutation({
    mutationFn: fetchPageContent,
    onSuccess: ([url, content]) => {
      handleContentFetched(url ?? "", content ?? "");
    },
    onError: (error) => {
      console.error("Error fetching page content:", error);
      alert("Failed to fetch page content. Please check the URL and try again.");
    },
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl flex-1 flex flex-col gap-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Chat with Webpage</h1>
        <p className="text-muted-foreground">
          Load any webpage and have an AI conversation about its content
        </p>
      </div>

      <UrlInput mutation={mutation} />

      {pageContent && (
        <Card className="flex-1 flex flex-col min-h-0">
          <CardTitle className="px-6">
            {url && <PageInfo url={url} />}
          </CardTitle>
          <CardContent className="relative flex flex-col gap-4">
            <ChatWindow>
              <ScrollArea className="h-[400px] p-4">
                <div
                  className="flex-1 h-auto overflow-y-auto flex flex-col gap-2"
                >
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8 text-sm">
                      Start a conversation by asking a question about the webpage content.
                    </div>
                  ) : (
                    <ChatWindowMessages messages={messages as Message[]} />
                  )}
                  {status === "submitted" && <ChatLoadingSkeleton />}
                </div>
              </ScrollArea>
              <ChatInput
                input={input}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                isDisabled={status === "submitted"}
              >
                <SendIcon />
              </ChatInput>
            </ChatWindow>

            {pageContent && !isLoadingQuestions && suggestedQuestions.length > 0 && (
              <SuggestedQuestions
                questions={suggestedQuestions}
                onQuestionClick={handleQuestionClick}
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
