import React from 'react';

interface StatusBarProps {
  wordCount: number;
  charCount: number;
  line: number;
  column: number;
  isSourceMode: boolean;
  isFocusMode: boolean;
  isTypewriterMode: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  wordCount,
  charCount,
  line,
  column,
  isSourceMode,
  isFocusMode,
  isTypewriterMode,
}) => {
  // Estimated reading time (average 300 words/min or 400 chars/min)
  const readingTime = Math.max(1, Math.ceil(charCount / 400));

  return (
    <footer className="h-[26px] select-none flex items-center justify-between px-3 text-[11px] mac-glass border-t border-black/5 dark:border-white/5 text-mac-text-secondary z-20">
      {/* Left: Mode Indicators */}
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          {isSourceMode ? '源码编辑模式' : '实时所见即所得'}
        </span>

        {isFocusMode && (
          <span className="bg-[#0071E3]/10 text-[#0071E3] dark:text-[#388BFD] px-1.5 py-0.2 rounded text-[10px]">
            专注模式
          </span>
        )}
        {isTypewriterMode && (
          <span className="bg-purple-500/10 text-purple-600 dark:text-purple-400 px-1.5 py-0.2 rounded text-[10px]">
            打字机模式
          </span>
        )}
      </div>

      {/* Right: Typing Metrics */}
      <div className="flex items-center gap-3">
        <span>{charCount} 字符</span>
        <span>{wordCount} 词</span>
        <span>约 {readingTime} 分钟阅读</span>
        <span className="opacity-40">|</span>
        <span>行 {line}, 列 {column}</span>
        <span className="opacity-40">|</span>
        <span>UTF-8</span>
      </div>
    </footer>
  );
};
