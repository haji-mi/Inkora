import React from 'react';
import { Editor } from '@tiptap/react';
import { Plus, Trash2, Columns, Rows } from 'lucide-react';

interface TableToolbarProps {
  editor: Editor | null;
}

export const TableToolbar: React.FC<TableToolbarProps> = ({ editor }) => {
  if (!editor || !editor.isActive('table')) {
    return null;
  }

  return (
    <div className="fixed bottom-12 right-6 mac-glass bg-white/95 dark:bg-[#252525]/95 shadow-lg border border-black/10 dark:border-white/10 rounded-lg p-1.5 flex items-center gap-1 z-40 text-xs animate-in fade-in slide-in-from-bottom-2 duration-150">
      <span className="text-[11px] font-medium text-mac-text-secondary px-1.5 flex items-center gap-1">
        <Columns size={12} />
        表格操作
      </span>

      <div className="w-[1px] h-3.5 bg-black/10 dark:bg-white/10 mx-0.5" />

      <button
        onClick={() => editor.chain().focus().addRowAfter().run()}
        title="在下方插入行"
        className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 text-mac-text-primary dark:text-mac-text-darkPrimary transition-colors flex items-center gap-0.5"
      >
        <Plus size={11} />
        <Rows size={12} />
      </button>

      <button
        onClick={() => editor.chain().focus().deleteRow().run()}
        title="删除当前行"
        className="p-1 rounded hover:bg-red-500/10 text-red-500 transition-colors"
      >
        <Trash2 size={12} />
      </button>

      <div className="w-[1px] h-3.5 bg-black/10 dark:bg-white/10 mx-0.5" />

      <button
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        title="在右侧插入列"
        className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 text-mac-text-primary dark:text-mac-text-darkPrimary transition-colors flex items-center gap-0.5"
      >
        <Plus size={11} />
        <Columns size={12} />
      </button>

      <button
        onClick={() => editor.chain().focus().deleteColumn().run()}
        title="删除当前列"
        className="p-1 rounded hover:bg-red-500/10 text-red-500 transition-colors"
      >
        <Trash2 size={12} />
      </button>

      <div className="w-[1px] h-3.5 bg-black/10 dark:bg-white/10 mx-0.5" />

      <button
        onClick={() => editor.chain().focus().deleteTable().run()}
        title="删除整个表格"
        className="px-1.5 py-0.5 rounded text-[11px] bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
      >
        删除表格
      </button>
    </div>
  );
};
