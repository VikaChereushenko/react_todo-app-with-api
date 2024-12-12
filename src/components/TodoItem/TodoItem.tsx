import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';

type Props = {
  id: number;
  completed: boolean;
  title: string;
  onItemDelete: (id: number) => void;
  onItemStatusUpdate: (id: number) => void;
  onItemTitleUpdate: (
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
export const TodoItem: React.FC<Props> = ({
  id,
  completed,
  title,
  onItemStatusUpdate,
  onItemDelete,
  onItemTitleUpdate,
  onKeyUp,
  processedIs,
}) => {
  const [isTitleBeingUpdated, setTitleBeingUpdated] = useState(false);
  const prevTitle = title;
  const [newTitle, setNewTitle] = useState(title);
  const isTitleChanged = prevTitle !== newTitle.trim();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTitleBeingUpdated]);

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })}>
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
      {isTitleBeingUpdated ? (
        <form
          onSubmit={event =>
            onItemTitleUpdate(
              id,
              newTitle,
              setTitleBeingUpdated,
              isTitleChanged,
              event,
            )
          }
        >
          <input
            data-cy="TodoTitleField"
            ref={inputRef}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onBlur={() =>
              onItemTitleUpdate(
                id,
                newTitle,
                setTitleBeingUpdated,
                isTitleChanged,
              )
            }
            onKeyUp={event => onKeyUp(event, setTitleBeingUpdated)}
            onChange={event => setNewTitle(event.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setTitleBeingUpdated(true)}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onItemDelete(id)}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': processedIs.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
