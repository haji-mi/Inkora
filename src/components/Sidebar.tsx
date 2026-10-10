import React, { useState } from 'react';
import { WorkspaceFile, HeadingItem } from '../types/file';
import {
  FileText,
  FolderOpen,
  Plus,
  Trash2,
  ListTree,
  Files,
  ChevronRight,
  Hash,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  files: WorkspaceFile[];
  activeFileId: string;
  onSelectFile: (file: WorkspaceFile) => void;
  onCreateFile: () => void;
  onDeleteFile: (id: string) => void;
  headings: HeadingItem[];
  onHeadingClick: (text: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  files,
  activeFileId,
  onSelectFile,
  onCreateFile,
  onDeleteFile,
  headings,
  onHeadingClick,
}) => {
  const [activeTab, setActiveTab] = useState<'files' | 'outline'>('files');

  if (!isOpen) {
    return null;
  }

  return (
    <aside className="w-[260px] h-full mac-glass-sidebar border-r flex flex-col z-20 shrink-0 select-none transition-all duration-200">
      {/* Top Segmented Control (macOS Style) */}
      <div className="p-2 border-b border-black/5 dark:border-white/5 flex items-center justify-between gap-1">
        <div className="flex-1 bg-black/5 dark:bg-white/5 p-0.5 rounded-lg flex items-center text-xs">
          <button
            onClick={() => setActiveTab('files')}
            className={`flex-1 py-1 rounded-md flex items-center justify-center gap-1.5 font-medium transition-all ${
              activeTab === 'files'
                ? 'bg-white dark:bg-[#323232] shadow-sm text-mac-text-primary dark:text-mac-text-darkPrimary'
                : 'text-mac-text-secondary hover:text-mac-text-primary dark:hover:text-mac-text-darkPrimary'
            }`}
          >
            <Files size={13} />
            <span>文档列表</span>
          </button>
          <button
            onClick={() => setActiveTab('outline')}
            className={`flex-1 py-1 rounded-md flex items-center justify-center gap-1.5 font-medium transition-all ${
              activeTab === 'outline'
                ? 'bg-white dark:bg-[#323232] shadow-sm text-mac-text-primary dark:text-mac-text-darkPrimary'
                : 'text-mac-text-secondary hover:text-mac-text-primary dark:hover:text-mac-text-darkPrimary'
            }`}
          >
            <ListTree size={13} />
            <span>文档大纲</span>
          </button>
        </div>

        <button
          onClick={onClose}
          title="关闭侧边栏"
          className="p-1 rounded-md text-mac-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* Content View */}
      <div className="flex-1 overflow-y-auto p-2">
        {activeTab === 'files' ? (
          /* Files Management Tab */
          <div className="space-y-1">
            <div className="flex items-center justify-between px-2 py-1 text-[11px] font-semibold text-mac-text-secondary uppercase tracking-wider">
              <span>工作区文档 ({files.length})</span>
              <button
                onClick={onCreateFile}
                title="新建 Markdown 文档"
                className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 text-mac-text-primary dark:text-mac-text-darkPrimary transition-colors flex items-center gap-1 text-[11px] normal-case"
              >
                <Plus size={13} />
                <span>新建</span>
              </button>
            </div>

            <div className="space-y-0.5">
              {files.map((file) => {
                const isActive = file.id === activeFileId;
                return (
                  <div
                    key={file.id}
                    onClick={() => onSelectFile(file)}
                    className={`group px-2.5 py-1.5 rounded-lg flex items-center justify-between cursor-pointer text-xs transition-colors ${
                      isActive
                        ? 'bg-[#0071E3] text-white font-medium shadow-sm'
                        : 'text-mac-text-primary dark:text-mac-text-darkPrimary hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText
                        size={14}
                        className={isActive ? 'text-white' : 'text-mac-text-secondary'}
                      />
                      <span className="truncate">{file.name}</span>
                    </div>

                    {files.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`确定删除文档 "${file.name}" 吗？`)) {
                            onDeleteFile(file.id);
                          }
                        }}
                        title="删除文档"
                        className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 transition-opacity ${
                          isActive ? 'text-white' : 'text-red-500'
                        }`}
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Outline / TOC Tab */
          <div className="space-y-1">
            <div className="px-2 py-1 text-[11px] font-semibold text-mac-text-secondary uppercase tracking-wider">
              <span>章节大纲 ({headings.length})</span>
            </div>

            {headings.length === 0 ? (
              <div className="text-center py-8 text-xs text-mac-text-secondary">
                文档中暂无标题（使用 # 标题 创建）
              </div>
            ) : (
              <div className="space-y-0.5">
                {headings.map((item) => {
                  const indent = (item.level - 1) * 12;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onHeadingClick(item.text)}
                      style={{ paddingLeft: `${indent + 8}px` }}
                      className="w-full text-left py-1 pr-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-1.5 text-xs text-mac-text-primary dark:text-mac-text-darkPrimary transition-colors group truncate"
                    >
                      <span className="text-[10px] font-mono font-medium text-mac-text-secondary opacity-70 group-hover:text-[#0071E3] group-hover:opacity-100">
                        H{item.level}
                      </span>
                      <span className="truncate group-hover:text-[#0071E3] dark:group-hover:text-[#388BFD]">
                        {item.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
