import React, { useState, useEffect, useMemo, useRef } from 'react';
import { TitleBar, AppTheme } from './components/TitleBar';
import { StatusBar } from './components/StatusBar';
import { Sidebar } from './components/Sidebar';
import { Editor, EditorRef } from './components/Editor';
import { QuickOpenModal } from './components/QuickOpenModal';
import { WorkspaceFile } from './types/file';
import { defaultMarkdown } from './data/defaultDoc';
import { extractHeadings } from './utils/outline';

export default function App() {
  const editorRef = useRef<EditorRef>(null);

  // Initial workspace files
  const [files, setFiles] = useState<WorkspaceFile[]>([
    {
      id: 'welcome',
      name: '欢迎使用 Inkora.md',
      content: defaultMarkdown,
      updatedAt: Date.now(),
    },
    {
      id: 'notes',
      name: '快捷笔记.md',
      content: '# 快捷随笔\n\n- 在这里随时记录你的奇思妙想...\n- 支持 **粗体**、`代码` 以及公式。',
      updatedAt: Date.now() - 3600000,
    },
  ]);

  const [activeFileId, setActiveFileId] = useState('welcome');
  const [isModified, setIsModified] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [quickOpenOpen, setQuickOpenOpen] = useState(false);
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isTypewriterMode, setIsTypewriterMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<AppTheme>('github');

  const activeFile = useMemo(() => {
    return files.find((f) => f.id === activeFileId) || files[0];
  }, [files, activeFileId]);

  const [markdown, setMarkdown] = useState(activeFile.content);

  // When activeFileId changes, load file content
  useEffect(() => {
    setMarkdown(activeFile.content);
    setIsModified(false);
  }, [activeFileId]);

  // Real-time extracted headings for outline
  const headings = useMemo(() => {
    return extractHeadings(markdown);
  }, [markdown]);

  const [metrics, setMetrics] = useState({
    wordCount: 0,
    charCount: 0,
    line: 1,
    column: 1,
  });

  // Calculate metrics on markdown change
  useEffect(() => {
    const charCount = markdown.length;
    const wordCount = (markdown.match(/[\w\u4e00-\u9fa5]+/g) || []).length;
    setMetrics((prev) => ({
      ...prev,
      charCount,
      wordCount,
    }));
  }, [markdown]);

  // Sync theme classes on document.body and html
  useEffect(() => {
    document.body.className = `theme-${currentTheme}`;
    if (currentTheme === 'night') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentTheme]);

  // Global application shortcuts (Windows Typora muscular memory)
  useEffect(() => {
    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      // Ctrl+N: New Document
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n' && !e.shiftKey) {
        e.preventDefault();
        handleCreateFile();
        return;
      }

      // Ctrl+P: Quick Open Spotlight / Search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setQuickOpenOpen((prev) => !prev);
        return;
      }

      // Ctrl+/ : Toggle Source Mode
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
        saveCurrentFile();
      }
    };

    window.addEventListener('keydown', handleGlobalShortcuts);
    return () => window.removeEventListener('keydown', handleGlobalShortcuts);
  }, [markdown, activeFileId]);

  const saveCurrentFile = () => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === activeFileId ? { ...f, content: markdown, updatedAt: Date.now() } : f
      )
    );
    setIsModified(false);
  };

  const handleContentChange = (newMd: string) => {
    setMarkdown(newMd);
    setIsModified(true);
  };

  const handleSelectFile = (file: WorkspaceFile) => {
    if (isModified) {
      saveCurrentFile();
    }
    setActiveFileId(file.id);
  };

  const handleCreateFile = () => {
    const newId = `file-${Date.now()}`;
    const newFile: WorkspaceFile = {
      id: newId,
      name: `新建文档-${files.length + 1}.md`,
      content: '# 新建文档\n\n开始书写你的内容...',
      updatedAt: Date.now(),
    };
    setFiles((prev) => [newFile, ...prev]);
    setActiveFileId(newId);
  };

  const handleDeleteFile = (id: string) => {
    if (files.length <= 1) return;
    const remaining = files.filter((f) => f.id !== id);
    setFiles(remaining);
    if (activeFileId === id) {
      setActiveFileId(remaining[0].id);
    }
  };

  const handleHeadingClick = (headingText: string) => {
    const editorEl = document.querySelector('.typora-editor');
    if (!editorEl) return;
    const headingElements = editorEl.querySelectorAll('h1, h2, h3, h4, h5, h6');
    for (const el of Array.from(headingElements)) {
      if (el.textContent && el.textContent.includes(headingText)) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('bg-[#0071E3]/10', 'rounded', 'transition-colors');
        setTimeout(() => {
          el.classList.remove('bg-[#0071E3]/10');
        }, 1200);
        break;
      }
    }
  };

  const handleExportHtml = () => {
    const blob = new Blob([
      `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${activeFile.name}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css" />
<style>
body { font-family: "Segoe UI", "Microsoft YaHei", sans-serif; max-width: 860px; margin: 40px auto; padding: 0 20px; line-height: 1.7; color: #24292f; }
h1,h2,h3 { font-weight: 600; }
pre { background: #f6f8fa; padding: 16px; border-radius: 6px; overflow: auto; }
code { font-family: Consolas, monospace; }
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
    a.download = activeFile.name.replace(/\.md$/, '.html');
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPdf = () => {
    window.print();
  };

  return (
    <div
      className={`h-screen w-screen flex flex-col overflow-hidden transition-colors duration-200 select-none ${
        isFocusMode ? 'focus-mode' : ''
      }`}
    >
      {/* Windows Native Typora TitleBar & Menubar */}
      <TitleBar
        fileName={activeFile.name}
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
        onToggleOutline={() => {
          setSidebarOpen(true);
          setOutlineOpen(!outlineOpen);
        }}
        currentTheme={currentTheme}
        onSelectTheme={setCurrentTheme}
        onNewFile={handleCreateFile}
        onSaveFile={saveCurrentFile}
        onExportHtml={handleExportHtml}
        onExportPdf={handleExportPdf}
        onInsertHeading={(lvl) => editorRef.current?.insertHeading(lvl)}
        onInsertTable={() => editorRef.current?.insertTable()}
        onInsertCodeBlock={() => editorRef.current?.insertCodeBlock()}
        onInsertMath={() => editorRef.current?.insertMath()}
      />

      {/* Main Body Area: Sidebar + Editor */}
      <main className="flex-1 flex overflow-hidden relative">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          files={files}
          activeFileId={activeFileId}
          onSelectFile={handleSelectFile}
          onCreateFile={handleCreateFile}
          onDeleteFile={handleDeleteFile}
          headings={headings}
          onHeadingClick={handleHeadingClick}
        />

        <Editor
          ref={editorRef}
          markdown={markdown}
          onChange={handleContentChange}
          isSourceMode={isSourceMode}
          isFocusMode={isFocusMode}
          isTypewriterMode={isTypewriterMode}
          onMetricsChange={setMetrics}
        />
      </main>

      {/* Typora Status Bar */}
      <StatusBar
        wordCount={metrics.wordCount}
        charCount={metrics.charCount}
        line={metrics.line}
        column={metrics.column}
        isSourceMode={isSourceMode}
        isFocusMode={isFocusMode}
        isTypewriterMode={isTypewriterMode}
      />

      {/* Quick Open Spotlight Modal (Ctrl+P) */}
      <QuickOpenModal
        isOpen={quickOpenOpen}
        onClose={() => setQuickOpenOpen(false)}
        files={files}
        onSelectFile={handleSelectFile}
        headings={headings}
        onSelectHeading={handleHeadingClick}
      />
    </div>
  );
}
