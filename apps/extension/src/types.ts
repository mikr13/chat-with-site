export interface ContentRequest {
  action: string;
}

export interface ContentResponse {
  content?: string;
  error?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  pageContent: string;
  messages: Array<{ role: string; content: string }>;
}

export interface SuggestedQuestion {
  id: string;
  question: string;
}

export interface SuggestionsResponse {
  questions: string[];
}
