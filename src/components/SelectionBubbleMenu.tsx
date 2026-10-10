import React from 'react';
import { BubbleMenu, Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Highlighter,
  Link as LinkIcon,
} from 'lucide-react';

interface SelectionBubbleMenuProps {
  editor: Editor | null;
}

export const SelectionBubbleMenu: React.FC<SelectionBubbleMenuProps> = ({ editor }) => {
  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('输入超链接 URL：', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100, placement: 'top' }}
      shouldShow={({ state, from, to }) => {
        // Only show when there is a non-empty text selection and not inside a code block
        const { doc } = state;
        const isTextSelection = from !== to;
        const isCodeBlock = editor.isActive('codeBlock');
        return isTextSelection && !isCodeBlock && !doc.textBetween(from, to).trim().length ? false : isTextSelection && !isCodeBlock;
      }}
    >
      <div className="flex items-center gap-0.5 bg-white dark:bg-[#282828] text-mac-text-primary dark:text-mac-text-darkPrimary shadow-xl border border-black/10 dark:border-white/10 rounded-lg p-1 text-xs select-none animate-in fade-in zoom-in-95 duration-100 backdrop-blur-md">
        {/* Bold */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="粗体 (Ctrl+B)"
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('bold')
              ? 'bg-[#0071E3] text-white'
              : 'hover:bg-black/5 dark:hover:bg-white/10'
          }`}
        >
          <Bold size={13} />
        </button>

        {/* Italic */}
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="斜体 (Ctrl+I)"
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('italic')
              ? 'bg-[#0071E3] text-white'
              : 'hover:bg-black/5 dark:hover:bg-white/10'
          }`}
        >
          <Italic size={13} />
        </button>

        {/* Underline */}
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="下划线 (Ctrl+U)"
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('underline')
              ? 'bg-[#0071E3] text-white'
              : 'hover:bg-black/5 dark:hover:bg-white/10'
          }`}
        >
          <UnderlineIcon size={13} />
        </button>

        {/* Strike */}
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="删除线"
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('strike')
              ? 'bg-[#0071E3] text-white'
              : 'hover:bg-black/5 dark:hover:bg-white/10'
          }`}
        >
          <Strikethrough size={13} />
        </button>

        <div className="w-[1px] h-3.5 bg-black/10 dark:bg-white/10 mx-0.5" />

        {/* Inline Code */}
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          title="行内代码"
          className={`p-1.5 rounded transition-colors font-mono text-[11px] ${
            editor.isActive('code')
              ? 'bg-[#0071E3] text-white'
              : 'hover:bg-black/5 dark:hover:bg-white/10'
          }`}
        >
          <Code size={13} />
        </button>

        {/* Highlight */}
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          title="高亮"
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('highlight')
              ? 'bg-[#0071E3] text-white'
              : 'hover:bg-black/5 dark:hover:bg-white/10'
          }`}
        >
          <Highlighter size={13} />
        </button>

        {/* Link */}
        <button
          onClick={setLink}
          title="插入链接 (Ctrl+K)"
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('link')
              ? 'bg-[#0071E3] text-white'
              : 'hover:bg-black/5 dark:hover:bg-white/10'
          }`}
        >
          <LinkIcon size={13} />
        </button>
      </div>
    </BubbleMenu>
  );
};

