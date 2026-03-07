import React, { useState, useRef, useEffect } from 'react';
import { postCall } from '../axios/apis';
import { apiEndPointConstants } from '../axios/endpoint';
import TypingMessage from './TypingMessage';
import { updateRequestStatus } from '../redux/slice/slice';
import { useDispatch } from 'react-redux';
import MicIcon from '@mui/icons-material/Mic';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import Listener from '../assets/listener.gif'
import { handlleAIResponse } from './handlleAIResponse';
import { defaultActions, quickReplies } from './defaultValues';

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch()
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Namaste! 🙏 Welcome to Ganapati Mandal Management System. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef(null);
  
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const synthRef = useRef(window.speechSynthesis);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    stopSpeaking();
  };

  const speak = (text) => {
    if (!voiceEnabled) return;
    
    synthRef.current.cancel();
    
    const cleanText = text
      .replace(/[🙏💰📱📜🌸🐘✨💼🏪📌📝📋👤📅🔔🎭❌✅]/g, '')
      .replace(/\*/g, '')
      .trim();
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    utterance.lang = 'hi-IN'; // Hindi voice, use 'mr-IN' for Marathi, 'en-IN' for English
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;
    utterance.volume = 1;
    
    const voices = synthRef.current.getVoices();
    const hindiVoice = voices.find(voice => voice.lang === 'hi-IN');
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }
    
    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };
    
    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    synthRef.current.cancel();
    setIsSpeaking(false);
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (isSpeaking) {
      stopSpeaking();
    }
  };

  const handleSendMessage = async (messageText = null, isVoiceInput = false) => {
    const textToSend = messageText || inputMessage;
    
    if (textToSend.trim() === '') return;
    
    setIsTyping(true);
    
    const userMessage = {
      id: messages.length + 1,
      text: textToSend,
      sender: 'user',
      timestamp: new Date(),
    };

    try {
      const agentResponse = await postCall(apiEndPointConstants.MANDAL_AI_ENDPOINT, { prompt: textToSend });
      let botResponseMessage = null;
      if(defaultActions.includes(agentResponse.data.action)) {
        botResponseMessage = handlleAIResponse(agentResponse.data.action, agentResponse.data.data, dispatch, updateRequestStatus)
      } else {
        botResponseMessage = agentResponse.data.data.message?.text ? agentResponse.data.data.message?.text : agentResponse.data.data.message
      }
      
      const botResponse = {
        id: messages.length + 2,
        text: botResponseMessage,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, userMessage, botResponse]);
      setInputMessage('');
      setTranscript('');
      setIsTyping(false);
    
      if (isVoiceInput && voiceEnabled) {
        speak(botResponseMessage);
      }
      
      return;
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setMessages((prev) => [...prev, userMessage]);
      setInputMessage('');
      setTranscript('');
      setIsTyping(false);
    }
  };

  const handleQuickReply = (reply) => {
    setInputMessage(reply);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const styles = {
    floatingButton: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      backgroundColor: '#FF6B35',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      fontSize: '24px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      display: open ? 'none' : 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      zIndex: 1000,
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: open ? 'block' : 'none',
      zIndex: 1100,
    },
    dialog: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      maxWidth: '500px',
      height: '600px',
      maxHeight: '90vh',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      display: open ? 'flex' : 'none',
      flexDirection: 'column',
      zIndex: 1200,
      overflow: 'hidden',
    },
    header: {
      backgroundColor: '#FF6B35',
      color: 'white',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: '12px 12px 0 0',
    },
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: 'white',
      color: '#FF6B35',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      fontWeight: 'bold',
    },
    headerText: {
      display: 'flex',
      flexDirection: 'column',
    },
    title: {
      fontSize: '18px',
      fontWeight: '600',
      margin: 0,
    },
    status: {
      fontSize: '12px',
      opacity: 0.9,
      margin: 0,
    },
    closeButton: {
      backgroundColor: 'transparent',
      border: 'none',
      color: 'white',
      fontSize: '24px',
      cursor: 'pointer',
      padding: '4px 8px',
      lineHeight: 1,
    },
    messagesContainer: {
      flex: 1,
      padding: '20px',
      backgroundColor: '#f5f5f5',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    messageRow: {
      display: 'flex',
      gap: '8px',
    },
    messageRowUser: {
      display: 'flex',
      gap: '8px',
      justifyContent: 'flex-end',
    },
    messageAvatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      fontWeight: 'bold',
      flexShrink: 0,
    },
    botAvatar: {
      backgroundColor: '#FF6B35',
      color: 'white',
    },
    userAvatar: {
      backgroundColor: '#1976d2',
      color: 'white',
    },
    messageBubble: {
      padding: '12px 16px',
      borderRadius: '12px',
      maxWidth: '70%',
      wordWrap: 'break-word',
    },
    botBubble: {
      backgroundColor: 'white',
      color: '#333',
      borderBottomLeftRadius: '4px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    },
    userBubble: {
      backgroundColor: '#FF6B35',
      color: 'white',
      borderBottomRightRadius: '4px',
    },
    messageText: {
      margin: 0,
      fontSize: '14px',
      lineHeight: '1.5',
      whiteSpace: 'pre-line',
    },
    timestamp: {
      fontSize: '11px',
      opacity: 0.7,
      marginTop: '4px',
      display: 'block',
    },
    typingIndicator: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
    },
    typingDots: {
      display: 'flex',
      gap: '4px',
      padding: '12px 16px',
      backgroundColor: 'white',
      borderRadius: '12px',
      borderBottomLeftRadius: '4px',
    },
    dot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#FF6B35',
      animation: 'bounce 1.4s infinite ease-in-out',
    },
    quickRepliesContainer: {
      padding: '12px 20px',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
    },
    quickReplyButton: {
      padding: '8px 16px',
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '20px',
      cursor: 'pointer',
      fontSize: '13px',
      transition: 'all 0.2s',
    },
    inputContainer: {
      padding: '16px 20px',
      backgroundColor: 'white',
      display: 'flex',
      gap: '12px',
      borderRadius: '0 0 12px 12px',
      alignItems: 'center'
    },
    input: {
      flex: 1,
      padding: '12px 16px',
      border: '1px solid #ddd',
      borderRadius: '24px',
      fontSize: '14px',
      outline: 'none',
    },
    sendButton: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      backgroundColor: '#FF6B35',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      fontSize: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
    },
    sendButtonDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
    },
  };

  const startListening = () => {
    // Stop any ongoing speech when starting to listen
    stopSpeaking();
    
    setTranscript('');
    setInterimTranscript('');
    setInputMessage('');
    setIsListening(true);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognitionRef.current.stop();
  };

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Browser does not support speech recognition. Use Chrome/Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          final += transcriptPiece + ' ';
        } else {
          interim += transcriptPiece;
        }
      }

      if (final) {
        setTranscript(prev => prev + final);
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!isListening && transcript.trim() !== '') {
      handleSendMessage(transcript, true);
    }
  }, [isListening, transcript]);


  useEffect(() => {
    const loadVoices = () => {
      const voices = synthRef.current.getVoices();
    };
    
    loadVoices();
    
    if (synthRef.current.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = loadVoices;
    }
  }, []);

  return (
    <>
      <button
        style={styles.floatingButton}
        onClick={handleClickOpen}
        className="floating-btn"
        aria-label="Open chat"
      >
        💬
      </button>

      <div style={styles.overlay} onClick={handleClose} />

      <div style={styles.dialog}>
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.avatar}>🤖</div>
            <div style={styles.headerText}>
              <h3 style={styles.title}>Ganapati Assistant</h3>
              <p style={styles.status}>
                {isSpeaking ? '🔊 Speaking...' : 'Online'}
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={toggleVoice}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center',
              }}
              title={voiceEnabled ? 'Disable voice' : 'Enable voice'}
            >
              {voiceEnabled ? (
                <VolumeUpIcon sx={{ fontSize: 24 }} />
              ) : (
                <VolumeOffIcon sx={{ fontSize: 24 }} />
              )}
            </button>
            
            <button
              style={styles.closeButton}
              onClick={handleClose}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>
        </div>

        <div style={styles.messagesContainer}>
          <div
            id="chat-container"
            style={{
              overflowY: "auto",
              maxHeight: "70vh",
              padding: "0 10px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                style={
                  message.sender === "user"
                    ? styles.messageRowUser
                    : styles.messageRow
                }
              >
                {message.sender === "bot" && (
                  <div style={{ ...styles.messageAvatar, ...styles.botAvatar }}>🤖</div>
                )}

                <div
                  style={{
                    ...styles.messageBubble,
                    ...(message.sender === "user"
                      ? styles.userBubble
                      : styles.botBubble),
                  }}
                >
                  {message.sender === "bot" ? (
                    <TypingMessage text={message.text} />
                  ) : (
                    <p style={styles.messageText}>{message.text}</p>
                  )}

                  <span style={styles.timestamp}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {message.sender === "user" && (
                  <div style={{ ...styles.messageAvatar, ...styles.userAvatar }}>👤</div>
                )}
              </div>
            ))}

            {isTyping && (
              <div style={styles.typingIndicator}>
                <div style={{ ...styles.messageAvatar, ...styles.botAvatar }}>🤖</div>
                <div style={styles.typingDots}>
                  <div style={styles.dot}></div>
                  <div style={styles.dot}></div>
                  <div style={styles.dot}></div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {isListening && (
          <div style={{ 
            padding: '10px 20px', 
            backgroundColor: '#e8f5e9', 
            borderTop: '2px solid #4CAF50',
            textAlign: 'center'
          }}>
            <p style={{ 
              color: '#2e7d32', 
              margin: 0, 
              fontSize: '14px',
              fontWeight: '500'
            }}>
              🎤 Listening... Speak now!
            </p>
          </div>
        )}

        {!isListening && quickReplies.length > 0 && (
          <div style={styles.quickRepliesContainer}>
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                style={styles.quickReplyButton}
                onClick={() => handleQuickReply(reply)}
                className="quick-reply-btn"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        <div style={styles.inputContainer}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              transition: '0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'antiquewhite')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            onClick={isListening ? stopListening : startListening}
          >
            {isListening ? (
              <img
                src={Listener}
                alt="listener"
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'contain',
                }}
              />
            ) : (
              <MicIcon sx={{ fontSize: 22, color: 'primary.main' }} />
            )}
          </div>

          <input
            type="text"
            style={styles.input}
            placeholder={isListening ? "Listening..." : "Type your message..."}
            value={isListening ? `${transcript}${interimTranscript}` : inputMessage}
            onChange={(e) => {
              if (!isListening) {
                setInputMessage(e.target.value);
              }
            }}
            onKeyPress={handleKeyPress}
            disabled={isListening}
          />
          <button
            style={{
              ...styles.sendButton,
              ...((inputMessage.trim() === "" && transcript.trim() === "") && styles.sendButtonDisabled),
            }}
            onClick={() => handleSendMessage()}
            disabled={inputMessage.trim() === "" && transcript.trim() === ""}
            className="send-btn"
            aria-label="Send message"
          >
            ➤
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;