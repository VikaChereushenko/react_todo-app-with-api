import React from 'react';
import { useRef, useEffect } from 'react';
import classNames from 'classnames';

type Props = {
  allTodosCompleted: boolean;
  noTodos: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  title: string;
  onTitleChange: (arg: string) => void;
  onTotalStatusUpdate: () => void;
};

export const Header: React.FC<Props> = ({
  allTodosCompleted,
  noTodos,
  onSubmit,
  loading,
  title,
  onTitleChange,
  onTotalStatusUpdate,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  return (
    <header className="todoapp__header">
      {!noTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onTotalStatusUpdate}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={event => onSubmit(event)}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => onTitleChange(event.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
};
