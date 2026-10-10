import React, { useState, useEffect } from 'react';
import { TitleBar } from './components/TitleBar';
import { StatusBar } from './components/StatusBar';
import { Editor } from './components/Editor';
import { defaultMarkdown } from './data/defaultDoc';

export default function App() {
  const [fileName, setFileName] = useState('欢迎使用 Inkora.md');
  const [isModified, setIsModified] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isTypewriterMode, setIsTypewriterMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [metrics, setMetrics] = useState({
    wordCount: 0,
    charCount: 0,
    line: 1,
    column: 1,
  });

  // Calculate initial metrics
  useEffect(() => {
    const charCount = defaultMarkdown.length;
    const wordCount = (defaultMarkdown.match(/[\w\u4e00-\u9fa5]+/g) || []).length;
    setMetrics({
      charCount,
      wordCount,
      line: 1,
      column: 1,
    });
  }, []);

  // Sync dark mode class on document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Global application shortcuts (Typora muscular memory)
  useEffect(() => {
    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      // Ctrl+/ or Cmd+/: Toggle Source Mode
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setIsSourceMode((prev) => !prev);
        return;
      }

      // F8: Focus Mode
      if (e.key === 'F8') {
        e.preventDefault();
        setIsFocusMode((prev) => !prev);
        return;
      }

      // F9: Typewriter Mode
      if (e.key === 'F9') {
        e.preventDefault();
        setIsTypewriterMode((prev) => !prev);
        return;
      }

      // Ctrl+Shift+L: Toggle Sidebar
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        setSidebarOpen((prev) => !prev);
        return;
      }

      // Ctrl+S: Save Document
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's' && !e.shiftKey) {
        e.preventDefault();
        setIsModified(false);
        // Save logic to file or localStorage
        localStorage.setItem('inkora_saved_doc', markdown);
      }
    };

    window.addEventListener('keydown', handleGlobalShortcuts);
    return () => window.removeEventListener('keydown', handleGlobalShortcuts);
  }, [markdown]);

  const handleContentChange = (newMd: string) => {
    setMarkdown(newMd);
    setIsModified(true);
  };

  const handleExportHtml = () => {
    const blob = new Blob([
      `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${fileName}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css" />
<style>
body { font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "PingFang SC", sans-serif; max-width: 860px; margin: 40px auto; padding: 0 20px; line-height: 1.7; color: #24292f; }
h1,h2,h3 { font-weight: 600; }
pre { background: #f6f8fa; padding: 16px; border-radius: 6px; overflow: auto; }
code { font-family: SF Mono, Consolas, monospace; }
table { width: 100%; border-collapse: collapse; margin: 20px 0; }
th, td { border: 1px solid #d0d7de; padding: 8px 12px; }
th { background: #f6f8fa; }
blockquote { border-left: 4px solid #0071E3; margin: 0; padding-left: 16px; color: #57606a; }
</style>
</head>
<body>
${document.querySelector('.typora-editor')?.innerHTML || markdown}
</body>
</html>`
    ], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace(/\.md$/, '.html');
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPdf = () => {
    window.print();
  };

  return (
    <div
      className={`h-screen w-screen flex flex-col overflow-hidden bg-mac-bg-light dark:bg-mac-bg-dark transition-colors duration-200 select-none ${
        isFocusMode ? 'focus-mode' : ''
      }`}
    >
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

      {/* Main Body Area */}
      <main className="flex-1 flex overflow-hidden relative">
        <Editor
          markdown={markdown}
          onChange={handleContentChange}
          isSourceMode={isSourceMode}
          isFocusMode={isFocusMode}
          isTypewriterMode={isTypewriterMode}
          onMetricsChange={setMetrics}
        />
      </main>

      {/* Status Bar */}
      <StatusBar
        wordCount={metrics.wordCount}
        charCount={metrics.charCount}
        line={metrics.line}
        column={metrics.column}
        isSourceMode={isSourceMode}
        isFocusMode={isFocusMode}
        isTypewriterMode={isTypewriterMode}
      />
    </div>
  );
}
