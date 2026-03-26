import { useState, useCallback } from 'react';
import axios from 'axios';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  context?: string;
  sessionId?: string;
  vulnerabilityType?: string;
}

export interface ChatResponse {
  response: string;
  sessionId: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function useVulnAIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load session from localStorage on mount
  const loadSession = useCallback(() => {
    const savedSessionId = localStorage.getItem('vulnai-session');
    if (savedSessionId) {
      setSessionId(savedSessionId);
    }
  }, []);

  // Save session to localStorage
  const saveSession = useCallback((newSessionId: string) => {
    setSessionId(newSessionId);
    localStorage.setItem('vulnai-session', newSessionId);
  }, []);

  const sendMessage = useCallback(
    async (
      message: string,
      context?: string,
      vulnerabilityType?: string
    ): Promise<boolean> => {
      if (!message.trim()) {
        setError('Message cannot be empty');
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        const payload: ChatRequest = {
          message: message.trim(),
          context: context?.trim(),
          sessionId: sessionId || undefined,
          vulnerabilityType,
        };

        const response = await axios.post<ChatResponse>(
          `${API_BASE_URL}/chat`,
          payload
        );

        const { response: assistantResponse, sessionId: newSessionId } =
          response.data;

        // Save session ID if it's new
        if (newSessionId && !sessionId) {
          saveSession(newSessionId);
        }

        // Add user message
        const userMessage: Message = {
          id: `msg-${Date.now()}`,
          role: 'user',
          content: message,
          timestamp: new Date(),
        };

        // Add assistant response
        const assistantMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: assistantResponse,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage, assistantMessage]);
        return true;
      } catch (err) {
        const errorMessage =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : 'Failed to send message. Please try again.';
        setError(errorMessage);
        console.error('Chat error:', err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [sessionId, saveSession]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setSessionId(null);
    localStorage.removeItem('vulnai-session');
    setError(null);
  }, []);

  const getHelp = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<ChatResponse>(`${API_BASE_URL}/chat/help`);
      const { response: helpText } = response.data;

      const helpMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: helpText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, helpMessage]);
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Failed to fetch help. Please try again.';
      setError(errorMessage);
      console.error('Help request error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    messages,
    sessionId,
    loading,
    error,
    sendMessage,
    clearChat,
    getHelp,
    loadSession,
  };
}
