import { IChangedTiddlers } from 'tiddlywiki';
import type { ReactWidget } from 'tw-react';

import { EditorApp, IEditorAppProps } from './editor';
import { SAVE_DEBOUNCE_INTERVAL } from '../config/config';

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const Widget = require('$:/plugins/linonetwo/tw-react/widget.js').widget as typeof ReactWidget;

// TODO: implement things in https://github.com/Jermolene/TiddlyWiki5/blob/master/core/modules/editor/factory.js

const DEFAULT_MIN_TEXT_AREA_HEIGHT = '100px'; // Minimum height of textareas in pixels

// Configuration tiddlers
const HEIGHT_MODE_TITLE = '$:/config/TextEditor/EditorHeight/Mode';
const ENABLE_TOOLBAR_TITLE = '$:/config/TextEditor/EnableToolbar';

class SlateWriteWidget extends Widget {
  private currentTiddler: string | undefined;
  editorOperations = {};
  private editTitle: string | undefined;
  private editField: string | undefined;
  private editIndex: string | undefined;
  private editDefault: string | undefined;
  private editClass: string | undefined;
  private editPlaceholder: string | undefined;
  private editSize: string | undefined;
  private editRows: string | undefined;
  private editAutoHeight: boolean | undefined;
  private editMinHeight: string | undefined;
  private editFocusPopup: string | undefined;
  private editFocus: string | undefined;
  private editTabIndex: string | undefined;
  private editCancelPopups: boolean | undefined;
  private editInputActions: string | undefined;
  private editRefreshTitle: string | undefined;
  private editAutoComplete: string | undefined;
  private isDisabled: string | undefined;
  private isFileDropEnabled: boolean | undefined;
  private editShowToolbar: boolean | undefined;

  /** a lock to prevent update from tiddler to slate, when update of tiddler is trigger by slate. */
  private isUpdatingByUserInput: boolean = false;
  private updatingLockTimeoutHandle: NodeJS.Timeout | undefined;

  constructor(parseTreeNode: any, options: any) {
    super(parseTreeNode, options);
    $tw.modules.applyMethods('texteditoroperation', this.editorOperations);
  }

  reactComponent = EditorApp;
  getProps = (): IEditorAppProps => {
    const onSave = (newText: string): void => {
      if (!this.editTitle) {
        return;
      }
      const previousText = $tw.wiki.getTiddlerText(this.editTitle) ?? '';
      // prevent useless call to addTiddler
      if (previousText === newText) {
        return;
      }
      $tw.wiki.setText(this.editTitle, undefined, undefined, newText);
      this.updatingLockTimeoutHandle = setTimeout(() => {
        this.isUpdatingByUserInput = false;
      });
    };
    return {
      currentTiddler: this.editTitle ?? this.getVariable('currentTiddler'),
      tiddlerText: (this.editTitle && $tw.wiki.getTiddlerText(this.editTitle)) ?? '',
      saver: {
        lock: () => {
          this.isUpdatingByUserInput = true;
          if (this.updatingLockTimeoutHandle) {
            clearTimeout(this.updatingLockTimeoutHandle);
          }
        },
        onSave,
        interval: SAVE_DEBOUNCE_INTERVAL,
      },
    };
  };

  execute() {
    // Get our parameters
    this.editTitle = this.getAttribute('tiddler', this.getVariable('currentTiddler'));
    this.editField = this.getAttribute('field', 'text');
    this.editIndex = this.getAttribute('index');
    this.editDefault = this.getAttribute('default');
    this.editClass = this.getAttribute('class');
    this.editPlaceholder = this.getAttribute('placeholder');
    this.editSize = this.getAttribute('size');
    this.editRows = this.getAttribute('rows');
    const editAutoHeight = $tw.wiki.getTiddlerText(HEIGHT_MODE_TITLE, 'auto');
    this.editAutoHeight = this.getAttribute('autoHeight', editAutoHeight === 'auto' ? 'yes' : 'no') === 'yes';
    this.editMinHeight = this.getAttribute('minHeight', DEFAULT_MIN_TEXT_AREA_HEIGHT);
    this.editFocusPopup = this.getAttribute('focusPopup');
    this.editFocus = this.getAttribute('focus');
    this.editTabIndex = this.getAttribute('tabindex');
    this.editCancelPopups = this.getAttribute('cancelPopups', '') === 'yes';
    this.editInputActions = this.getAttribute('inputActions');
    this.editRefreshTitle = this.getAttribute('refreshTitle');
    this.editAutoComplete = this.getAttribute('autocomplete');
    this.isDisabled = this.getAttribute('disabled', 'no');
    this.isFileDropEnabled = this.getAttribute('fileDrop', 'no') === 'yes';
    // Get the default editor element tag and type (textarea or div) (not implemented)

    // Make the child widgets
    this.makeChildWidgets();
    // Determine whether to show the toolbar
    const editShowToolbar = $tw.wiki.getTiddlerText(ENABLE_TOOLBAR_TITLE, 'yes');
    this.editShowToolbar = editShowToolbar === 'yes' && !!(this.children && this.children.length > 0) /* && !this.document.isTiddlyWikiFakeDom */;
  }

  refresh(changedTiddlers: IChangedTiddlers): boolean {
    // copied from `core/modules/editor/factory.js`'s `refresh`
    const changedAttributes = this.computeAttributes();
    // if tiddler change is triggered by slate, then skip the update of slate
    if (this.isUpdatingByUserInput) {
      return false;
    }
    // Completely rerender if any of our attributes have changed
    if (
      changedAttributes.tiddler ||
      changedAttributes.field ||
      changedAttributes.index ||
      changedAttributes['default'] ||
      changedAttributes['class'] ||
      changedAttributes.placeholder ||
      changedAttributes.size ||
      changedAttributes.autoHeight ||
      changedAttributes.minHeight ||
      changedAttributes.focusPopup ||
      changedAttributes.rows ||
      changedAttributes.tabindex ||
      changedAttributes.cancelPopups ||
      changedAttributes.inputActions ||
      changedAttributes.refreshTitle ||
      changedAttributes.autocomplete ||
      changedTiddlers[HEIGHT_MODE_TITLE] ||
      changedTiddlers[ENABLE_TOOLBAR_TITLE] ||
      changedAttributes.disabled ||
      changedAttributes.fileDrop ||
      (this.editRefreshTitle !== undefined && changedTiddlers[this.editRefreshTitle]) ||
      (this.editTitle && changedTiddlers[this.editTitle]?.modified)
    ) {
      this.refreshSelf();
      return this.refreshChildren(changedTiddlers);
    }
    return false;
  }
}
exports.SlateWriteWidget = SlateWriteWidget;
