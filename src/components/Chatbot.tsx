'use client';

import { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { 
  MessageCircle, Send, Mic, MicOff, Volume2, VolumeX, 
  X, Minimize2, Maximize2, Trash2, Loader2, Sparkles 
} from 'lucide-react';
import { askChatbot, clearChatHistory } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  provider?: string;
}

interface ChatbotProps {
  planId: number;
  userId?: number;
}

export default function Chatbot({ planId, userId = 1 }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your AI study assistant. Ask me anything about your study materials! 📚",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechSynthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;
  
  // Speech Recognition
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update input from speech
  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    resetTranscript();

    try {
      const response = await askChatbot(userMessage.content, planId, userId);

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.answer,
        timestamp: new Date(),
        provider: response.provider_used
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Auto-speak if enabled
      if (voiceEnabled) {
        speakText(response.answer);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    if (browserSupportsSpeechRecognition) {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: false, language: 'en-US' });
    } else {
      alert('Speech recognition not supported. Please use Chrome.');
    }
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const speakText = (text: string) => {
    if (!speechSynthesis) return;

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = 'en-US';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const clearHistory = async () => {
    try {
      await clearChatHistory(userId, planId);
      setMessages([{
        role: 'assistant',
        content: "Conversation cleared. How can I help you?",
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const quickPrompts = [
    "Explain this topic",
    "Give me an example",
    "Common mistakes?",
    "Quiz me"
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center z-50 hover:scale-110 animate-pulse"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold animate-bounce">
          AI
        </span>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${isMinimized ? 'w-80' : 'w-96'} transition-all duration-300`}>
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[600px]">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold">AI Study Assistant</h3>
              <p className="text-xs text-blue-100">
                {listening ? '🎤 Listening...' : 'Always here to help'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className="p-2 hover:bg-white/20 rounded-lg transition"
              title={voiceEnabled ? "Voice ON" : "Voice OFF"}
            >
              {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              {isMinimized ? <Maximize2 className="w-5 h-5" /> : <Minimize2 className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-linear-to-b from-gray-50 to-white">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {message.provider && message.role === 'assistant' && (
                        <span className="text-xs opacity-70 ml-2">
                          via {message.provider}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 flex items-center gap-2 shadow-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-4 py-2 bg-white border-t border-gray-200">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setInputText(prompt)}
                    className="px-3 py-1 text-xs bg-linear-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 text-gray-700 rounded-full whitespace-nowrap transition border border-blue-200"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={listening ? "Listening..." : "Ask me anything..."}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  disabled={isLoading || listening}
                />
                
                {browserSupportsSpeechRecognition && (
                  <button
                    onClick={listening ? stopListening : startListening}
                    className={`p-3 rounded-full transition ${
                      listening
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    disabled={isLoading}
                  >
                    {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                )}
                
                {isSpeaking ? (
                  <button
                    onClick={stopSpeaking}
                    className="p-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition"
                  >
                    <VolumeX className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputText.trim()}
                    className="p-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 text-xs">
                  {listening && (
                    <span className="text-red-600 flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                      Recording...
                    </span>
                  )}
                  {isSpeaking && (
                    <span className="text-orange-600 flex items-center gap-1">
                      <Volume2 className="w-3 h-3" />
                      Speaking...
                    </span>
                  )}
                </div>
                <button
                  onClick={clearHistory}
                  className="text-xs text-gray-500 hover:text-red-600 transition flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
