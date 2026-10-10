import { HeadingItem } from '../types/file';

export function extractHeadings(markdown: string): HeadingItem[] {
  const headings: HeadingItem[] = [];
  const lines = markdown.split('\n');

  lines.forEach((line, index) => {
    const match = line.match(/^(#{1,6})\s+(.*)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim().replace(/[*_`~\[\]]/g, ''); // strip markdown formatting chars
      if (text) {
        headings.push({
          id: `heading-${index}-${text.slice(0, 16)}`,
          level,
          text,
        });
      }
    }
  });

  return headings;
}
