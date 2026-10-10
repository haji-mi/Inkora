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

/**
 * Convert Markdown string to HTML for TipTap ingestion
 */
export function markdownToHtml(md: string): string {
  if (!md) return '<p></p>';

  // Pre-process math blocks: replace $$ ... $$ with a designated tag so marked doesn't mangle it
  let processed = md.replace(/\$\$([\s\S]*?)\$\$/g, (_match, mathContent) => {
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
