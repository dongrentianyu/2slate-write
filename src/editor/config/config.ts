/* eslint-disable @typescript-eslint/ban-types */
import {
  AutoformatPlugin,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  ELEMENT_PARAGRAPH,
  ELEMENT_TD,
  ELEMENT_TODO_LI,
  ExitBreakPlugin,
  IndentPlugin,
  isBlockAboveEmpty,
  isSelectionAtBlockStart,
  KEYS_HEADING,
  LinkPlugin,
  MentionPlugin,
  NormalizeTypesPlugin,
  PlatePlugin,
  ResetNodePlugin,
  SelectOnBackspacePlugin,
  SoftBreakPlugin,
  TrailingBlockPlugin,
} from '@udecode/plate';
import { EditableProps } from 'slate-react/dist/components/editable';
import { autoformatRules } from './autoformat';
import { ELEMENT_WIDGET } from '../plugins/widget';

export const SAVE_DEBOUNCE_INTERVAL = 1000;

const resetBlockTypesCommonRule = {
  types: [ELEMENT_BLOCKQUOTE, ELEMENT_TODO_LI],
  defaultType: ELEMENT_PARAGRAPH,
};

interface Config {
  align: Partial<PlatePlugin>;
  autoformat: Partial<PlatePlugin<AutoformatPlugin>>;
  editableProps: EditableProps;
  exitBreak: Partial<PlatePlugin<ExitBreakPlugin>>;
  forceLayout: Partial<PlatePlugin<NormalizeTypesPlugin>>;
  indent: Partial<PlatePlugin<IndentPlugin>>;
  lineHeight: Partial<PlatePlugin>;
  link: Partial<PlatePlugin<LinkPlugin>>;
  mention: Partial<PlatePlugin<MentionPlugin<undefined>>>;
  resetBlockType: Partial<PlatePlugin<ResetNodePlugin>>;
  selectOnBackspace: Partial<PlatePlugin<SelectOnBackspacePlugin>>;
  softBreak: Partial<PlatePlugin<SoftBreakPlugin>>;
  trailingBlock: Partial<PlatePlugin<TrailingBlockPlugin>>;
}

// TODO: load keyboard shortcuts from tw config
export const CONFIG: Config = {
  link: {
    options: {
      hotkey: 'ctrl+l',
    },
  },
  mention: {
    key: '/',
    options: {
      trigger: '/',
      insertSpaceAfterMention: false,
      createMentionNode: (item) => {
        return {
          // override type and children in plate's packages/nodes/mention/src/getMentionOnSelectItem.ts
          // its default type is '/' (the same as the key above), but we want it to be normal text
          type: ELEMENT_PARAGRAPH,
          children: [{ text: item.text as string }],
        };
      },
    },
  },
  editableProps: {
    // we need this to reset cursor selection on every remount of widget, otherwise there will be IME problem, don't know why... https://github.com/tiddly-gittly/slate-write/issues/3#issuecomment-1114274656
    autoFocus: true,
    spellCheck: false,
    placeholder: 'Type / for commands, or write down what is in your mind',
    style: {
      padding: '15px',
    },
  },

  align: {
    inject: {
      props: {
        validTypes: [ELEMENT_PARAGRAPH, ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_H4, ELEMENT_H5, ELEMENT_H6],
      },
    },
  },
  indent: {
    inject: {
      props: {
        validTypes: [ELEMENT_PARAGRAPH, ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_H4, ELEMENT_H5, ELEMENT_H6, ELEMENT_BLOCKQUOTE, ELEMENT_CODE_BLOCK],
      },
    },
  },
  lineHeight: {
    inject: {
      props: {
        defaultNodeValue: 'normal',
        validTypes: [ELEMENT_PARAGRAPH, ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_H4, ELEMENT_H5, ELEMENT_H6],
      },
    },
  },
  resetBlockType: {
    options: {
      rules: [
        {
          ...resetBlockTypesCommonRule,
          hotkey: 'Enter',
          predicate: isBlockAboveEmpty,
        },
        {
          ...resetBlockTypesCommonRule,
          hotkey: 'Backspace',
          predicate: isSelectionAtBlockStart,
        },
      ],
    },
  },
  trailingBlock: { type: ELEMENT_PARAGRAPH },
  softBreak: {
    options: {
      rules: [
        { hotkey: 'shift+enter' },
        {
          hotkey: 'enter',
          query: {
            allow: [ELEMENT_CODE_BLOCK, ELEMENT_BLOCKQUOTE, ELEMENT_TD],
          },
        },
      ],
    },
  },
  exitBreak: {
    options: {
      rules: [
        {
          hotkey: 'mod+enter',
        },
        {
          hotkey: 'mod+shift+enter',
          before: true,
        },
        {
          hotkey: 'enter',
          query: {
            start: true,
            end: true,
            allow: KEYS_HEADING,
          },
        },
      ],
    },
  },
  selectOnBackspace: {
    options: {
      query: {
        allow: [ELEMENT_WIDGET],
      },
    },
  },
  autoformat: {
    options: {
      rules: autoformatRules,
    },
  },
  forceLayout: {
    options: {
      rules: [{ path: [0], strictType: ELEMENT_H1 }],
    },
  },
};
