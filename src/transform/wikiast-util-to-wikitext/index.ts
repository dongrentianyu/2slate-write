import cloneDeep from 'lodash/cloneDeep';
import type { IParseTreeNode } from 'tiddlywiki';
import { builders, IBuilders } from './astSerializer';
import { dropExtraTailingN } from '../token-stream-utils/dropExtraTailingN';
import { convertNodes, convertOneNode } from './traverse';
import repeat from 'lodash/repeat';

export type IAnyBuilder = IBuilders & Record<string, typeof convertOneNode>;

/**
 * Wikitext is context aware, we need to know how current indentation is affected by the former code, and current list mode, etc.
 */
export interface IContext {
  /** is root's children, we add \n between root's children */
  root: boolean;
  /** Builders from node to text
   * Using dependency injection (pass-in via function parameter) to avoid circular dependency */
  builders: IAnyBuilder;
  /**
   * ul or ol will indent the following lines if they are inside other ul or ol, this counter variable tracks how much should we indent, it starts at -1, and may +1 for each ul or ol level before generating text (so it becomes 0 for the first ul or ol)
   */
  indentLevels: number;
  /** let li know it should use which symbol for list dot
   * If this is not undefined, means we are in a li
   */
  listMode: 'ul' | 'ol' | undefined;
  marks: {
    code?: boolean;
    em?: boolean;
    strike?: boolean;
    strong?: boolean;
    sub?: boolean;
    sup?: boolean;
    u?: boolean;
  };
}
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const defaultContext = {
  root: true,
  builders,
  indentLevels: -1,
  listMode: undefined,
  marks: {},
} as IContext;

export interface IWikiAstToWikiTextOptions {
  /** Number of extra `\n` added to the end of file. We will remove extra `\n`, so if you still need them, you have to say you want to add some of them back by this. */
  extraTailingNCount?: number;
}
export function wikiAstToWikiText(input: IParseTreeNode | IParseTreeNode[], options?: IWikiAstToWikiTextOptions): string {
  const { extraTailingNCount = 0 } = options ?? {};
  const lines = convertNodes(cloneDeep(defaultContext), Array.isArray(input) ? input : [input]);
  return dropExtraTailingN(lines).join('') + repeat('\n', extraTailingNCount)
}
