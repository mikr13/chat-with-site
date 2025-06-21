"use client";

import { Button } from "@workspace/ui/components/button";

type Props = {
  questions: string[];
  onQuestionClick: (question: string) => void;
}

export const SuggestedQuestions = ({ questions, onQuestionClick }: Props) => {
  if (questions.length === 0) return null;

  return (
    <div className="flex flex-row flex-wrap gap-2">
      {questions.map((question, index) => (
        <Button
          key={index}
          variant="outline"
          className="w-fit justify-start text-left h-auto px-2 py-1 text-sm whitespace-normal"
          onClick={() => onQuestionClick(question)}
        >
          <span className="whitespace-normal">{question}</span>
        </Button>
      ))}
    </div>
  );
}
