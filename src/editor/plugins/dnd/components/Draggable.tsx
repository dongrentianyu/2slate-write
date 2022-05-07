import React, { useRef } from 'react';
import Tippy from '@tippyjs/react';
import styled, { CSSProp } from 'styled-components';
import is from 'typescript-styled-is';
import useMergedRef from '@react-hook/merged-ref';
import { DragIndicator } from '@styled-icons/material/DragIndicator';
import { useDndBlock } from '../hooks/useDndBlock';
import { DraggableProps } from './Draggable.types';
import { grabberTooltipProps } from './grabberTooltipProps';

interface IStyleMod {
  mod?: string | CSSProp<any>;
}
const DragHandle = styled.button`
  outline: 2px solid transparent;
  outline-offset: 2px;
  padding: 0px;
  background-repeat: no-repeat;
  background-color: transparent;
  border-style: none;
  overflow: hidden;
  cursor: pointer;
`;
const GutterLeft = styled.div<IStyleMod>`
  position: absolute;
  top: 0px;
  display: flex;
  height: 100%;
  opacity: 0;
  transform: translateX(-100%);
  ${({ mod }) => mod}
`;
const DraggableRoot = styled.div`
  position: relative;
  ${is('isDragging')`
    opacity: 50%;
  `}
  &:hover .slate-Draggable-gutterLeft {
    opacity: 100%;
  }
`;
const BlockAndGutter = styled.div`
  overflow: auto;
`;
const BlockToolbarWrapper = styled.div<IStyleMod>`
  display: flex;
  height: 1.5em;
  ${({ mod }) => mod}
`;
const BlockToolbar = styled.div`
  display: flex;
  align-items: center;
  margin-right: 0.25rem;
  pointer-events: auto;
`;
const DropLine = styled.div<{ dropLine: '' | 'top' | 'bottom' }>`
  position: absolute;
  margin-left: 0;
  margin-right: 0;
  opacity: 100%;
  height: 0.125rem;
  background: #b4d5ff;
  width: 100%;
  ${({ dropLine }) => (dropLine === 'top' ? 'top: -1px;' : dropLine === 'bottom' ? 'bottom: -1px;' : '')}
`;

export const Draggable = (props: DraggableProps) => {
  const { children, element, componentRef, styles } = props;

  const blockRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const dragWrapperRef = useRef(null);
  const multiRootRef = useMergedRef(componentRef, rootRef);

  const { dropLine, dragRef, isDragging } = useDndBlock({
    id: element.id,
    blockRef: rootRef,
  });

  const multiDragRef = useMergedRef(dragRef, dragWrapperRef);

  return (
    <DraggableRoot ref={multiRootRef} isDragging={isDragging}>
      <BlockAndGutter ref={blockRef}>
        {children}
        {!!dropLine && <DropLine contentEditable={false} dropLine={dropLine} />}
      </BlockAndGutter>

      <GutterLeft className="slate-Draggable-gutterLeft" mod={styles?.gutterLeft} contentEditable={false}>
        <BlockToolbarWrapper mod={styles?.blockToolbarWrapper}>
          <BlockToolbar ref={multiDragRef}>
            <Tippy {...grabberTooltipProps}>
              <DragHandle type="button" onMouseDown={(e: any) => e.stopPropagation()}>
                <DragIndicator
                  style={{
                    width: 18,
                    height: 18,
                    color: 'rgba(55, 53, 47, 0.3)',
                  }}
                />
              </DragHandle>
            </Tippy>
          </BlockToolbar>
        </BlockToolbarWrapper>
      </GutterLeft>
    </DraggableRoot>
  );
};
