import { useEffect, useRef, useState } from 'react';
import { useVulnAIChat } from '../hooks/useVulnAIChat';
import { ChatMessage } from './ChatMessage';
import '../styles/Chat.css';

export function Chat() {
  const {
    messages,
    sessionId,
    loading,
    error,
    sendMessage,
    clearChat,
    getHelp,
    loadSession,
  } = useVulnAIChat();

  const [input, setInput] = useState('');
  const [context, setContext] = useState('');
  const [showContext, setShowContext] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      await sendMessage(input, context);
      setInput('');
      setContext('');
    }
  };

  const handleGetHelp = async () => {
    await getHelp();
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div className="header-content">
          <h1>🛡️ VulnAI Security Assistant</h1>
          <p>Ask security questions, analyze CVEs, and learn about vulnerabilities</p>
        </div>
        <div className="header-actions">
          {sessionId && <span className="session-badge">Session Active</span>}
        </div>
      </header>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="welcome-message">
            <h2>Welcome to VulnAI</h2>
            <p>
              I'm here to help you with security questions. Ask me about:
            </p>
            <ul>
              <li>Email and phishing threats</li>
              <li>Link and attachment safety</li>
              <li>Website legitimacy and CVEs</li>
              <li>Account security and password breaches</li>
              <li>Social engineering attempts</li>
            </ul>
            <button onClick={handleGetHelp} className="btn-help">
              📚 Get Started - Show Help
            </button>
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {loading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>VulnAI is thinking...</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="chat-input-form">
        <div className="input-wrapper">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !loading) {
                handleSendMessage(e as React.FormEvent);
              }
            }}
            placeholder="Ask a security question... (or type 'help' for guidance)"
            disabled={loading}
            className="message-input"
          />

          {showContext && (
            <div className="context-input-wrapper">
              <input
                type="text"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Additional context (optional)"
                disabled={loading}
                className="context-input"
              />
            </div>
          )}

          <div className="input-actions">
            <button
              type="button"
              onClick={() => setShowContext(!showContext)}
              className="btn-icon"
              title="Add context"
              disabled={loading}
            >
              ℹ️
            </button>
            <button type="submit" disabled={loading} className="btn-send">
              {loading ? '⏳' : '📤'}
            </button>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={clearChat}
                className="btn-icon"
                title="Clear chat"
                disabled={loading}
              >
                🗑️
              </button>
            )}
          </div>
        </div>
      </form>

      {sessionId && (
        <footer className="chat-footer">
          <small>Session: {sessionId.substring(0, 20)}...</small>
        </footer>
      )}
    </div>
  );
}
