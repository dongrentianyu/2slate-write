/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { createNodesWithHOC } from '@udecode/plate-utils';
import { FC } from 'react';

import { withDraggable as withDraggablePrimitive, WithDraggableOptions } from '@udecode/plate-dnd';

import { draggableComponents } from '../../config/draggableComponents';
import { Draggable, DraggableProps } from './draggable';

export const withDraggable = (
  Component: FC,
  options?: WithDraggableOptions<
    Partial<Omit<DraggableProps, 'editor' | 'element' | 'children'>>
  >,
) => withDraggablePrimitive<DraggableProps>(Draggable, Component, options as any);

export const withDraggablesPrimitive = createNodesWithHOC(withDraggable);

export const withDraggables = (components: any) => {
  return withDraggablesPrimitive(components, draggableComponents);
};
