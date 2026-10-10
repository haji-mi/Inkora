import React, { useState, useEffect, useRef } from 'react';
import { WorkspaceFile, HeadingItem } from '../types/file';
import { Search, FileText, Hash, X } from 'lucide-react';

interface QuickOpenModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: WorkspaceFile[];
  onSelectFile: (file: WorkspaceFile) => void;
  headings: HeadingItem[];
  onSelectHeading: (text: string, index?: number) => void;
}

export const QuickOpenModal: React.FC<QuickOpenModalProps> = ({
  isOpen,
  onClose,
  files,
  onSelectFile,
  headings,
  onSelectHeading,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter items based on query
  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(query.toLowerCase())
  );
  const filteredHeadings = headings.filter((h) =>
    h.text.toLowerCase().includes(query.toLowerCase())
  );

  const totalItems = [
    ...filteredFiles.map((f) => ({ type: 'file' as const, data: f })),
    ...filteredHeadings.map((h) => ({ type: 'heading' as const, data: h })),
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, totalItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? totalItems.length - 1 : prev - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = totalItems[selectedIndex];
      if (item) {
        if (item.type === 'file') {
          onSelectFile(item.data as WorkspaceFile);
        } else {
          const heading = item.data as HeadingItem;
          onSelectHeading(heading.text, heading.index);
        }
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/30 backdrop-blur-sm animate-in fade-in duration-100">
      <div
        className="w-full max-w-lg mac-glass bg-white/95 dark:bg-[#252525]/95 rounded-xl shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-3 border-b border-black/5 dark:border-white/5 flex items-center gap-2.5">
          <Search size={16} className="text-mac-text-secondary" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="搜索文档或章节大纲... (按 Esc 关闭)"
            className="w-full bg-transparent text-sm text-mac-text-primary dark:text-mac-text-darkPrimary focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-mac-text-secondary hover:text-mac-text-primary"
          >
            <X size={14} />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto p-1.5 space-y-0.5">
          {totalItems.length === 0 ? (
            <div className="py-6 text-center text-xs text-mac-text-secondary">
              未找到匹配项
            </div>
          ) : (
            totalItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (item.type === 'file') {
                      onSelectFile(item.data as WorkspaceFile);
                    } else {
                      onSelectHeading((item.data as HeadingItem).text);
                    }
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-3 py-2 rounded-lg flex items-center justify-between text-xs cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#0071E3] text-white'
                      : 'text-mac-text-primary dark:text-mac-text-darkPrimary hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {item.type === 'file' ? (
                      <FileText
                        size={14}
                        className={isSelected ? 'text-white' : 'text-mac-text-secondary'}
                      />
                    ) : (
                      <Hash
                        size={14}
                        className={isSelected ? 'text-white' : 'text-[#0071E3]'}
                      />
                    )}
                    <span className="truncate">
                      {item.type === 'file'
                        ? (item.data as WorkspaceFile).name
                        : (item.data as HeadingItem).text}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-black/5 dark:bg-white/10 text-mac-text-secondary'
                    }`}
                  >
                    {item.type === 'file' ? '文件' : `H${(item.data as HeadingItem).level}`}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
