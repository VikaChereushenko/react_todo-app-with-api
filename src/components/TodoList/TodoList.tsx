import React from 'react';

import { TodoItem } from '../TodoItem/TodoItem';

import { Todo } from '../../types/Todo';

type Props = {
  filteredTodos: Todo[];
  onDelete: (id: number) => void;
  onStatusUpdate: (id: number) => void;
  onUpdatedTitleSubmit: (
    arg1: React.FormEvent<HTMLFormElement>,
    arg2: number,
    arg3: string,
    arg4: React.Dispatch<React.SetStateAction<boolean>>,
  ) => void;
  loading: boolean;
  processedIs: number[];
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  onDelete,
  onStatusUpdate,
  onUpdatedTitleSubmit,
  loading,
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
            isItemLoading={loading}
            processedIs={processedIs}
          />
        );
      })}
    </section>
  );
};
