import React, { useState, useRef, useEffect } from 'react';
import { WindowsWindowControls } from './WindowsWindowControls';
import {
  Code,
  Crosshair,
  AlignVerticalJustifyCenter,
  ListTree,
  FileText,
  Sidebar as SidebarIcon,
  Check,
  Undo2,
  Redo2,
} from 'lucide-react';
import { toggleMaximizeWindow } from '../utils/platform';

export type AppTheme = 'github' | 'night' | 'newsprint' | 'gothic';
export type AppIconStyle = 'c' | 'a' | 'b';

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
  currentTheme: AppTheme;
  onSelectTheme: (theme: AppTheme) => void;
  appIconStyle?: AppIconStyle;
  onSelectIconStyle?: (style: AppIconStyle) => void;
  onNewFile: () => void;
  onSaveFile: () => void;
  onExportHtml: () => void;
  onExportPdf: () => void;
  onInsertHeading: (level: 1 | 2 | 3 | 4 | 5 | 6) => void;
  onInsertTable: () => void;
  onInsertCodeBlock: () => void;
  onInsertMath: () => void;
  onInsertMermaid: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  onOpenFind?: () => void;
  onOpenReplace?: () => void;
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
  currentTheme,
  onSelectTheme,
  appIconStyle = 'c',
  onSelectIconStyle,
  onNewFile,
  onSaveFile,
  onExportHtml,
  onExportPdf,
  onInsertHeading,
  onInsertTable,
  onInsertCodeBlock,
  onInsertMath,
  onInsertMermaid,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  onOpenFind,
  onOpenReplace,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleMenuHover = (menu: string) => {
    if (activeMenu !== null) {
      setActiveMenu(menu);
    }
  };

  return (
    <header
      className="h-[36px] select-none flex items-center justify-between border-b border-black/10 dark:border-white/10 bg-[#FAFAFA] dark:bg-[#1F1F1F] text-mac-text-primary dark:text-mac-text-darkPrimary z-30 relative transition-colors duration-200"
      data-tauri-drag-region
      onDoubleClick={toggleMaximizeWindow}
    >
      {/* Left: App Logo + Typora Windows Classic Menu Bar */}
      <div className="flex items-center h-full" ref={menuContainerRef} data-tauri-drag-region="false">
        {/* Inkora Logo with dynamic icon style */}
        <div
          onClick={() => {
            const nextMap: Record<AppIconStyle, AppIconStyle> = { c: 'a', a: 'b', b: 'c' };
            onSelectIconStyle?.(nextMap[appIconStyle]);
          }}
          title={`当前图标：${appIconStyle === 'c' ? '象牙纸水墨 (默认)' : appIconStyle === 'a' ? '经典红陶 (Typora款)' : '黑曜石暗夜'} (点击快速切换)`}
          className="flex items-center gap-1.5 px-2.5 h-full cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-colors border-r border-black/5 dark:border-white/5 select-none"
        >
          <img
            src={`/icons/icon-${appIconStyle}.png`}
            alt="Inkora Logo"
            className="w-4 h-4 rounded-[3px] shadow-xs object-cover"
          />
          <span className="text-[12px] font-semibold tracking-tight">Inkora</span>
        </div>

        {/* Sidebar Toggle Button */}
        <button
          onClick={onToggleSidebar}
          title={sidebarOpen ? '收起侧边栏 (Ctrl+Shift+L)' : '展开侧边栏 (Ctrl+Shift+L)'}
          className={`h-full px-2 flex items-center justify-center transition-colors hover:bg-black/5 dark:hover:bg-white/10 ${
            sidebarOpen ? 'text-[#0071E3] dark:text-[#388BFD]' : 'text-mac-text-secondary'
          }`}
        >
          <SidebarIcon size={14} />
        </button>

        {/* Undo Quick Button */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="撤销 (Ctrl+Z)"
          className={`h-full px-1.5 flex items-center justify-center transition-colors ${
            canUndo
              ? 'text-mac-text-primary dark:text-mac-text-darkPrimary hover:bg-black/5 dark:hover:bg-white/10 active:scale-95'
              : 'text-mac-text-secondary opacity-30 cursor-not-allowed'
          }`}
        >
          <Undo2 size={13} />
        </button>

        {/* Redo Quick Button */}
        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="恢复 / 重做 (Ctrl+Y)"
          className={`h-full px-1.5 flex items-center justify-center transition-colors ${
            canRedo
              ? 'text-mac-text-primary dark:text-mac-text-darkPrimary hover:bg-black/5 dark:hover:bg-white/10 active:scale-95'
              : 'text-mac-text-secondary opacity-30 cursor-not-allowed'
          }`}
        >
          <Redo2 size={13} />
        </button>

        <div className="w-[1px] h-3.5 bg-black/10 dark:bg-white/10 mx-1" />

        {/* Menus: 文件, 编辑, 段落, 格式, 视图, 主题 */}
        <div className="flex items-center h-full text-[12px]">
          {/* 文件 (F) */}
          <div className="relative h-full">
            <button
              onClick={() => handleMenuClick('file')}
              onMouseEnter={() => handleMenuHover('file')}
              className={`h-full px-2.5 flex items-center transition-colors ${
                activeMenu === 'file'
                  ? 'bg-black/10 dark:bg-white/15'
                  : 'hover:bg-black/5 dark:hover:bg-white/10'
              }`}
            >
              文件(F)
            </button>
            {activeMenu === 'file' && (
              <div className="absolute top-full left-0 w-48 bg-white dark:bg-[#2B2B2B] shadow-lg border border-black/10 dark:border-white/10 py-1 rounded-sm text-xs z-50 animate-in fade-in-50 duration-75">
                <button
                  onClick={() => { onNewFile(); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 hover:bg-[#0071E3] hover:text-white flex items-center justify-between text-left"
                >
                  <span>新建</span>
                  <span className="text-[10px] opacity-60">Ctrl+N</span>
                </button>
                <button
                  onClick={() => { onSaveFile(); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 hover:bg-[#0071E3] hover:text-white flex items-center justify-between text-left"
                >
                  <span>保存</span>
                  <span className="text-[10px] opacity-60">Ctrl+S</span>
                </button>
                <div className="my-1 border-t border-black/10 dark:border-white/10" />
                <button
                  onClick={() => { onExportHtml(); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 hover:bg-[#0071E3] hover:text-white flex items-center justify-between text-left"
                >
                  <span>导出为 HTML...</span>
                </button>
                <button
                  onClick={() => { onExportPdf(); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 hover:bg-[#0071E3] hover:text-white flex items-center justify-between text-left"
                >
                  <span>打印 / PDF 导出...</span>
                  <span className="text-[10px] opacity-60">Ctrl+P</span>
                </button>
              </div>
            )}
          </div>

          {/* 编辑 (E) */}
          <div className="relative h-full">
            <button
              onClick={() => handleMenuClick('edit')}
              onMouseEnter={() => handleMenuHover('edit')}
              className={`h-full px-2.5 flex items-center transition-colors ${
                activeMenu === 'edit'
                  ? 'bg-black/10 dark:bg-white/15'
                  : 'hover:bg-black/5 dark:hover:bg-white/10'
              }`}
            >
              编辑(E)
            </button>
            {activeMenu === 'edit' && (
              <div className="absolute top-full left-0 w-48 bg-white dark:bg-[#2B2B2B] shadow-lg border border-black/10 dark:border-white/10 py-1 rounded-sm text-xs z-50">
                <button
                  onClick={() => { onUndo?.(); setActiveMenu(null); }}
                  disabled={!canUndo}
                  className={`w-full px-3 py-1.5 flex items-center justify-between text-left ${
                    canUndo ? 'hover:bg-[#0071E3] hover:text-white' : 'opacity-40 cursor-not-allowed'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Undo2 size={12} />
                    <span>撤销</span>
                  </span>
                  <span className="text-[10px] opacity-60">Ctrl+Z</span>
                </button>
                <button
                  onClick={() => { onRedo?.(); setActiveMenu(null); }}
                  disabled={!canRedo}
                  className={`w-full px-3 py-1.5 flex items-center justify-between text-left ${
                    canRedo ? 'hover:bg-[#0071E3] hover:text-white' : 'opacity-40 cursor-not-allowed'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Redo2 size={12} />
                    <span>重做 / 恢复</span>
                  </span>
                  <span className="text-[10px] opacity-60">Ctrl+Y</span>
                </button>
                <div className="my-1 border-t border-black/10 dark:border-white/10" />
                <button
                  onClick={() => { onOpenFind?.(); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 hover:bg-[#0071E3] hover:text-white flex items-center justify-between text-left"
                >
                  <span>查找...</span>
                  <span className="text-[10px] opacity-60">Ctrl+F</span>
                </button>
                <button
                  onClick={() => { onOpenReplace?.(); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 hover:bg-[#0071E3] hover:text-white flex items-center justify-between text-left"
                >
                  <span>替换...</span>
                  <span className="text-[10px] opacity-60">Ctrl+H</span>
                </button>
              </div>
            )}
          </div>

          {/* 段落 (P) */}
          <div className="relative h-full">
            <button
              onClick={() => handleMenuClick('paragraph')}
              onMouseEnter={() => handleMenuHover('paragraph')}
              className={`h-full px-2.5 flex items-center transition-colors ${
                activeMenu === 'paragraph'
                  ? 'bg-black/10 dark:bg-white/15'
                  : 'hover:bg-black/5 dark:hover:bg-white/10'
              }`}
            >
              段落(P)
            </button>
            {activeMenu === 'paragraph' && (
              <div className="absolute top-full left-0 w-48 bg-white dark:bg-[#2B2B2B] shadow-lg border border-black/10 dark:border-white/10 py-1 rounded-sm text-xs z-50">
                <button
                  onClick={() => { onInsertHeading(1); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 hover:bg-[#0071E3] hover:text-white flex items-center justify-between text-left"
                >
                  <span>一级标题</span>
                  <span className="text-[10px] opacity-60">Ctrl+1</span>
                </button>
                <button
                  onClick={() => { onInsertHeading(2); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 hover:bg-[#0071E3] hover:text-white flex items-center justify-between text-left"
                >
                  <span>二级标题</span>
                  <span className="text-[10px] opacity-60">Ctrl+2</span>
                </button>
                <button
                  onClick={() => { onInsertHeading(3); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 hover:bg-[#0071E3] hover:text-white flex items-center justify-between text-left"
                >
                  <span>三级标题</span>
                  <span className="text-[10px] opacity-60">Ctrl+3</span>
                </button>
                <div className="my-1 border-t border-black/10 dark:border-white/10" />
                <button
                  onClick={() => { onInsertTable(); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 hover:bg-[#0071E3] hover:text-white flex items-center justify-between text-left"
                >
                  <span>插入表格</span>
                  <span className="text-[10px] opacity-60">Ctrl+T</span>
                </button>
                <button
                  onClick={() => { onInsertCodeBlock(); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 hover:bg-[#0071E3] hover:text-white flex items-center justify-between text-left"
                >
                  <span>代码块</span>
                  <span className="text-[10px] opacity-60">Ctrl+Shift+K</span>
                </button>
                <button
                  onClick={() => { onInsertMath(); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 hover:bg-[#0071E3] hover:text-white flex items-center justify-between text-left"
                >
                  <span>数学公式</span>
                  <span className="text-[10px] opacity-60">Ctrl+Shift+M</span>
                </button>
                <button
                  onClick={() => { onInsertMermaid(); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 hover:bg-[#0071E3] hover:text-white flex items-center justify-between text-left"
                >
                  <span>Mermaid 图表</span>
                </button>
              </div>
            )}
          </div>

          {/* 视图 (V) */}
          <div className="relative h-full">
            <button
              onClick={() => handleMenuClick('view')}
              onMouseEnter={() => handleMenuHover('view')}
              className={`h-full px-2.5 flex items-center transition-colors ${
                activeMenu === 'view'
                  ? 'bg-black/10 dark:bg-white/15'
                  : 'hover:bg-black/5 dark:hover:bg-white/10'
              }`}
            >
              视图(V)
            </button>
            {activeMenu === 'view' && (
              <div className="absolute top-full left-0 w-48 bg-white dark:bg-[#2B2B2B] shadow-lg border border-black/10 dark:border-white/10 py-1 rounded-sm text-xs z-50">
                <button
                  onClick={() => { onToggleSourceMode(); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 hover:bg-[#0071E3] hover:text-white flex items-center justify-between text-left"
                >
                  <span className="flex items-center gap-1.5">
                    {isSourceMode && <Check size={12} />}
                    <span>源码模式</span>
                  </span>
                  <span className="text-[10px] opacity-60">Ctrl+/</span>
                </button>
                <button
                  onClick={() => { onToggleFocusMode(); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 hover:bg-[#0071E3] hover:text-white flex items-center justify-between text-left"
                >
                  <span className="flex items-center gap-1.5">
                    {isFocusMode && <Check size={12} />}
                    <span>专注模式</span>
                  </span>
                  <span className="text-[10px] opacity-60">F8</span>
                </button>
                <button
                  onClick={() => { onToggleTypewriterMode(); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 hover:bg-[#0071E3] hover:text-white flex items-center justify-between text-left"
                >
                  <span className="flex items-center gap-1.5">
                    {isTypewriterMode && <Check size={12} />}
                    <span>打字机模式</span>
                  </span>
                  <span className="text-[10px] opacity-60">F9</span>
                </button>
                <div className="my-1 border-t border-black/10 dark:border-white/10" />
                <button
                  onClick={() => { onToggleSidebar(); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 hover:bg-[#0071E3] hover:text-white flex items-center justify-between text-left"
                >
                  <span>侧边栏</span>
                  <span className="text-[10px] opacity-60">Ctrl+Shift+L</span>
                </button>
                <button
                  onClick={() => { onToggleOutline(); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 hover:bg-[#0071E3] hover:text-white flex items-center justify-between text-left"
                >
                  <span>文档大纲</span>
                </button>
              </div>
            )}
          </div>

          {/* 主题 (T) */}
          <div className="relative h-full">
            <button
              onClick={() => handleMenuClick('theme')}
              onMouseEnter={() => handleMenuHover('theme')}
              className={`h-full px-2.5 flex items-center transition-colors ${
                activeMenu === 'theme'
                  ? 'bg-black/10 dark:bg-white/15'
                  : 'hover:bg-black/5 dark:hover:bg-white/10'
              }`}
            >
              主题(T)
            </button>
            {activeMenu === 'theme' && (
              <div className="absolute top-full left-0 w-44 bg-white dark:bg-[#2B2B2B] shadow-lg border border-black/10 dark:border-white/10 py-1 rounded-sm text-xs z-50">
                <button
                  onClick={() => { onSelectTheme('github'); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 hover:bg-[#0071E3] hover:text-white flex items-center justify-between text-left"
                >
                  <span>GitHub 浅色 (默认)</span>
                  {currentTheme === 'github' && <Check size={12} />}
                </button>
                <button
                  onClick={() => { onSelectTheme('night'); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 hover:bg-[#0071E3] hover:text-white flex items-center justify-between text-left"
                >
                  <span>Night 暗黑夜间</span>
                  {currentTheme === 'night' && <Check size={12} />}
                </button>
                <button
                  onClick={() => { onSelectTheme('newsprint'); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 hover:bg-[#0071E3] hover:text-white flex items-center justify-between text-left"
                >
                  <span>Newsprint 报刊复古</span>
                  {currentTheme === 'newsprint' && <Check size={12} />}
                </button>
                <button
                  onClick={() => { onSelectTheme('gothic'); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 hover:bg-[#0071E3] hover:text-white flex items-center justify-between text-left"
                >
                  <span>Gothic 哥特优雅</span>
                  {currentTheme === 'gothic' && <Check size={12} />}
                </button>
                <div className="my-1 border-t border-black/10 dark:border-white/10" />
                <div className="px-3 py-1 text-[10px] text-mac-text-secondary uppercase tracking-wider font-semibold">
                  应用图标外观
                </div>
                <button
                  onClick={() => { onSelectIconStyle?.('c'); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 hover:bg-[#0071E3] hover:text-white flex items-center justify-between text-left"
                >
                  <span className="flex items-center gap-2">
                    <img src="/icons/icon-c.png" alt="C" className="w-3.5 h-3.5 rounded-[2px]" />
                    <span>象牙纸水墨 (默认)</span>
                  </span>
                  {appIconStyle === 'c' && <Check size={12} />}
                </button>
                <button
                  onClick={() => { onSelectIconStyle?.('a'); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 hover:bg-[#0071E3] hover:text-white flex items-center justify-between text-left"
                >
                  <span className="flex items-center gap-2">
                    <img src="/icons/icon-a.png" alt="A" className="w-3.5 h-3.5 rounded-[2px]" />
                    <span>经典红陶 (Typora款)</span>
                  </span>
                  {appIconStyle === 'a' && <Check size={12} />}
                </button>
                <button
                  onClick={() => { onSelectIconStyle?.('b'); setActiveMenu(null); }}
                  className="w-full px-3 py-1.5 hover:bg-[#0071E3] hover:text-white flex items-center justify-between text-left"
                >
                  <span className="flex items-center gap-2">
                    <img src="/icons/icon-b.png" alt="B" className="w-3.5 h-3.5 rounded-[2px]" />
                    <span>黑曜石暗夜</span>
                  </span>
                  {appIconStyle === 'b' && <Check size={12} />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center: File Title with Modified Pulse */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 cursor-default pointer-events-none"
        data-tauri-drag-region
      >
        <span className="text-[12px] font-medium text-mac-text-primary dark:text-mac-text-darkPrimary">
          {fileName} - Inkora
        </span>
        {isModified && (
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#0071E3] dark:bg-[#388BFD] inline-block animate-pulse"
            title="已修改未保存"
          />
        )}
      </div>

      {/* Right: Quick Action Buttons + Windows Window Controls */}
      <div className="flex items-center h-full" data-tauri-drag-region="false">
        {/* Source Mode Quick Toggle */}
        <button
          onClick={onToggleSourceMode}
          title={isSourceMode ? '切换为所见即所得 (Ctrl+/)' : '切换为源码模式 (Ctrl+/)'}
          className={`h-full px-2.5 flex items-center gap-1 text-[11px] font-medium transition-colors ${
            isSourceMode
              ? 'bg-[#0071E3] text-white'
              : 'text-mac-text-secondary hover:bg-black/5 dark:hover:bg-white/10'
          }`}
        >
          <Code size={13} />
          <span>{isSourceMode ? '所见即所得' : '源码'}</span>
        </button>

        {/* Focus Mode Quick Toggle */}
        <button
          onClick={onToggleFocusMode}
          title={isFocusMode ? '退出专注模式 (F8)' : '开启专注模式 (F8)'}
          className={`h-full px-2 flex items-center justify-center transition-colors ${
            isFocusMode
              ? 'text-[#0071E3] dark:text-[#388BFD] bg-black/5 dark:bg-white/10'
              : 'text-mac-text-secondary hover:bg-black/5 dark:hover:bg-white/10'
          }`}
        >
          <Crosshair size={13} />
        </button>

        {/* Typewriter Mode Quick Toggle */}
        <button
          onClick={onToggleTypewriterMode}
          title={isTypewriterMode ? '退出打字机模式 (F9)' : '开启打字机模式 (F9)'}
          className={`h-full px-2 flex items-center justify-center transition-colors ${
            isTypewriterMode
              ? 'text-[#0071E3] dark:text-[#388BFD] bg-black/5 dark:bg-white/10'
              : 'text-mac-text-secondary hover:bg-black/5 dark:hover:bg-white/10'
          }`}
        >
          <AlignVerticalJustifyCenter size={13} />
        </button>

        {/* Outline Quick Toggle */}
        <button
          onClick={onToggleOutline}
          title={outlineOpen ? '关闭大纲' : '查看文档大纲'}
          className={`h-full px-2 flex items-center justify-center transition-colors ${
            outlineOpen
              ? 'text-[#0071E3] dark:text-[#388BFD] bg-black/5 dark:bg-white/10'
              : 'text-mac-text-secondary hover:bg-black/5 dark:hover:bg-white/10'
          }`}
        >
          <ListTree size={13} />
        </button>

        <div className="w-[1px] h-3.5 bg-black/10 dark:bg-white/10 mx-1" />

        {/* Windows Native Window Controls (Minimize, Maximize, Close) */}
        <WindowsWindowControls />
      </div>
    </header>
  );
};
