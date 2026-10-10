import { HeadingItem } from '../types/file';

export function extractHeadings(markdown: string): HeadingItem[] {
  const headings: HeadingItem[] = [];
  const lines = markdown.split('\n');
  let headingCount = 0;

  lines.forEach((line, lineIndex) => {
    const match = line.match(/^(#{1,6})\s+(.*)$/);
    if (match) {
      const level = match[1].length;
      // 1. 去除 Turndown 生成的反斜杠转义 (如 1\. -> 1.)
      // 2. 去除 markdown 标记符号 (*, _, `, ~, [, ])
      const cleanText = match[2]
        .trim()
        .replace(/\\([.\-*_`~#+!])/g, '$1')
        .replace(/[*_`~\[\]]/g, '')
        .trim();

      if (cleanText) {
        headings.push({
          id: `heading-${lineIndex}-${headingCount}`,
          level,
          text: cleanText,
          index: headingCount,
        });
        headingCount++;
      }
    }
  });

  return headings;
}
