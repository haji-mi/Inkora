import { Node, mergeAttributes } from '@tiptap/core';
import katex from 'katex';

export const MathBlock = Node.create({
  name: 'mathBlock',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      math: {
        default: 'E = mc^2',
        parseHTML: (element) => {
          const raw = element.getAttribute('data-math');
          return raw ? decodeURIComponent(raw) : element.textContent || '';
        },
        renderHTML: (attributes) => ({
          'data-math': encodeURIComponent(attributes.math),
          class: 'math-block-node',
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div.math-block' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ({ node, editor, getPos }) => {
      const container = document.createElement('div');
      container.className =
        'math-block-container my-4 p-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] hover:border-[#0071E3]/50 transition-colors group relative cursor-pointer';

      const renderView = document.createElement('div');
      renderView.className = 'flex justify-center overflow-x-auto py-2';

      const updateContent = (formula: string) => {
        try {
          renderView.innerHTML = katex.renderToString(formula || 'E = mc^2', {
            displayMode: true,
            throwOnError: false,
          });
        } catch (e) {
          renderView.textContent = `[公式解析错误: ${formula}]`;
        }
      };

      updateContent(node.attrs.math);

      // Tooltip / edit hint
      const hint = document.createElement('div');
      hint.className =
        'absolute top-1 right-2 text-[10px] text-mac-text-secondary opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-black/90 px-1.5 py-0.5 rounded shadow-sm border border-black/5 dark:border-white/10';
      hint.textContent = '双击编辑公式';

      container.appendChild(renderView);
      container.appendChild(hint);

      // Double-click to edit via modal/prompt
      container.ondblclick = () => {
        const next = prompt('编辑 LaTeX 公式：', node.attrs.math);
        if (next !== null && next !== node.attrs.math && typeof getPos === 'function') {
          const pos = getPos();
          if (typeof pos === 'number') {
            editor.commands.command(({ tr }) => {
              tr.setNodeMarkup(pos, undefined, { math: next });
              return true;
            });
            updateContent(next);
          }
        }
      };

      return {
        dom: container,
        update: (updatedNode) => {
          if (updatedNode.type.name !== 'mathBlock') return false;
          updateContent(updatedNode.attrs.math);
          return true;
        },
      };
    };
  },
});
