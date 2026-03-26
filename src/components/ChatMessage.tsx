import type { Message } from '../hooks/useVulnAIChat';
import '../styles/ChatMessage.css';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatContent = (content: string) => {
    // Replace markdown-style formatting with basic HTML
    return content
      .split('\n')
      .map((line, idx) => {
        let className = '';
        let processedLine = line;

        // Bold formatting
        processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Code formatting
        processedLine = processedLine.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Bullet points
        if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
          className = 'bullet-point';
        }

        // Headers
        if (line.startsWith('#')) {
          className = 'header';
          processedLine = processedLine.replace(/^#+\s/, '');
        }

        return (
          <div
            key={idx}
            className={className}
            dangerouslySetInnerHTML={{ __html: processedLine }}
          />
        );
      });
  };

  return (
    <div className={`chat-message ${message.role}`}>
      <div className="message-content">
        {message.role === 'assistant' && (
          <div className="message-avatar">🤖</div>
        )}
        <div className="message-text">
          {typeof formatContent(message.content) === 'string' ? (
            <p>{message.content}</p>
          ) : (
            formatContent(message.content)
          )}
        </div>
        {message.role === 'user' && <div className="message-avatar">👤</div>}
      </div>
      <div className="message-time">{formatTimestamp(message.timestamp)}</div>
    </div>
  );
}
