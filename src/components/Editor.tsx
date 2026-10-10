import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Typography from '@tiptap/extension-typography';
import { common, createLowlight } from 'lowlight';
import { MathBlock } from '../extensions/MathExtension';
import { MermaidBlock } from '../extensions/MermaidExtension';
import { markdownToHtml, htmlToMarkdown } from '../utils/markdown';
import { TableToolbar } from './TableToolbar';
import { SelectionBubbleMenu } from './SelectionBubbleMenu';
import { FindReplaceBar } from './FindReplaceBar';

const lowlight = createLowlight(common);

export interface EditorRef {
  insertHeading: (level: 1 | 2 | 3 | 4 | 5 | 6) => void;
  insertTable: () => void;
  insertCodeBlock: () => void;
  insertMath: () => void;
  insertMermaid: () => void;
  undo: () => void;
  redo: () => void;
  openFind: (mode?: 'find' | 'replace') => void;
}

interface EditorProps {
  markdown: string;
  onChange: (markdown: string) => void;
  isSourceMode: boolean;
  isFocusMode: boolean;
  isTypewriterMode: boolean;
  onMetricsChange: (metrics: {
    wordCount: number;
    charCount: number;
    line: number;
    column: number;
  }) => void;
  onActiveHeadingChange?: (text: string) => void;
  onHistoryChange?: (canUndo: boolean, canRedo: boolean) => void;
}

