import { marked } from 'marked';
import TurndownService from 'turndown';
// @ts-expect-error turndown-plugin-gfm doesn't have official types
import { gfm } from 'turndown-plugin-gfm';

// Configure Marked for GFM
marked.setOptions({
  gfm: true,
  breaks: true,
});

// Configure Turndown for clean Markdown output
const turndownService = new TurndownService({
  headingStyle: 'atx',
  hr: '---',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
  strongDelimiter: '**',
});

// Use GFM plugins (tables, strikethrough, task lists)
turndownService.use(gfm);

// Custom rule for headings: preserve natural numbering without escaping (e.g. "1." instead of "1\.")
turndownService.addRule('cleanHeadings', {
  filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  replacement: (content, node) => {
    const hLevel = Number(node.nodeName.charAt(1));
    const cleanContent = content
      .trim()
      .replace(/(\d+)\\\./g, '$1.')
      .replace(/\\([.\-*_`~#+!])/g, '$1');
    return `\n\n${'#'.repeat(hLevel)} ${cleanContent}\n\n`;
  },
});

// Custom Turndown rule for Math Block
turndownService.addRule('mathBlock', {
  filter: (node: HTMLElement) => {
    return node.nodeName === 'DIV' && node.classList.contains('math-block');
  },
  replacement: (_content: string, node: HTMLElement) => {
    const raw = node.getAttribute('data-math') || '';
    return `\n\n$$\n${raw.trim()}\n$$\n\n`;
  },
});

// Custom Turndown rule for Inline Math
turndownService.addRule('inlineMath', {
  filter: (node: HTMLElement) => {
    return node.nodeName === 'SPAN' && node.classList.contains('math-inline');
  },
  replacement: (_content: string, node: HTMLElement) => {
    const raw = node.getAttribute('data-math') || '';
    return `$${raw.trim()}$`;
  },
});

// Custom Turndown rule for Mermaid Block
turndownService.addRule('mermaidBlock', {
  filter: (node: HTMLElement) => {
    return (
      node.nodeName === 'DIV' &&
      (node.classList.contains('mermaid-block') ||
        node.classList.contains('mermaid-block-node') ||
        node.classList.contains('mermaid-container'))
    );
  },
  replacement: (_content: string, node: HTMLElement) => {
    const raw = decodeURIComponent(node.getAttribute('data-code') || '');
    return `\n\n\`\`\`mermaid\n${raw.trim()}\n\`\`\`\n\n`;
  },
});

/**
 * Convert Markdown string to HTML for TipTap ingestion
 */
export function markdownToHtml(md: string): string {
  if (!md) return '<p></p>';

  // Pre-process mermaid code blocks
  let processed = md.replace(/```mermaid\s*([\s\S]*?)```/g, (_match, code) => {
    const clean = code.trim();
    return `<div class="mermaid-block" data-code="${encodeURIComponent(clean)}"></div>`;
  });

  // Pre-process math blocks: replace $$ ... $$ with a designated tag
  processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (_match, mathContent) => {
    const clean = mathContent.trim();
    return `<div class="math-block" data-math="${encodeURIComponent(clean)}"></div>`;
  });

  // Pre-process inline math: replace $ ... $ with span
  processed = processed.replace(/(?<!\$)\$([^\$\n]+?)\$(?!\$)/g, (_match, mathContent) => {
    const clean = mathContent.trim();
    return `<span class="math-inline" data-math="${encodeURIComponent(clean)}"></span>`;
  });

  const rawHtml = marked.parse(processed) as string;
  return rawHtml;
}

/**
 * Convert TipTap HTML output to Markdown string
 */
export function htmlToMarkdown(html: string): string {
  if (!html) return '';
  const md = turndownService.turndown(html);
  return md;
}
