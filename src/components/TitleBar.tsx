import React, { useState } from 'react';
import { TrafficLights } from './TrafficLights';
import {
  Sidebar as SidebarIcon,
  Code,
  Eye,
  Crosshair,
  AlignVerticalJustifyCenter,
  ListTree,
  Sun,
  Moon,
  Share,
  Download,
  FileText
} from 'lucide-react';
import { toggleMaximizeWindow } from '../utils/platform';

interface TitleBarProps {
  fileName: string;
  isModified: boolean;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  isSourceMode: boolean;
  onToggleSourceMode: () => void;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
  isTypewriterMode: boolean;
  onToggleTypewriterMode: () => void;
  outlineOpen: boolean;
  onToggleOutline: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onExportHtml: () => void;
  onExportPdf: () => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  fileName,
  isModified,
  sidebarOpen,
  onToggleSidebar,
  isSourceMode,
  onToggleSourceMode,
  isFocusMode,
  onToggleFocusMode,
  isTypewriterMode,
  onToggleTypewriterMode,
  outlineOpen,
  onToggleOutline,
  isDarkMode,
  onToggleDarkMode,
  onExportHtml,
  onExportPdf,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <header
      className="h-[42px] select-none flex items-center justify-between px-3 mac-glass border-b z-30 relative transition-colors duration-200"
      data-tauri-drag-region
      onDoubleClick={toggleMaximizeWindow}
    >
      {/* Left section: Traffic Lights & Sidebar Toggle */}
      <div className="flex items-center gap-2" data-tauri-drag-region="false">
        <TrafficLights />

        <button
          onClick={onToggleSidebar}
          title={sidebarOpen ? '收起侧边栏 (Ctrl+Shift+L)' : '展开侧边栏 (Ctrl+Shift+L)'}
          className={`p-1.5 rounded-md transition-colors active:scale-95 text-xs flex items-center justify-center ${
            sidebarOpen
              ? 'bg-black/5 dark:bg-white/10 text-mac-text-primary dark:text-mac-text-darkPrimary'
              : 'text-mac-text-secondary hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <SidebarIcon size={14} />
        </button>
      </div>

      {/* Center: File Title with Unsaved Indicator */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 cursor-default pointer-events-none"
        data-tauri-drag-region
      >
        <FileText size={13} className="text-mac-text-secondary opacity-80" />
        <span className="text-[13px] font-medium tracking-tight text-mac-text-primary dark:text-mac-text-darkPrimary">
          {fileName}
        </span>
        {isModified && (
          <span
            className="w-2 h-2 rounded-full bg-[#0071E3] dark:bg-[#388BFD] inline-block animate-pulse"
            title="已修改未保存"
          />
        )}
      </div>

      {/* Right: Capsule Action Island */}
      <div className="flex items-center gap-1" data-tauri-drag-region="false">
        {/* Source Mode Toggle */}
        <button
          onClick={onToggleSourceMode}
          title={isSourceMode ? '切换为所见即所得 (Ctrl+/)' : '切换为源码模式 (Ctrl+/)'}
          className={`p-1.5 rounded-md transition-all active:scale-95 text-xs flex items-center gap-1 ${
            isSourceMode
              ? 'bg-[#0071E3] text-white shadow-sm'
              : 'text-mac-text-secondary hover:bg-black/5 dark:hover:bg-white/5 hover:text-mac-text-primary dark:hover:text-mac-text-darkPrimary'
          }`}
        >
          {isSourceMode ? <Eye size={14} /> : <Code size={14} />}
          <span className="text-[11px] font-medium hidden sm:inline">
            {isSourceMode ? '所见即所得' : '源码'}
          </span>
        </button>

        <div className="w-[1px] h-3.5 bg-black/10 dark:bg-white/10 mx-0.5" />

        {/* Focus Mode Toggle */}
        <button
          onClick={onToggleFocusMode}
          title={isFocusMode ? '退出专注模式 (F8)' : '开启专注模式 (F8)'}
          className={`p-1.5 rounded-md transition-colors active:scale-95 ${
            isFocusMode
              ? 'bg-black/10 dark:bg-white/15 text-[#0071E3] dark:text-[#388BFD]'
              : 'text-mac-text-secondary hover:bg-black/5 dark:hover:bg-white/5 hover:text-mac-text-primary dark:hover:text-mac-text-darkPrimary'
          }`}
        >
          <Crosshair size={14} />
        </button>

        {/* Typewriter Mode Toggle */}
        <button
          onClick={onToggleTypewriterMode}
          title={isTypewriterMode ? '退出打字机模式 (F9)' : '开启打字机模式 (F9)'}
          className={`p-1.5 rounded-md transition-colors active:scale-95 ${
            isTypewriterMode
              ? 'bg-black/10 dark:bg-white/15 text-[#0071E3] dark:text-[#388BFD]'
              : 'text-mac-text-secondary hover:bg-black/5 dark:hover:bg-white/5 hover:text-mac-text-primary dark:hover:text-mac-text-darkPrimary'
          }`}
        >
          <AlignVerticalJustifyCenter size={14} />
        </button>

        {/* Outline Toggle */}
        <button
          onClick={onToggleOutline}
          title={outlineOpen ? '关闭大纲' : '查看文档大纲'}
          className={`p-1.5 rounded-md transition-colors active:scale-95 ${
            outlineOpen
              ? 'bg-black/10 dark:bg-white/15 text-[#0071E3] dark:text-[#388BFD]'
              : 'text-mac-text-secondary hover:bg-black/5 dark:hover:bg-white/5 hover:text-mac-text-primary dark:hover:text-mac-text-darkPrimary'
          }`}
        >
          <ListTree size={14} />
        </button>

        <div className="w-[1px] h-3.5 bg-black/10 dark:bg-white/10 mx-0.5" />

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          title={isDarkMode ? '切换为浅色模式' : '切换为深色模式'}
          className="p-1.5 rounded-md text-mac-text-secondary hover:bg-black/5 dark:hover:bg-white/5 hover:text-mac-text-primary dark:hover:text-mac-text-darkPrimary transition-colors active:scale-95"
        >
          {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {/* Export Menu */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            title="导出与分享"
            className="p-1.5 rounded-md text-mac-text-secondary hover:bg-black/5 dark:hover:bg-white/5 hover:text-mac-text-primary dark:hover:text-mac-text-darkPrimary transition-colors active:scale-95"
          >
            <Share size={14} />
          </button>

          {showExportMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowExportMenu(false)}
              />
              <div className="absolute right-0 mt-1.5 w-36 rounded-lg mac-glass bg-white/95 dark:bg-[#252525]/95 shadow-lg border border-black/10 dark:border-white/10 py-1 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => {
                    onExportHtml();
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#0071E3] hover:text-white flex items-center gap-2 text-mac-text-primary dark:text-mac-text-darkPrimary transition-colors"
                >
                  <Download size={13} />
                  <span>导出为 HTML</span>
                </button>
                <button
                  onClick={() => {
                    onExportPdf();
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#0071E3] hover:text-white flex items-center gap-2 text-mac-text-primary dark:text-mac-text-darkPrimary transition-colors"
                >
                  <FileText size={13} />
                  <span>打印 / PDF 导出</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
