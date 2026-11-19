import React, { useEffect, useRef, useState } from 'react';
import { Send, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { chatService } from '../services/chatService';
import { ChatMessage } from '../types';
import { generateId } from '../utils/formatters';

const SUGGESTED_QUESTIONS: Record<'en' | 'ta', string[]> = {
  en: [
    'Prepare 4 technical Java & Spring Boot interview questions for a remote junior role',
    'Write a polite follow-up email for a Sri Lanka remote software engineering application',
    'Give me HR interview tips and a sample answer for working remotely from Sri Lanka',
    'How can I improve my resume for international remote React & Java positions?',
  ],
  ta: [
    'இலங்கையிலிருந்து Work-From-Home Java Spring Boot நேர்காணலுக்கு எவ்வாறு தயாராவது?',
    'விண்ணப்பித்த வேலைக்கு மரியாதையான follow-up email எழுத உதவுங்கள்',
    'Remote வேலைக்கான HR நேர்காணல் கேள்விகள் மற்றும் மாதிரி பதில்கள் தாருங்கள்',
  ],
};

export const CareerAssistantPage: React.FC = () => {
  const { chatMessages, appendChatMessages, clearChatMessages, backendConnected } =
    useApp();

  const [language, setLanguage] = useState<'en' | 'ta'>('en');
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, sending]);

  const sendText = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const userMsg: ChatMessage = {
      id: generateId('msg_u'),
      role: 'user',
      content: trimmed,
      language,
      source: backendConnected ? 'GEMINI_BACKEND' : 'DEMO_PREVIEW',
      timestamp: new Date().toISOString(),
    };

    setInput('');
    setSending(true);
    try {
      const assistantMsg = await chatService.sendMessage(trimmed, language);
      appendChatMessages(userMsg, assistantMsg);
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendText(input);
  };

  return (
    <DashboardLayout
      title="Career Assistant"
      breadcrumb="Career Tools / Career Assistant"
      actionButton={
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-[#FAF8FF] border border-[#E7E0EF] rounded-lg">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                language === 'en'
                  ? 'btn-purple-gradient text-white shadow-sm'
                  : 'text-[#756B83]'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('ta')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                language === 'ta'
                  ? 'btn-purple-gradient text-white shadow-sm'
                  : 'text-[#756B83]'
              }`}
            >
              தமிழ்
            </button>
          </div>
          {chatMessages.length > 0 && (
            <button
              type="button"
              onClick={clearChatMessages}
              className="px-3 py-1.5 text-xs font-semibold text-[#281C3B] bg-white border border-[#E7E0EF] hover:bg-[#FAF8FF] rounded-lg inline-flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Chat</span>
            </button>
          )}
        </div>
      }
    >
      <div className="card-elevated border rounded-xl flex flex-col h-[calc(100vh-14rem)] min-h-[520px] overflow-hidden">
        {/* Status strip */}
        <div className="px-5 py-3 border-b border-[#E7E0EF] bg-[#FAF8FF] flex flex-wrap items-center justify-between gap-2 text-xs text-[#756B83]">
          <span>
            {backendConnected
              ? 'Live Gemini AI Career Assistant connected through Java Spring Boot & MySQL.'
              : 'Demo Preview Assistant: Responses illustrate Tamil & English interview prep. Connect Java Spring Boot + Gemini API for live personalized AI chat.'}
          </span>
          <span className="font-semibold text-[#7046A5]">
            Active Language: {language === 'ta' ? 'தமிழ் (Tamil)' : 'English'}
          </span>
        </div>

        {/* Messages Viewport */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {chatMessages.length === 0 ? (
            <div className="max-w-2xl mx-auto py-8 space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-lg font-bold text-[#211638]">
                  {language === 'ta'
                    ? 'Smart Hire தொழில் வழிகாட்டி (Career Assistant)'
                    : 'Smart Hire Career Assistant'}
                </h2>
                <p className="text-sm text-[#756B83]">
                  {language === 'ta'
                    ? 'தொழில்நுட்ப மற்றும் HR நேர்காணல் கேள்விகள், மாதிரி பதில்கள், Resume மேம்பாடு மற்றும் Follow-up மின்னஞ்சல்களுக்கு கீழே உள்ள கேள்விகளைத் தேர்ந்தெடுக்கவும்.'
                    : 'Ask for technical or HR interview prep, sample answers, resume advice, or follow-up emails for Sri Lanka remote jobs.'}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {SUGGESTED_QUESTIONS[language].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => sendText(q)}
                    className="p-3.5 text-left text-sm text-[#281C3B] bg-[#FAF8FF] hover:bg-[#E9DDFB] border border-[#E7E0EF] hover:border-[#A78BFA] rounded-xl transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-2xl rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-hero-gradient text-white shadow-sm'
                      : 'bg-[#FAF8FF] text-[#281C3B] border border-[#E7E0EF]'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}

          {sending && (
            <div className="flex justify-start">
              <div className="bg-[#FAF8FF] border border-[#E7E0EF] rounded-xl px-4 py-3 text-xs font-medium text-[#756B83]">
                Preparing career guidance...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggested chips when chat active */}
        {chatMessages.length > 0 && (
          <div className="px-4 py-2 border-t border-[#E7E0EF] bg-[#FAF8FF] flex items-center gap-2 overflow-x-auto">
            {SUGGESTED_QUESTIONS[language].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => sendText(q)}
                className="px-3 py-1 text-xs font-medium text-[#281C3B] bg-white border border-[#E7E0EF] hover:border-[#A78BFA] hover:bg-[#E9DDFB]/40 rounded-lg whitespace-nowrap shrink-0"
              >
                {q.slice(0, 48)}...
              </button>
            ))}
          </div>
        )}

        {/* Composer */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-[#E7E0EF] bg-white flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              language === 'ta'
                ? 'உங்கள் தொழில் அல்லது நேர்காணல் கேள்வியை உள்ளிடவும்...'
                : 'Ask about remote interviews, follow-up emails, Java/React questions...'
            }
            className="flex-1 px-4 py-2.5 text-sm border border-[#E7E0EF] rounded-lg text-[#281C3B] placeholder:text-[#756B83] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="px-4 py-2.5 text-sm font-semibold btn-purple-gradient rounded-lg inline-flex items-center gap-2 disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};
