import { Node, mergeAttributes } from '@tiptap/core';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
});

let mermaidIdCounter = 0;

export const MermaidBlock = Node.create({
  name: 'mermaidBlock',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      code: {
        default: 'graph TD\n  A[开始] --> B(处理)\n  B --> C[完成]',
        parseHTML: (element) => {
          const raw = element.getAttribute('data-code');
          return raw ? decodeURIComponent(raw) : element.textContent || '';
        },
        renderHTML: (attributes) => ({
          'data-code': encodeURIComponent(attributes.code),
          class: 'mermaid-block-node',
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div.mermaid-block',
      },
      {
        tag: 'pre',
        getAttrs: (node) => {
          const codeEl = (node as HTMLElement).querySelector('code.language-mermaid');
          if (codeEl) {
            return { code: codeEl.textContent || '' };
          }
          return false;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ({ node, editor, getPos }) => {
      const container = document.createElement('div');
      container.className =
        'mermaid-container my-4 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#1E1E1E] overflow-hidden group shadow-sm';

      let isEditing = false;
      const id = `mermaid-svg-${++mermaidIdCounter}`;

      // Header bar
      const header = document.createElement('div');
      header.className =
        'px-3 py-1.5 bg-black/[0.03] dark:bg-white/[0.05] border-b border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] text-mac-text-secondary select-none';

      const title = document.createElement('span');
      title.className = 'font-semibold tracking-wide text-[#0071E3]';
      title.textContent = 'Mermaid 图表';

      const btnGroup = document.createElement('div');
      btnGroup.className = 'flex items-center gap-2';

      const toggleBtn = document.createElement('button');
      toggleBtn.className =
        'px-2 py-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 text-mac-text-primary dark:text-mac-text-darkPrimary transition-colors';
      toggleBtn.textContent = '编辑源码';

      btnGroup.appendChild(toggleBtn);
      header.appendChild(title);
      header.appendChild(btnGroup);

      // Diagram render view
      const renderView = document.createElement('div');
      renderView.className = 'p-4 flex justify-center items-center overflow-x-auto min-h-[100px]';

      // Source editor view (hidden by default)
      const editorView = document.createElement('div');
      editorView.className = 'p-3 hidden';
      const textarea = document.createElement('textarea');
      textarea.className =
        'w-full h-32 p-2 rounded bg-black/[0.02] dark:bg-black/30 font-mono text-xs text-mac-text-primary dark:text-mac-text-darkPrimary border border-black/10 dark:border-white/10 focus:outline-none';
      textarea.value = node.attrs.code;
      editorView.appendChild(textarea);

      const renderDiagram = async (code: string) => {
        try {
          renderView.innerHTML = '<span class="text-xs text-mac-text-secondary">渲染中...</span>';
          const { svg } = await mermaid.render(`${id}-${Date.now()}`, code.trim());
          renderView.innerHTML = svg;
        } catch (err: any) {
          renderView.innerHTML = `<div class="text-xs text-red-500 p-2 font-mono">[Mermaid 语法错误: ${err?.message || '无法解析'}]</div>`;
        }
      };

      renderDiagram(node.attrs.code);

      toggleBtn.onclick = (e) => {
        e.stopPropagation();
        isEditing = !isEditing;
        if (isEditing) {
          editorView.classList.remove('hidden');
          toggleBtn.textContent = '预览图表';
          textarea.focus();
        } else {
          editorView.classList.add('hidden');
          toggleBtn.textContent = '编辑源码';
          const nextCode = textarea.value;
          if (typeof getPos === 'function') {
            const pos = getPos();
            if (typeof pos === 'number') {
              editor.commands.command(({ tr }) => {
                tr.setNodeMarkup(pos, undefined, { code: nextCode });
                return true;
              });
            }
          }
          renderDiagram(nextCode);
        }
      };

      container.appendChild(header);
      container.appendChild(renderView);
      container.appendChild(editorView);

      return {
        dom: container,
        update: (updatedNode) => {
          if (updatedNode.type.name !== 'mermaidBlock') return false;
          if (updatedNode.attrs.code !== textarea.value) {
            textarea.value = updatedNode.attrs.code;
            renderDiagram(updatedNode.attrs.code);
          }
          return true;
        },
      };
    };
  },
});
