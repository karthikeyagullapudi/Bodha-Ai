import React from 'react';

const promptCategories = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-violet-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
    title: 'Code & Technical Support',
    prompts: [
      'Write a React hook for fetching and caching API data with error handling',
      'Explain how WebSockets work and build an Express.js socket server sample',
    ],
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-fuchsia-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
    title: 'Real-time Web Search',
    prompts: [
      'What are the latest breakthroughs in AI models and agent frameworks this month?',
      'Summarize key tech news and emerging software architecture trends',
    ],
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-amber-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
    title: 'Creative & Architecture',
    prompts: [
      'Brainstorm 5 innovative SaaS concepts using AI agents for productivity',
      'Design a scalable microservices architecture for a high-traffic AI app',
    ],
  },
];

const PromptSuggestions = ({ onSelectPrompt, userName }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto w-full z-10 my-auto">
      {/* Brand Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping"></span>
        Powered by Gemini 3.6 Flash & Tavily Search
      </div>

      {/* Hero Headline */}
      <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
        Hello,{' '}
        <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
          {userName || 'Creator'}
        </span>
      </h1>
      <p className="text-zinc-400 text-base md:text-lg max-w-xl mb-10 leading-relaxed font-normal">
        What would you like to explore or build today? Select a prompt below or start typing below.
      </p>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-left">
        {promptCategories.map((cat, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-zinc-900/50 border border-white/10 hover:border-violet-500/40 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_8px_30px_rgb(139,92,246,0.15)] group flex flex-col justify-between"
          >
            <div>
              <div className="p-2.5 w-fit rounded-xl bg-zinc-800/80 border border-white/5 mb-4 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <h3 className="text-sm font-semibold text-zinc-200 mb-3 group-hover:text-violet-300 transition-colors">
                {cat.title}
              </h3>
            </div>
            <div className="space-y-2">
              {cat.prompts.map((promptText, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => onSelectPrompt(promptText)}
                  className="w-full text-left p-2.5 rounded-xl bg-zinc-950/40 hover:bg-violet-600/20 border border-white/5 hover:border-violet-500/30 text-xs text-zinc-400 hover:text-zinc-100 transition-all duration-200 line-clamp-2"
                >
                  "{promptText}"
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptSuggestions;