export const Editor = forwardRef<EditorRef, EditorProps>(
  (
    {
      markdown,
      onChange,
      isSourceMode,
      isFocusMode,
      isTypewriterMode,
      onMetricsChange,
      onActiveHeadingChange,
      onHistoryChange,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isUpdatingFromSelf = useRef(false);
    const [isFindOpen, setIsFindOpen] = useState(false);
    const [findMode, setFindMode] = useState<'find' | 'replace'>('find');

    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          codeBlock: false,
          heading: {
            levels: [1, 2, 3, 4, 5, 6],
          },
        }),
        CodeBlockLowlight.configure({
          lowlight,
        }),
        Table.configure({
          resizable: true,
        }).extend({
          addKeyboardShortcuts() {
            return {
              Tab: () => {
                if (!this.editor.isActive('table')) return false;
                const success = this.editor.commands.goToNextCell();
                if (!success) {
                  return this.editor
                    .chain()
                    .addRowAfter()
                    .goToNextCell()
                    .run();
                }
                return true;
              },
              'Shift-Tab': () => {
                if (!this.editor.isActive('table')) return false;
                return this.editor.commands.goToPreviousCell();
              },
            };
          },
        }),
        TableRow,
        TableHeader,
        TableCell,
        TaskList,
        TaskItem.configure({
          nested: true,
        }),
        Underline,
        Highlight,
        Image.configure({
          inline: false,
          allowBase64: true,
        }),
        Link.configure({
          openOnClick: false,
        }),
        Typography,
        MathBlock,
        MermaidBlock,
      ],
      content: markdownToHtml(markdown),
      editorProps: {
        attributes: {
          class: 'typora-editor min-h-full focus:outline-none',
        },
        handlePaste: (view, event) => {
          const items = Array.from(event.clipboardData?.items || []);
          for (const item of items) {
            if (item.type.startsWith('image/')) {
              event.preventDefault();
              const file = item.getAsFile();
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  const src = e.target?.result as string;
                  if (src) {
                    const node = view.state.schema.nodes.image.create({
                      src,
                      alt: file.name || 'Pasted Image',
                    });
                    view.dispatch(view.state.tr.replaceSelectionWith(node));
                  }
                };
                reader.readAsDataURL(file);
                return true;
              }
            }
          }
          return false;
        },
        handleDrop: (view, event, _slice, moved) => {
          if (!moved && event.dataTransfer?.files?.length) {
            const file = event.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
              event.preventDefault();
              const reader = new FileReader();
              reader.onload = (e) => {
                const src = e.target?.result as string;
                if (src) {
                  const coords = view.posAtCoords({
                    left: event.clientX,
                    top: event.clientY,
                  });
                  const node = view.state.schema.nodes.image.create({
                    src,
                    alt: file.name,
                  });
                  if (coords) {
                    view.dispatch(view.state.tr.insert(coords.pos, node));
                  } else {
                    view.dispatch(view.state.tr.replaceSelectionWith(node));
                  }
                }
              };
              reader.readAsDataURL(file);
              return true;
            }
          }
          return false;
        },
      },
      onUpdate: ({ editor }) => {
        isUpdatingFromSelf.current = true;
        const html = editor.getHTML();
        const nextMd = htmlToMarkdown(html);
        onChange(nextMd);

        // Calculate metrics
        const text = editor.getText();
        const charCount = text.length;
        const wordCount = (text.match(/[\w\u4e00-\u9fa5]+/g) || []).length;
        const { from } = editor.state.selection;
        const docBefore = editor.state.doc.textBetween(0, from, '\n');
        const lines = docBefore.split('\n');
        const currentLine = lines.length;
        const currentColumn = lines[lines.length - 1].length + 1;

        onMetricsChange({
          wordCount,
          charCount,
          line: currentLine,
          column: currentColumn,
        });

        onHistoryChange?.(editor.can().undo(), editor.can().redo());

        // Typewriter mode auto-centering
        if (isTypewriterMode && containerRef.current) {
          try {
            const coords = editor.view.coordsAtPos(from);
            const container = containerRef.current;
            const targetY = window.innerHeight / 2;
            const diff = coords.top - targetY;
            if (Math.abs(diff) > 20) {
              container.scrollBy({ top: diff, behavior: 'smooth' });
            }
          } catch (e) {
            // ignore coordinate errors
          }
        }
      },
      onSelectionUpdate: ({ editor }) => {
        onHistoryChange?.(editor.can().undo(), editor.can().redo());
      },
    });

    // Expose actions to parent TitleBar via ref
    useImperativeHandle(ref, () => ({
      insertHeading: (level: 1 | 2 | 3 | 4 | 5 | 6) => {
        editor?.chain().focus().toggleHeading({ level }).run();
      },
      insertTable: () => {
        editor
          ?.chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run();
      },
      insertCodeBlock: () => {
        editor?.chain().focus().toggleCodeBlock().run();
      },
      insertMath: () => {
        const formula = prompt(
          '输入 LaTeX 公式：',
          '\\sum_{i=1}^n i = \\frac{n(n+1)}{2}'
        );
        if (formula && editor) {
          editor
            .chain()
            .focus()
            .insertContent({
              type: 'mathBlock',
              attrs: { math: formula },
            })
            .run();
        }
      },
      insertMermaid: () => {
        editor
          ?.chain()
          .focus()
          .insertContent({
            type: 'mermaidBlock',
            attrs: {
              code: 'graph TD\n  A[需求分析] --> B(技术选型)\n  B --> C[代码实现]\n  C --> D[自动化验证]',
            },
          })
          .run();
      },
      undo: () => {
        editor?.chain().focus().undo().run();
      },
      redo: () => {
        editor?.chain().focus().redo().run();
      },
      openFind: (mode = 'find') => {
        setIsFindOpen(true);
        setFindMode(mode);
      },
    }));

    // Keep editor content in sync when markdown changes externally
    useEffect(() => {
      if (!editor) return;
      if (isUpdatingFromSelf.current) {
        isUpdatingFromSelf.current = false;
        return;
      }
      const currentMd = htmlToMarkdown(editor.getHTML());
      if (currentMd !== markdown) {
        editor.commands.setContent(markdownToHtml(markdown));
      }
    }, [markdown, editor]);

    // Handle Typora keyboard shortcuts in WYSIWYG mode
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        // Ctrl+F: Find
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f' && !e.shiftKey) {
          e.preventDefault();
          setIsFindOpen(true);
          setFindMode('find');
          return;
        }

        // Ctrl+H: Replace
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h' && !e.shiftKey) {
          e.preventDefault();
          setIsFindOpen(true);
          setFindMode('replace');
          return;
        }

        if (!editor) return;

        // Heading shortcuts: Ctrl+1 through Ctrl+6
        if (e.ctrlKey || e.metaKey) {
          if (e.key >= '1' && e.key <= '6') {
            e.preventDefault();
            const level = parseInt(e.key, 10) as 1 | 2 | 3 | 4 | 5 | 6;
            editor.chain().focus().toggleHeading({ level }).run();
            return;
          }

          // Ctrl+T: Insert Table
          if (e.key.toLowerCase() === 't' && !e.shiftKey) {
            e.preventDefault();
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run();
            return;
          }

          // Ctrl+Shift+M: Insert Math Block
          if (e.key.toLowerCase() === 'm' && e.shiftKey) {
            e.preventDefault();
            const formula = prompt(
              '输入 LaTeX 公式：',
              '\\sum_{i=1}^n i = \\frac{n(n+1)}{2}'
            );
            if (formula) {
              editor
                .chain()
                .focus()
                .insertContent({
                  type: 'mathBlock',
                  attrs: { math: formula },
                })
                .run();
            }
            return;
          }

          // Ctrl+Shift+K: Code Block
          if (e.key.toLowerCase() === 'k' && e.shiftKey) {
            e.preventDefault();
            editor.chain().focus().toggleCodeBlock().run();
            return;
          }

          // Ctrl+U: Underline
          if (e.key.toLowerCase() === 'u') {
            e.preventDefault();
            editor.chain().focus().toggleUnderline().run();
            return;
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [editor]);

    // Scroll Spy for TOC Heading Synchronization
    useEffect(() => {
      const container = containerRef.current;
      if (!container || !onActiveHeadingChange) return;

      const handleScroll = () => {
        const headingEls = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const containerTop = container.getBoundingClientRect().top;
        let found = '';

        for (const el of Array.from(headingEls)) {
          const rect = el.getBoundingClientRect();
          if (rect.top - containerTop <= 160) {
            found = el.textContent?.replace(/^#+\s*/, '').trim() || '';
          } else {
            break;
          }
        }

        if (found) {
          onActiveHeadingChange(found);
        }
      };

      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }, [onActiveHeadingChange]);

    // Source code mode text area handler
    const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const nextMd = e.target.value;
      onChange(nextMd);

      const charCount = nextMd.length;
      const wordCount = (nextMd.match(/[\w\u4e00-\u9fa5]+/g) || []).length;
      const pos = e.target.selectionStart;
      const before = nextMd.substring(0, pos);
      const lines = before.split('\n');
      onMetricsChange({
        wordCount,
        charCount,
        line: lines.length,
        column: lines[lines.length - 1].length + 1,
      });
    };

    return (
      <div
        ref={containerRef}
        className={`flex-1 h-full overflow-y-auto relative ${
          isFocusMode ? 'focus-mode' : ''
        }`}
      >
        {isSourceMode ? (
          <div className="max-w-[860px] mx-auto py-10 px-6 h-full flex flex-col">
            <textarea
              value={markdown}
              onChange={handleSourceChange}
              placeholder="输入 Markdown 源码..."
              className="w-full flex-1 resize-none bg-transparent font-mono text-[14.5px] leading-relaxed text-mac-text-primary dark:text-mac-text-darkPrimary focus:outline-none selection:bg-[#0071E3]/20"
              spellCheck={false}
            />
          </div>
        ) : (
          <>
            <EditorContent editor={editor} />
            <SelectionBubbleMenu editor={editor} />
            <TableToolbar editor={editor} />
          </>
        )}

        {/* Floating Find & Replace Panel (Ctrl+F / Ctrl+H) */}
        <FindReplaceBar
          isOpen={isFindOpen}
          onClose={() => setIsFindOpen(false)}
          editor={editor}
          isSourceMode={isSourceMode}
          markdown={markdown}
          onSourceReplaceAll={onChange}
          initialMode={findMode}
        />
      </div>
    );
  }
);
