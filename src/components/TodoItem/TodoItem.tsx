import React, { useState } from 'react';
import classNames from 'classnames';

type Props = {
  id: number;
  completed: boolean;
  title: string;
  isItemLoading: boolean;
  onItemDelete: (id: number) => void;
  onItemStatusUpdate: (id: number) => void;
  onItemTitleUpdate: (
    arg1: React.FormEvent<HTMLFormElement>,
    arg2: number,
    arg3: string,
    arg4: React.Dispatch<React.SetStateAction<boolean>>,
  ) => void;
  processedIs: number[];
};
export const TodoItem: React.FC<Props> = ({
  id,
  completed,
  title,
  isItemLoading,
  onItemStatusUpdate,
  onItemDelete,
  onItemTitleUpdate,
  processedIs,
}) => {
  const isLoading = isItemLoading && processedIs.includes(id);
  const [isTitleBeingUpdated, setTitleBeingUpdated] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', 'item-enter-done')}
      key={id}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onItemStatusUpdate(id)}
        />
      </label>

      {!isTitleBeingUpdated ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setTitleBeingUpdated(true)}
          >
            {title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onItemDelete(id)}
          >
            ×
          </button>
        </>
      ) : (
        <form
          onSubmit={event =>
            onItemTitleUpdate(event, id, newTitle, setTitleBeingUpdated)
          }
          onBlur={event =>
            onItemTitleUpdate(event, id, newTitle, setTitleBeingUpdated)
          }
        >
          <input
            type="text"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            disabled={isLoading}
            autoFocus
          />
        </form>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
