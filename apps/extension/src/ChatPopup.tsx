import { useChat, type Message } from '@ai-sdk/react';
import { ChatInput } from '@workspace/ui/components/chat-input';
import { ChatLoadingSkeleton, ChatWindow, ChatWindowMessages } from '@workspace/ui/components/chat-window';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { SuggestedQuestions } from '@workspace/ui/components/suggested-questions';
import { SendIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import type {
  ContentRequest,
  ContentResponse,
  SuggestionsResponse
} from './types';

const ChatPopup: React.FC = () => {
  const [pageContent, setPageContent] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [pageContentError, setPageContentError] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: `http://localhost:3000/api/chat`,
    body: {
      pageContent,
    },
    onFinish: async () => {
      await fetchSuggestedQuestions(pageContent);
    }
  });

  useEffect(() => {
    initializeExtension();
  }, []);

  useEffect(() => {
    if (pageContent) {
      fetchSuggestedQuestions(pageContent);
    }
  }, [pageContent]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  const initializeExtension = async () => {
    await extractPageContent();
  };

  const extractPageContent = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) {
        throw new Error('No active tab found');
      }

      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'extract_content'
      } as ContentRequest) as ContentResponse;

      if (response.error) {
        throw new Error(response.error);
      }

      const content = response.content || '';
      setPageContent(content);
    } catch (error) {
      console.error('Failed to extract page content:', error);
      setPageContentError(true);
    }
  };

  const fetchSuggestedQuestions = async (content: string) => {
    setIsLoadingQuestions(true);
    try {
      const response = await fetch('http://localhost:3000/api/suggest-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageContent: content }),
      });

      if (response.ok) {
        const data: SuggestionsResponse = await response.json();
        setSuggestions(data.questions || []);
      }
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleQuestionClick = (question: string) => {
    const syntheticEvent = {
      target: { value: question },
    } as React.ChangeEvent<HTMLInputElement>;

    handleInputChange(syntheticEvent);

    setTimeout(() => {
      const syntheticSubmitEvent = {
        preventDefault: () => { },
      } as React.FormEvent<HTMLFormElement>;

      handleSubmit(syntheticSubmitEvent);
    }, 50);
  };

  return (
    <div className="flex flex-col h-full p-4 bg-background flex-1 gap-4">
      {pageContentError ?
        <>
          <h2 className="text-xl font-bold">Error loading page content</h2>
          <p className="text-muted-foreground">
            Please try reloading the page.
          </p>
        </> : (
          <>
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Chat with Webpage</h1>
              <p className="text-muted-foreground">
                Ask questions, get summaries, and more!
              </p>
            </div>

            <ChatWindow>
              <ScrollArea ref={scrollAreaRef} className='h-[200px]'>
                <div className="flex-1 h-auto overflow-y-auto flex flex-col gap-2">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8 text-sm">
                      Start a conversation by asking a question about the webpage content.
                    </div>
                  ) : (
                    <ChatWindowMessages messages={messages as Message[]} maxWidth='w-[95%]' />
                  )}
                  {status === "submitted" && <ChatLoadingSkeleton />}
                </div>
              </ScrollArea>
            </ChatWindow>

            <ChatInput
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              isDisabled={status === "submitted"}
              placeholder='Type your message or select below...'
            >
              <SendIcon />
            </ChatInput>

            {!isLoadingQuestions && suggestions.length > 0 ? (
              <SuggestedQuestions
                questions={suggestions}
                onQuestionClick={handleQuestionClick}
              />
            ) : (
              <div className="text-center text-muted-foreground py-4 h-64">
                <span>{isLoadingQuestions ? 'Loading suggested questions...' : 'No suggestions available.'}</span>
              </div>
            )}
          </>
        )}
    </div>
  );
};

export default ChatPopup;
