import { useContext } from 'react';
import type { AssistantContextType } from '../context/AssistantContext';
import { AssistantContext } from '../context/AssistantContext';

export function useAssistant(): AssistantContextType {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error('useAssistant must be used within an AssistantProvider');
  }
  return context;
}
