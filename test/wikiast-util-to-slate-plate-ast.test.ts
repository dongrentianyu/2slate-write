/* eslint-disable @typescript-eslint/dot-notation */
import { wikiAstToSlateAst } from '../src/transform/wikiast-util-to-slate-plate-ast';
import { slateDict, wikiAstDict } from './constants';

describe('Transform node', () => {
  test('wikiAstToSlateAst callable', () => {
    expect(typeof wikiAstToSlateAst).toBe('function');
  });
  test('text', () => {
    expect(wikiAstToSlateAst(wikiAstDict['text'])).toEqual(slateDict['text']);
  });
});

describe('Transform tree', () => {
  test('p > text', () => {
    expect(wikiAstToSlateAst(wikiAstDict['p > text'])).toMatchObject([slateDict['p > text']]);
  });
  test('ul > li > text', () => {
    expect(wikiAstToSlateAst(wikiAstDict['ul > li > text'])).toMatchObject([slateDict['ul > li > text']]);
  });
  test('ol > li > text', () => {
    expect(wikiAstToSlateAst(wikiAstDict['ol > li > text'])).toMatchObject([slateDict['ol > li > text']]);
  });
  test('ol > ol > ol > li', () => {
    expect(wikiAstToSlateAst(wikiAstDict['ol > ol > ol > li'])).toMatchObject([slateDict['ol > ol > ol > li']]);
  });
  test('p + ol + blockquote > div + ol', () => {
    expect(wikiAstToSlateAst(wikiAstDict['p + ol + blockquote > div + ol'])).toMatchObject(slateDict['p + ol + blockquote > div + ol']);
  });
  test('p basic sequence marks', () => {
    expect(wikiAstToSlateAst(wikiAstDict['p basic sequence marks'])).toMatchObject(slateDict['p basic sequence marks']);
  });
  test('ol > li > mark > text', () => {
    expect(wikiAstToSlateAst(wikiAstDict['ol > li > mark > text'])).toMatchObject(slateDict['ol > li > mark > text']);
  });
  test('image', () => {
    expect(wikiAstToSlateAst(wikiAstDict['image'])).toMatchObject([slateDict['image']]);
  });
  test('transclude', () => {
    expect(wikiAstToSlateAst(wikiAstDict['transclude'])).toMatchObject([slateDict['transclude']]);
  });
  test('list widget', () => {
    expect(wikiAstToSlateAst(wikiAstDict['list widget'])).toMatchObject([slateDict['list widget']]);
  });
  test('list widget block', () => {
    expect(wikiAstToSlateAst(wikiAstDict['list widget block'])).toMatchObject(slateDict['list widget block']);
  });
  test('link', () => {
    expect(wikiAstToSlateAst(wikiAstDict['link'])).toMatchObject(slateDict['link']);
  });
  test('empty link', () => {
    expect(wikiAstToSlateAst(wikiAstDict['empty link'])).toMatchObject(slateDict['empty link']);
  });
  test('alias link', () => {
    expect(wikiAstToSlateAst(wikiAstDict['alias link'])).toMatchObject(slateDict['alias link']);
  });
  test('external link', () => {
    expect(wikiAstToSlateAst(wikiAstDict['external link'])).toMatchObject(slateDict['external link']);
  });
  test('link in a list', () => {
    expect(wikiAstToSlateAst(wikiAstDict['link in a list'])).toMatchObject(slateDict['link in a list']);
  });
  test('heading', () => {
    expect(wikiAstToSlateAst(wikiAstDict['heading'])).toMatchObject(slateDict['heading']);
  });
});
