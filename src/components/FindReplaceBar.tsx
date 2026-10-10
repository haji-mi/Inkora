import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ChevronUp,
  ChevronDown,
  X,
  CaseSensitive,
  ArrowRightLeft,
  Check,
} from 'lucide-react';
import { Editor } from '@tiptap/react';

interface FindReplaceBarProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor | null;
  isSourceMode: boolean;
  markdown: string;
  onSourceReplaceAll: (newMarkdown: string) => void;
  initialMode?: 'find' | 'replace';
}

interface MatchRange {
  from: number;
  to: number;
}

export const FindReplaceBar: React.FC<FindReplaceBarProps> = ({
  isOpen,
  onClose,
  editor,
  isSourceMode,
  markdown,
  onSourceReplaceAll,
  initialMode = 'find',
}) => {
  const [showReplace, setShowReplace] = useState(initialMode === 'replace');
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [matches, setMatches] = useState<MatchRange[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync mode when initialMode changes or panel opens
  useEffect(() => {
    if (isOpen) {
      setShowReplace(initialMode === 'replace');
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    }
  }, [isOpen, initialMode]);

  // Search matches inside TipTap ProseMirror document or source text
  useEffect(() => {
    if (!isOpen || !searchQuery.trim()) {
      setMatches([]);
      setCurrentMatchIndex(-1);
      return;
    }

    if (!isSourceMode && editor) {
      const results: MatchRange[] = [];
      const query = matchCase ? searchQuery : searchQuery.toLowerCase();

      editor.state.doc.descendants((node, pos) => {
        if (node.isText && node.text) {
          const text = matchCase ? node.text : node.text.toLowerCase();
          let startIndex = 0;
          while (true) {
            const index = text.indexOf(query, startIndex);
            if (index === -1) break;
            results.push({
              from: pos + index,
              to: pos + index + query.length,
            });
            startIndex = index + query.length;
          }
        }
      });

      setMatches(results);
      if (results.length > 0) {
        // Find if current cursor is already on one of the matches
        const currentPos = editor.state.selection.from;
        const foundIdx = results.findIndex((m) => m.from >= currentPos);
        const nextIdx = foundIdx !== -1 ? foundIdx : 0;
        setCurrentMatchIndex(nextIdx);
        highlightAndScrollToMatch(results[nextIdx]);
      } else {
        setCurrentMatchIndex(-1);
      }
    } else if (isSourceMode) {
      // In source mode, calculate matches from markdown string
      const results: MatchRange[] = [];
      const targetText = matchCase ? markdown : markdown.toLowerCase();
      const query = matchCase ? searchQuery : searchQuery.toLowerCase();
      let startIndex = 0;
      while (true) {
        const index = targetText.indexOf(query, startIndex);
        if (index === -1) break;
        results.push({
          from: index,
          to: index + query.length,
        });
        startIndex = index + query.length;
      }
      setMatches(results);
      setCurrentMatchIndex(results.length > 0 ? 0 : -1);
    }
  }, [searchQuery, matchCase, isOpen, editor, isSourceMode, markdown]);

  const highlightAndScrollToMatch = (range: MatchRange | undefined) => {
    if (!range || !editor || isSourceMode) return;
    try {
      editor.commands.setTextSelection({ from: range.from, to: range.to });
      const dom = editor.view.domAtPos(range.from);
      const targetEl =
        dom.node instanceof HTMLElement ? dom.node : dom.node.parentElement;
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } catch {
      // Ignore positioning errors
    }
  };

  const handleNext = () => {
    if (matches.length === 0) return;
    const nextIdx = (currentMatchIndex + 1) % matches.length;
    setCurrentMatchIndex(nextIdx);
    highlightAndScrollToMatch(matches[nextIdx]);
  };

  const handlePrev = () => {
    if (matches.length === 0) return;
    const prevIdx = (currentMatchIndex - 1 + matches.length) % matches.length;
    setCurrentMatchIndex(prevIdx);
    highlightAndScrollToMatch(matches[prevIdx]);
  };

  const handleReplaceCurrent = () => {
    if (matches.length === 0 || currentMatchIndex === -1) return;

    if (!isSourceMode && editor) {
      const currentRange = matches[currentMatchIndex];
      editor
        .chain()
        .focus()
        .insertContentAt(
          { from: currentRange.from, to: currentRange.to },
          replaceQuery
        )
        .run();
    } else if (isSourceMode) {
      const currentRange = matches[currentMatchIndex];
      const newMd =
        markdown.slice(0, currentRange.from) +
        replaceQuery +
        markdown.slice(currentRange.to);
      onSourceReplaceAll(newMd);
    }
  };

  const handleReplaceAll = () => {
    if (matches.length === 0) return;

    if (!isSourceMode && editor) {
      // Dispatch in reverse order to keep positions intact
      let tr = editor.state.tr;
      for (let i = matches.length - 1; i >= 0; i--) {
        const { from, to } = matches[i];
        tr = tr.replaceWith(
          from,
          to,
          replaceQuery ? editor.state.schema.text(replaceQuery) : []
        );
      }
      editor.view.dispatch(tr);
    } else if (isSourceMode) {
      const flags = matchCase ? 'g' : 'gi';
      const escaped = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, flags);
      const newMd = markdown.replace(regex, replaceQuery);
      onSourceReplaceAll(newMd);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        handlePrev();
      } else {
        handleNext();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-2 right-6 z-30 flex flex-col bg-white/95 dark:bg-[#1E1E1E]/95 backdrop-blur-md rounded-lg shadow-xl border border-black/10 dark:border-white/10 p-2 text-xs select-none animate-in fade-in slide-in-from-top-2 duration-150 w-[380px]">
      {/* Search Line */}
      <div className="flex items-center gap-1.5">
        <div className="relative flex-1 flex items-center">
          <Search className="w-3.5 h-3.5 absolute left-2 text-neutral-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="查找文本..."
            className="w-full pl-7 pr-16 py-1 bg-black/5 dark:bg-white/5 rounded border border-black/10 dark:border-white/10 focus:border-[#0071E3] focus:outline-none text-neutral-800 dark:text-neutral-200 text-xs"
          />
          {/* Match Count Badge */}
          <span className="absolute right-2 text-[10.5px] text-neutral-400 font-mono">
            {searchQuery.trim()
              ? matches.length > 0
                ? `${currentMatchIndex + 1}/${matches.length}`
                : '无匹配'
              : ''}
          </span>
        </div>

        {/* Case Sensitive Toggle */}
        <button
          onClick={() => setMatchCase(!matchCase)}
          title="区分大小写 (Alt+C)"
          className={`p-1.5 rounded border transition-colors ${
            matchCase
              ? 'bg-[#0071E3] text-white border-transparent'
              : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5 text-neutral-600 dark:text-neutral-300'
          }`}
        >
          <CaseSensitive className="w-3.5 h-3.5" />
        </button>

        {/* Navigation buttons */}
        <button
          onClick={handlePrev}
          disabled={matches.length === 0}
          title="上一个 (Shift+Enter)"
          className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 text-neutral-600 dark:text-neutral-300 transition-colors"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleNext}
          disabled={matches.length === 0}
          title="下一个 (Enter)"
          className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 text-neutral-600 dark:text-neutral-300 transition-colors"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>

        {/* Toggle Replace Row */}
        <button
          onClick={() => setShowReplace(!showReplace)}
          title={showReplace ? '收起替换面板' : '展开替换面板 (Ctrl+H)'}
          className={`p-1.5 rounded border transition-colors ${
            showReplace
              ? 'bg-[#0071E3]/10 text-[#0071E3] dark:text-[#388BFD] border-[#0071E3]/30'
              : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5 text-neutral-600 dark:text-neutral-300'
          }`}
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
        </button>

        {/* Close Button */}
        <button
          onClick={onClose}
          title="关闭 (Esc)"
          className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 text-neutral-500 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Replace Line */}
      {showReplace && (
        <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-black/5 dark:border-white/5">
          <input
            type="text"
            value={replaceQuery}
            onChange={(e) => setReplaceQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="替换为..."
            className="flex-1 px-2.5 py-1 bg-black/5 dark:bg-white/5 rounded border border-black/10 dark:border-white/10 focus:border-[#0071E3] focus:outline-none text-neutral-800 dark:text-neutral-200 text-xs"
          />
          <button
            onClick={handleReplaceCurrent}
            disabled={matches.length === 0 || currentMatchIndex === -1}
            className="px-2.5 py-1 rounded bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-40 text-neutral-700 dark:text-neutral-200 text-xs font-medium transition-colors"
          >
            替换
          </button>
          <button
            onClick={handleReplaceAll}
            disabled={matches.length === 0}
            className="px-2.5 py-1 rounded bg-[#0071E3] hover:bg-[#0060C0] disabled:opacity-40 text-white text-xs font-medium transition-colors shadow-sm"
          >
            全部替换
          </button>
        </div>
      )}
    </div>
  );
};

