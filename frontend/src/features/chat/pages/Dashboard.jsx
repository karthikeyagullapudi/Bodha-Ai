import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useChat from '../hooks/useChat';
import { useAuth } from '../../auth/hook/useAuth';
import { setCurrentChatId } from '../chat.slice';
import CodeBlock from '../components/CodeBlock';
import PromptSuggestions from '../components/PromptSuggestions';

const Dashboard = () => {
  const chat = useChat();
  const { handleLogout } = useAuth();
  const dispatch = useDispatch();

  const [message, setMessage] = useState('');
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedMsgIdx, setCopiedMsgIdx] = useState(null);

  const messagesEndRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const { chats, currentChatId, isLoading } = useSelector((state) => state.chat);

  useEffect(() => {
    chat.handleGetChats();
  }, []);

  const currentMessages = currentChatId ? chats[currentChatId]?.messages || [] : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, isLoading]);

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId);
    setSidebarOpen(false);
  };

  const handleNewChat = () => {
    dispatch(setCurrentChatId(null));
    setMessage('');
    setSidebarOpen(false);
  };

  const handleSend = (textToSend) => {
    const query = textToSend || message;
    if (query.trim() && !isLoading) {
      chat.handleSendMessage({ message: query, chatId: currentChatId });
      setMessage('');
    }
  };

  const startRenaming = (e, chatId, currentTitle) => {
    e.stopPropagation();
    setEditingChatId(chatId);
    setEditingTitle(currentTitle);
  };

  const saveRename = (chatId) => {
    if (editingTitle.trim()) {
      chat.handleRenameChat(chatId, editingTitle.trim());
    }
    setEditingChatId(null);
  };

  const handleDelete = (e, chatId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chat session?')) {
      chat.handleDeleteChat(chatId);
    }
  };

  const copyMessageContent = (content, index) => {
    navigator.clipboard.writeText(content);
    setCopiedMsgIdx(index);
    setTimeout(() => setCopiedMsgIdx(null), 2000);
  };

  return (
    <div className="relative h-screen w-full bg-zinc-950 flex overflow-hidden selection:bg-violet-500/30 font-sans text-white">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-violet-600/15 rounded-full mix-blend-screen filter blur-[120px] animate-pulse pointer-events-none"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-fuchsia-600/15 rounded-full mix-blend-screen filter blur-[120px] animate-pulse pointer-events-none"
        style={{ animationDelay: '2s' }}
      ></div>

      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative z-40 w-80 h-full bg-zinc-900/80 backdrop-blur-2xl border-r border-white/10 flex flex-col shadow-[8px_0_32px_0_rgba(0,0,0,0.5)] transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleNewChat}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-base tracking-wide bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                Bodha AI
              </h1>
              <span className="text-[10px] text-violet-400 font-semibold uppercase tracking-wider block">
                Next-Gen Assistant
              </span>
            </div>
          </div>

          <button
            onClick={handleNewChat}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-all border border-white/10"
            title="Start New Chat"
          >
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
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={handleNewChat}
            className="w-full py-3 px-4 flex items-center justify-center gap-2 border border-violet-500/30 text-sm font-semibold rounded-2xl text-white bg-gradient-to-r from-violet-600/40 to-fuchsia-600/40 hover:from-violet-600/60 hover:to-fuchsia-600/60 transition-all shadow-lg shadow-violet-500/10 hover:shadow-violet-500/20 active:scale-[0.98]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
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
            New Conversation
          </button>
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 custom-scrollbar">
          <div className="text-[11px] font-bold text-zinc-500 tracking-wider uppercase px-3 py-1">
            Recent Chats
          </div>
          {Object.keys(chats).length === 0 ? (
            <div className="text-center py-8 px-4 text-zinc-500 text-xs font-medium">
              No previous chats yet. Start a new conversation!
            </div>
          ) : (
            Object.values(chats).map((chatItem) => {
              const isActive = currentChatId === chatItem.id;
              const isEditing = editingChatId === chatItem.id;

              return (
                <div
                  key={chatItem.id}
                  onClick={() => openChat(chatItem.id)}
                  className={`group relative w-full text-left px-3.5 py-2.5 rounded-xl transition-all border flex items-center justify-between gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-violet-600/20 text-white border-violet-500/30 shadow-md shadow-violet-500/10'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 shrink-0 ${
                        isActive ? 'text-violet-400' : 'text-zinc-500 group-hover:text-zinc-300'
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>

                    {isEditing ? (
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveRename(chatItem.id);
                          if (e.key === 'Escape') setEditingChatId(null);
                        }}
                        onBlur={() => saveRename(chatItem.id)}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        className="w-full bg-zinc-950/80 text-white text-xs px-2 py-1 rounded border border-violet-500 focus:outline-none"
                      />
                    ) : (
                      <span className="truncate text-xs font-medium">{chatItem.title}</span>
                    )}
                  </div>

                  {/* Actions (Rename & Delete) */}
                  {!isEditing && (
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity shrink-0">
                      <button
                        onClick={(e) => startRenaming(e, chatItem.id, chatItem.title)}
                        className="p-1 text-zinc-400 hover:text-violet-300 hover:bg-white/10 rounded transition-colors"
                        title="Rename Chat"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, chatItem.id)}
                        className="p-1 text-zinc-400 hover:text-red-400 hover:bg-white/10 rounded transition-colors"
                        title="Delete Chat"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* User Profile Footer Area with Dropdown */}
        <div className="p-3 border-t border-white/10 bg-zinc-900/60 relative">
          {showProfileMenu && (
            <div className="absolute bottom-16 left-3 right-3 bg-zinc-900/95 border border-white/15 rounded-2xl p-2 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="px-3 py-2 border-b border-white/10 mb-1">
                <p className="text-xs font-semibold text-white">{user?.name || 'User Profile'}</p>
                <p className="text-[11px] text-zinc-400 truncate">{user?.email || 'user@example.com'}</p>
              </div>
              <div className="px-3 py-2 text-[11px] text-violet-400 font-medium flex items-center justify-between">
                <span>Model Engine</span>
                <span className="px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-[10px]">
                  Gemini 2.5
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full mt-1 flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-500/10 text-red-400 text-xs font-semibold transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sign Out
              </button>
            </div>
          )}

          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/5"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-600 to-amber-500 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/20 font-bold text-sm text-white">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-semibold truncate text-zinc-200">
                {user?.name || 'User Name'}
              </h3>
              <p className="text-[11px] text-zinc-500 truncate">
                {user?.email || 'user@example.com'}
              </p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 text-zinc-500 transition-transform ${
                showProfileMenu ? 'rotate-180 text-violet-400' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Chat Content Area */}
      <div className="relative z-10 flex-1 flex flex-col h-full bg-zinc-950/40">
        {/* Top Navbar */}
        <div className="h-16 border-b border-white/10 flex items-center justify-between px-4 md:px-6 bg-zinc-900/40 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl bg-zinc-800/60 border border-white/10 text-zinc-300 md:hidden hover:text-white"
            >
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div>
              <h2 className="text-sm md:text-base font-semibold text-zinc-100 flex items-center gap-2">
                {currentChatId && chats[currentChatId]
                  ? chats[currentChatId].title
                  : 'New Conversation'}
              </h2>
              <p className="text-[11px] text-zinc-400 font-medium">
                {currentChatId ? 'Active Session' : 'Ready to help'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live & Connected
            </span>
          </div>
        </div>

        {/* Message Thread or Starter Suggestions */}
        {!currentChatId || currentMessages.length === 0 ? (
          <PromptSuggestions
            userName={user?.name}
            onSelectPrompt={(promptText) => handleSend(promptText)}
          />
        ) : (
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar z-10">
            {currentMessages.map((msg, index) => (
              <div
                key={msg._id || index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex items-start gap-3 max-w-[90%] md:max-w-[78%]">
                  {msg.role === 'ai' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center shrink-0 shadow-md shadow-violet-500/20 text-white font-bold text-xs mt-1">
                      AI
                    </div>
                  )}

                  <div
                    className={`group relative rounded-2xl px-5 py-4 shadow-xl ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-tr-xs shadow-violet-600/10'
                        : 'bg-zinc-900/80 border border-white/10 text-zinc-200 rounded-tl-xs backdrop-blur-md'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <>
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({ children }) => (
                              <h1 className="text-xl font-bold mt-4 mb-2 text-white border-b border-white/10 pb-1">
                                {children}
                              </h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-lg font-bold mt-3 mb-2 text-white">
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-base font-semibold mt-2 mb-1 text-white">
                                {children}
                              </h3>
                            ),
                            p: ({ children }) => (
                              <p className="text-[15px] leading-relaxed mb-3 last:mb-0 text-zinc-200">
                                {children}
                              </p>
                            ),
                            ul: ({ children }) => (
                              <ul className="list-disc pl-5 mb-3 space-y-1 text-zinc-200">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="list-decimal pl-5 mb-3 space-y-1 text-zinc-200">
                                {children}
                              </ol>
                            ),
                            li: ({ children }) => (
                              <li className="text-[15px] leading-relaxed">{children}</li>
                            ),
                            code: ({ inline, className, children }) => {
                              const match = /language-(\w+)/.exec(className || '');
                              return !inline ? (
                                <CodeBlock
                                  language={match ? match[1] : ''}
                                  code={String(children).replace(/\n$/, '')}
                                />
                              ) : (
                                <code className="bg-zinc-800 text-violet-300 px-1.5 py-0.5 rounded text-[13px] font-mono border border-white/5">
                                  {children}
                                </code>
                              );
                            },
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-4 border-violet-500 pl-4 italic text-zinc-400 my-3 bg-violet-500/5 py-2 rounded-r-lg">
                                {children}
                              </blockquote>
                            ),
                            a: ({ href, children }) => (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-violet-400 underline font-medium hover:text-violet-300 transition-colors"
                              >
                                {children}
                              </a>
                            ),
                            strong: ({ children }) => (
                              <strong className="font-semibold text-white">{children}</strong>
                            ),
                            hr: () => <hr className="border-white/10 my-4" />,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>

                        {/* Copy Full AI Message Action Bar */}
                        <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-end gap-2 text-xs">
                          <button
                            onClick={() => copyMessageContent(msg.content, index)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            {copiedMsgIdx === index ? (
                              <span className="text-emerald-400 font-medium">Copied Response!</span>
                            ) : (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3.5 w-3.5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                  />
                                </svg>
                                <span>Copy Response</span>
                              </>
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* AI Typing / Thinking Animation */}
            {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center shrink-0 shadow-md shadow-violet-500/20 text-white font-bold text-xs mt-1">
                  AI
                </div>
                <div className="bg-zinc-900/80 border border-white/10 rounded-2xl px-5 py-4 backdrop-blur-md flex items-center gap-3 text-zinc-400 text-sm font-medium">
                  <span>Bodha AI is generating response</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce"></span>
                    <span
                      className="w-2 h-2 rounded-full bg-fuchsia-400 animate-bounce"
                      style={{ animationDelay: '0.15s' }}
                    ></span>
                    <span
                      className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"
                      style={{ animationDelay: '0.3s' }}
                    ></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Bar Area */}
        <div className="p-4 md:p-6 pt-2 z-20">
          <div className="relative flex items-end gap-2 bg-zinc-900/80 backdrop-blur-2xl border border-white/15 rounded-[2rem] p-2.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] transition-all focus-within:border-violet-500/60 focus-within:shadow-[0_0_25px_-3px_rgba(139,92,246,0.3)]">
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask Bodha AI anything... (Press Enter to send)"
              className="w-full max-h-[25vh] min-h-[44px] bg-transparent text-white px-4 py-2.5 focus:outline-none resize-none placeholder-zinc-500 text-sm md:text-base custom-scrollbar"
              rows={1}
            />

            <button
              onClick={() => handleSend()}
              disabled={!message.trim() || isLoading}
              className="flex items-center justify-center shrink-0 p-3 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white transition-all hover:brightness-110 shadow-lg shadow-violet-600/30 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed m-1 active:scale-95"
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 transform -rotate-45 ml-0.5 mb-0.5"
                >
                  <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                </svg>
              )}
            </button>
          </div>
          <div className="text-center mt-2.5">
            <p className="text-[11px] text-zinc-500 font-medium tracking-wide">
              Bodha AI integrates Gemini 2.5 Flash & Tavily Web Search. Verify important factual responses.
            </p>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.12);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
        }
      `,
        }}
      />
    </div>
  );
};

export default Dashboard;
