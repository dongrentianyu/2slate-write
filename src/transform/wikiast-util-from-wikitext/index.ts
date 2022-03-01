import type { IParseTreeNode } from 'tiddlywiki';

export function fromWikiText(input: string): IParseTreeNode[] {
  if (typeof $tw === 'undefined') {
    return [];
  }
  const rootNode = $tw.wiki.parseText('text/vnd.tiddlywiki', input).tree;
  return rootNode;
}
