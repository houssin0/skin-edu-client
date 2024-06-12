my code is working perfectly, i want to add a close iconto close the message of "Bonjour 👋, Je suis Chatbot comment puis-je vous aider ?", can you add it to my code,  don't touch the chatbot, only the message above the icon: import React, { useState, useRef, useEffect } from 'react';
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
  const [welcomeChatMessage] = useState({
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
      <div className="welcome-message">
        Bonjour 👋, Je suis Chatbot comment puis-je vous aider ?
      </div>
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
              {welcomeChatMessage && (
                <div key="welcome" className="message-container assistant">
                  <div className="message-content">{welcomeChatMessage.content}</div>
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
and this is the styling: .chatbot-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.welcome-message {
  position: absolute;
  bottom: calc(100% + 10px); /* Positioning it above the icon */
  left: -200%; /* Centering horizontally */
  width: 20vw;
  transform: translateX(-50%); /* Centering horizontally */
  background-color: #00b894;
  color: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  font-size: 14px;
  text-align: center;
}

/* Media Query for Mobile Devices */
@media (max-width: 768px) {
  .welcome-message {
    left: -200%;
    width: 70vw;
  }
}

.chat-icon {
  cursor: pointer;
  width: 50px; /* Adjust size as necessary */
  height: 50px; /* Adjust size as necessary */
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.chatbox {
  position: absolute;
  bottom: 60px;
  right: 0;
  width: 350px; /* Updated width */
  height: 400px; /* Updated height */
  background: #f8f9fa;
  border-radius: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3); /* Added shadow */
  display: flex;
  flex-direction: column;
  font-family: 'Arial', sans-serif;
}

/* Rest of the CSS remains the same */


.chatbox-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background: #00b894;
  color: white;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Added shadow */
}

.chatbox-body {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #00b894 #f8f9fa;
}

.chatbox-body::-webkit-scrollbar {
  width: 8px;
}

.chatbox-body::-webkit-scrollbar-track {
  background: #f8f9fa;
}

.chatbox-body::-webkit-scrollbar-thumb {
  background-color: #00b894;
  border-radius: 10px;
  border: 2px solid #f8f9fa;
}

.message-container {
  display: flex;
  margin: 10px 0;
  font-size: 14px; /* Adjusted font size */
  animation: fadeIn 0.5s ease-in-out; /* Added animation */
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.message-container.user {
  justify-content: flex-end; /* Adjusted alignment */
}

.message-container.assistant {
  justify-content: flex-start; /* Adjusted alignment */
}

.message-content {
  padding: 10px;
  border-radius: 10px;
  max-width: 80%;
  word-wrap: break-word;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Added shadow */
}

.message-container.user .message-content {
  background: #0984e3;
  color: white;
  border-bottom-right-radius: 0;
}

.message-container.assistant .message-content {
  background: #dfe6e9;
  color: black;
  border-bottom-left-radius: 0;
}

.chatbox-footer {
  display: flex;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 0 0 20px 20px;
  box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.1); /* Added shadow */
}

.chatbox-footer input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  margin-right: 10px;
  font-size: 14px; /* Adjusted font size */
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1); /* Added shadow */
}

.chatbox-footer button {
  padding: 10px 20px;
  background: #00b894;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px; /* Adjusted font size */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Added shadow */
}

/* Typing Indicator */
.typing-indicator {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 10px;
}

.typing-indicator .ellipsis {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin: 0 2px;
  background-color: #9baeb6;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

.typing-indicator .ellipsis:nth-child(2) {
  animation-delay: 0.3s;
}

.typing-indicator .ellipsis:nth-child(3) {
  animation-delay: 0.6s;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
