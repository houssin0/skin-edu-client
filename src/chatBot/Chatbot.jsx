import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css'; // Create a corresponding CSS file for styling
import chatBotIcon from './chat-bot.gif'; // Ensure this import path is correct

const API_KEY = "sk-proj-vv0ZG768rf3LkogiTDIAT3BlbkFJIXooUP5gEilF3h4O6vud";
const systemMessage = {
  role: "system",
  content: "Parler comme un spécialiste dans le domaine de la dermatologie, et donner des solutions et des conseils pour les problèmes de peau."
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatboxRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatIconRef = useRef(null);
  const inputRef = useRef(null); // Add useRef for the input field
  const [welcomeMessage] = useState({
    role: "system",
    content: "Hello, I am SkinEdu Assistance! Ask me anything",
  });

  const handleClickOutside = (event) => {
    if (chatboxRef.current && !chatboxRef.current.contains(event.target) && event.target !== chatIconRef.current) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus(); // Focus on the input field when the chatbox opens
    }
  }, [isOpen]);

  const toggleChatbox = () => {
    setIsOpen(prevState => !prevState); // Toggle isOpen state
  };

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { role: "user", content: input.trim() };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput('');
      setIsTyping(true);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [systemMessage, ...newMessages]
        })
      });
      const data = await response.json();
      const botMessage = data.choices[0].message;
      setTimeout(() => {
        setIsTyping(false);
        setMessages([...newMessages, botMessage]);
      }, 500); // simulate typing delay
    }
  };

  return (
    <div className="chatbot-container">
      <img
        className="chat-icon"
        src={chatBotIcon}
        alt="Chatbot Icon"
        onClick={toggleChatbox}
        ref={chatIconRef}
      />
      {isOpen && (
        <div className="chatbox" ref={chatboxRef}>
          <div className="chatbox-header">
            <h4>Chatbot</h4>
          </div>
          <div className="chatbox-body">
            <> {/* Optional rendering for welcome message */}
              {welcomeMessage && (
                <div key="welcome" className="message-container assistant">
                  <div className="message-content">{welcomeMessage.content}</div>
                </div>
              )}
              {messages.map((msg, index) => (
                <div key={index} className={`message-container ${msg.role}`}>
                  <div className="message-content">{msg.content}</div>
                </div>
              ))}
            </>
            {isTyping && (
              <div className="message-container assistant">
                <div className="typing-indicator">
                  <div className="ellipsis"></div>
                  <div className="ellipsis"></div>
                  <div className="ellipsis"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbox-footer">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => (e.key === 'Enter' ? handleSend() : null)}
              placeholder="Type your message..."
              ref={inputRef} // Reference the input field
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
