import React from 'react';
import { useAssistant } from '../../hooks/useAssistant';
import { AssistantButton } from './AssistantButton';
import { AssistantPanel } from './AssistantPanel';

export function AIAssistant() {
  const { assistantState, lang, openAssistant } = useAssistant();

  if (assistantState === 'hidden') return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end justify-end pointer-events-auto">
      {assistantState === 'minimized' ? (
        <AssistantButton onClick={openAssistant} lang={lang} />
      ) : (
        <div className="max-w-md w-[92vw] transition-all duration-300 transform translate-y-0 opacity-100">
          <AssistantPanel />
        </div>
      )}
    </div>
  );
}
