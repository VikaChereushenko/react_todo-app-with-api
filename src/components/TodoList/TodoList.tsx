import React from 'react';

import { TodoItem } from '../TodoItem/TodoItem';

import { Todo } from '../../types/Todo';

type Props = {
  filteredTodos: Todo[];
  onDelete: (id: number) => void;
  onStatusUpdate: (id: number) => void;
  onUpdatedTitleSubmit: (
    arg1: number,
    arg2: string,
    arg3: React.Dispatch<React.SetStateAction<boolean>>,
    arg4: boolean,
    arg5?: React.FormEvent<HTMLFormElement>,
  ) => void;
  onKeyUp: (
    arg1: React.KeyboardEvent<HTMLInputElement>,
    arg2: React.Dispatch<React.SetStateAction<boolean>>,
  ) => void;
  processedIs: number[];
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  onDelete,
  onStatusUpdate,
  onUpdatedTitleSubmit,
  onKeyUp,
  processedIs,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => {
        const { id, completed, title } = todo;

        return (
          <TodoItem
            key={id}
            id={id}
            completed={completed}
            title={title}
            onItemDelete={onDelete}
            onItemStatusUpdate={onStatusUpdate}
            onItemTitleUpdate={onUpdatedTitleSubmit}
            onKeyUp={onKeyUp}
            processedIs={processedIs}
          />
        );
      })}
    </section>
  );
};
