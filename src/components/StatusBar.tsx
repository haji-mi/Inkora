import React, { useState, useRef, useEffect } from 'react';
import { BarChart3, X, Clock, FileText, AlignLeft } from 'lucide-react';

interface StatusBarProps {
  wordCount: number;
  charCount: number;
  line: number;
  column: number;
  isSourceMode: boolean;
  isFocusMode: boolean;
  isTypewriterMode: boolean;
  fullContent?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  wordCount,
  charCount,
  line,
  column,
  isSourceMode,
  isFocusMode,
  isTypewriterMode,
  fullContent = '',
}) => {
  const [showStatsModal, setShowStatsModal] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setShowStatsModal(false);
      }
    };
    if (showStatsModal) {
      window.addEventListener('mousedown', handleClickOutside);
    }
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [showStatsModal]);

  // Enhanced statistics calculation
  const stats = React.useMemo(() => {
    const text = fullContent;
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (text.match(/[a-zA-Z0-9_-]+/g) || []).length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const paragraphs = text
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean).length;
    const totalLines = text ? text.split('\n').length : 1;
    // Estimated reading time (silent: ~350 chars/min, spoken: ~180 chars/min)
    const silentMin = Math.max(1, Math.ceil(charCount / 350));
    const speechMin = Math.max(1, Math.ceil(charCount / 180));

    return {
      chineseChars,
      englishWords,
      charsNoSpaces,
      paragraphs,
      totalLines,
      silentMin,
      speechMin,
    };
  }, [fullContent, charCount]);

  const readingTime = Math.max(1, Math.ceil(charCount / 400));

  return (
    <footer className="h-[26px] select-none flex items-center justify-between px-3 text-[11px] mac-glass border-t border-black/5 dark:border-white/5 text-mac-text-secondary z-20 relative">
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

      {/* Right: Typing Metrics (Clickable for Word Count Details Popover) */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowStatsModal(!showStatsModal)}
          title="点击查看详细统计信息"
          className="flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 px-1.5 py-0.5 rounded transition-colors text-mac-text-secondary hover:text-[#0071E3] dark:hover:text-[#388BFD]"
        >
          <span>{charCount} 字符</span>
          <span>{wordCount} 词</span>
          <span className="opacity-60 text-[10px]">(详情)</span>
        </button>

        <span className="opacity-40">|</span>
        <span>约 {readingTime} 分钟阅读</span>
        <span className="opacity-40">|</span>
        <span>
          行 {line}, 列 {column}
        </span>
        <span className="opacity-40">|</span>
        <span>UTF-8</span>
      </div>

      {/* Typora-style Word Count Details Popover */}
      {showStatsModal && (
        <div
          ref={popoverRef}
          className="absolute bottom-[30px] right-3 w-[280px] bg-white/95 dark:bg-[#1E1E1E]/95 backdrop-blur-md rounded-lg shadow-2xl border border-black/10 dark:border-white/10 p-3.5 text-xs text-neutral-800 dark:text-neutral-200 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-black/5 dark:border-white/10">
            <span className="font-semibold flex items-center gap-1.5 text-neutral-900 dark:text-neutral-100">
              <BarChart3 className="w-3.5 h-3.5 text-[#0071E3]" />
              文档统计信息
            </span>
            <button
              onClick={() => setShowStatsModal(false)}
              className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Metrics Grid */}
          <div className="space-y-1.5 font-sans">
            <div className="flex justify-between items-center py-0.5">
              <span className="text-neutral-500 dark:text-neutral-400">词数 (Words)</span>
              <span className="font-medium font-mono">{wordCount}</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-neutral-500 dark:text-neutral-400">中文字数</span>
              <span className="font-medium font-mono">{stats.chineseChars}</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-neutral-500 dark:text-neutral-400">英文单词数</span>
              <span className="font-medium font-mono">{stats.englishWords}</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-neutral-500 dark:text-neutral-400">字符数 (含空格)</span>
              <span className="font-medium font-mono">{charCount}</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-neutral-500 dark:text-neutral-400">字符数 (不含空格)</span>
              <span className="font-medium font-mono">{stats.charsNoSpaces}</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-neutral-500 dark:text-neutral-400">段落数</span>
              <span className="font-medium font-mono">{stats.paragraphs}</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-neutral-500 dark:text-neutral-400">总行数</span>
              <span className="font-medium font-mono">{stats.totalLines}</span>
            </div>
          </div>

          {/* Reading Time Estimates Footer */}
          <div className="mt-3 pt-2.5 border-t border-black/5 dark:border-white/10 text-[11px] text-neutral-500 dark:text-neutral-400 space-y-1">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-neutral-400" /> 预估默读时间
              </span>
              <span className="font-medium text-neutral-700 dark:text-neutral-300">
                ~ {stats.silentMin} 分钟
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <AlignLeft className="w-3 h-3 text-neutral-400" /> 预估朗读时间
              </span>
              <span className="font-medium text-neutral-700 dark:text-neutral-300">
                ~ {stats.speechMin} 分钟
              </span>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
