import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useChat from '../hooks/useChat';

const Dashboard = () => {
  const dispatch = useDispatch();
  const chat = useChat();
  const [message, setMessage] = useState('');
  const { user } = useSelector((state) => state.auth);
  const { chats, currentChatId } = useSelector((state) => state.chat);

  useEffect(() => {
    chat.handleGetChats();
  }, []);

  console.log({ chats, currentChatId });

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId);
  };

  return (
    <div className="relative h-screen w-full bg-zinc-950 flex overflow-hidden selection:bg-violet-500/30 font-sans text-white">
      {/* Background Blurs matching Login page */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse pointer-events-none"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse pointer-events-none"
        style={{ animationDelay: '2s' }}
      ></div>

      {/* Sidebar */}
      <div className="relative z-10 w-80 h-full bg-zinc-900/50 backdrop-blur-xl border-r border-white/10 flex flex-col shadow-[8px_0_32px_0_rgba(0,0,0,0.5)]">
        {/* Header / New Chat Button */}
        <div className="p-4 border-b border-white/10">
          <button className="w-full py-3 px-4 flex items-center justify-center gap-2 border border-white/10 text-sm font-semibold rounded-2xl text-white bg-zinc-800/50 hover:bg-zinc-800 transition-colors shadow-sm hover:shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Chat
          </button>
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide">
          {Object.values(chats).map((chat, index) => (
            <button
              onClick={() => openChat(chat.id)}
              key={index}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all border truncate flex items-center gap-3 ${
                currentChatId === chat.id
                  ? 'bg-white/10 text-white border-white/10'
                  : 'text-zinc-300 hover:bg-white/5 hover:text-white border-transparent hover:border-white/5'
              }`}
            >
              <span className="truncate text-sm font-medium">{chat.title}</span>
            </button>
          ))}
        </div>

        {/* User Profile Area */}
        <div className="p-4 border-t border-white/10 bg-zinc-900/30 mt-auto">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/20">
              <span className="text-sm font-bold">{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold truncate text-zinc-200">
                {user?.name || 'User Name'}
              </h3>
              <p className="text-xs text-zinc-400 truncate">{user?.email || 'user@example.com'}</p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-zinc-500 hover:text-zinc-300 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="relative z-10 flex-1 flex flex-col h-full bg-zinc-950/20">
        {/* Header */}
        <div className="h-16 border-b border-white/5 flex items-center px-6 backdrop-blur-sm shadow-sm z-20">
          <h2 className="text-lg font-semibold text-zinc-200">
            Current Session
          </h2>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide z-10">
          {chats[currentChatId]?.messages?.map((msg, index) => (
            <div
              key={msg._id || index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[65%] rounded-2xl px-5 py-3.5 shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-violet-600 text-white rounded-br-sm'
                    : 'bg-zinc-900/80 border border-white/10 text-zinc-200 rounded-bl-sm backdrop-blur-md'
                }`}
              >
                <p className="text-[15px] leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-6 pt-2 z-20">
          <div className="relative flex items-end gap-2 bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-2 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all focus-within:border-violet-500/50 focus-within:shadow-[0_0_20px_-3px_rgba(139,92,246,0.2)]">
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              placeholder="Message Bodha AI..."
              className="w-full max-h-[30vh] bg-transparent text-white px-4 py-3 focus:outline-none resize-none placeholder-zinc-500 custom-scrollbar"
              rows={1}
            />
            <button
              onClick={() => {
                if (message.trim()) {
                  chat.handleSendMessage({ message, chatId: currentChatId });
                  setMessage('');
                }
              }}
              className="flex items-center justify-center shrink-0 p-3 rounded-full bg-violet-600 text-white transition-all hover:bg-violet-700 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed m-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 relative z-10 transform -rotate-45 ml-0.5 mb-0.5"
              >
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </div>
          <div className="text-center mt-3">
            <p className="text-[11px] text-zinc-500 font-medium tracking-wide">
              Bodha AI can make mistakes. Consider verifying important
              information.
            </p>
          </div>
        </div>
      </div>

      {/* Adding styles for the gradient animation and scrollbar */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `,
        }}
      />
    </div>
  );
};

export default Dashboard;
