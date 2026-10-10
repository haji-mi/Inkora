import React, { useState, useEffect } from 'react';
import { TitleBar } from './components/TitleBar';
import { StatusBar } from './components/StatusBar';

export default function App() {
  const [fileName, setFileName] = useState('欢迎使用 Inkora.md');
  const [isModified, setIsModified] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isTypewriterMode, setIsTypewriterMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sync dark mode class on document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleExportHtml = () => {
    alert('导出 HTML 即将就绪');
  };

  const handleExportPdf = () => {
    window.print();
  };

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden bg-mac-bg-light dark:bg-mac-bg-dark transition-colors duration-200 select-none ${isFocusMode ? 'focus-mode' : ''}`}>
      {/* macOS TitleBar */}
      <TitleBar
        fileName={fileName}
        isModified={isModified}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        isSourceMode={isSourceMode}
        onToggleSourceMode={() => setIsSourceMode(!isSourceMode)}
        isFocusMode={isFocusMode}
        onToggleFocusMode={() => setIsFocusMode(!isFocusMode)}
        isTypewriterMode={isTypewriterMode}
        onToggleTypewriterMode={() => setIsTypewriterMode(!isTypewriterMode)}
        outlineOpen={outlineOpen}
        onToggleOutline={() => setOutlineOpen(!outlineOpen)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onExportHtml={handleExportHtml}
        onExportPdf={handleExportPdf}
      />

      {/* Main Body Area (placeholder for Editor & Sidebar) */}
      <main className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 flex items-center justify-center text-sm text-mac-text-secondary">
          Step 2: macOS Chrome & Visual Material Ready
        </div>
      </main>

      {/* Status Bar */}
      <StatusBar
        wordCount={0}
        charCount={0}
        line={1}
        column={1}
        isSourceMode={isSourceMode}
        isFocusMode={isFocusMode}
        isTypewriterMode={isTypewriterMode}
      />
    </div>
  );
}
