import { AnyObject, TNode } from '@udecode/plate';
import { ICustomParseTreeNode, IParseTreeNode } from 'tiddlywiki';
import type { IContext } from '.';

import { IBuilders } from './slateBuilder';

export type IAnyBuilder = IBuilders & Record<string, typeof slateNode>;

export function convertNodes(context: IContext, nodes: IParseTreeNode[] | undefined): Array<TNode<AnyObject>> {
  if (nodes === undefined || nodes.length === 0) {
    return [{ text: '' }];
  }

  return nodes.reduce((accumulator: Array<TNode<AnyObject>>, node) => {
    return [...accumulator, ...slateNode(context, node)];
  }, []);
}

export function slateNode(context: IContext, node: IParseTreeNode): Array<TNode<AnyObject>> {
  if (node.type in context.builders) {
    const builder = (context.builders as IAnyBuilder)[node.type];
    if (typeof builder === 'function') {
      // basic elements
      const builtSlateNodeOrNodes = builder(context, node);
      return Array.isArray(builtSlateNodeOrNodes) ? builtSlateNodeOrNodes : ([builtSlateNodeOrNodes] as Array<TNode<AnyObject>>);
    }
  } else {
    // widget
    // I guess this rule is enough for judge the current node is a widget? see `test/constants/wikiAst/widget.ts` for example.
    if (typeof node.type === 'string' && 'tag' in node && typeof node.tag === 'string') {
      return [context.builders.widget(context, node as ICustomParseTreeNode)];
    }
  }
  return [];
}
