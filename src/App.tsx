/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';

import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { TempTodo } from './components/TempTodo/TempTodo';
import { Footer } from './components/Footer/Fotter';
import { Error } from './components/Error/Erros';
import { getTodos, addTodo, deleteTodo, updateTodo } from './api/todos';

import { Todo } from './types/Todo';
import { TodoStatus } from './types/Status';

function filterTodos(todos: Todo[], status: TodoStatus) {
  const todosCopy = [...todos];

  switch (status) {
    case TodoStatus.active:
      return todosCopy.filter(todo => !todo.completed);
    case TodoStatus.completed:
      return todosCopy.filter(todo => todo.completed);
    case TodoStatus.all:
      return todosCopy;
  }
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState<TodoStatus>(TodoStatus.all);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processedIs, setProcessedIs] = useState<number[]>([]);
  const areAllTodosCompleted = todos.every(todo => todo.completed);
  const noTodos = todos.length === 0;
  const filteredTodos = filterTodos(todos, status);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const normalizeTitle = title.trim();

    if (!normalizeTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setLoading(true);
    const newTodo = {
      userId: 2042,
      title: normalizeTitle,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    addTodo(newTodo)
      .then(response => {
        setTitle('');
        setTodos(existing => [...existing, response]);
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
      });
  };

  const handleDeleteOneTodo = (id: number) => {
    setLoading(true);
    setProcessedIs(existing => [...existing, id]);
    deleteTodo(id)
      .then(() => {
        setTodos(existing => existing.filter(current => current.id !== id));
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setLoading(false);
        setProcessedIs([]);
      });
  };

  const handleDeleteCompletedTodos = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        setLoading(true);
        setProcessedIs(existing => [...existing, todo.id]);
        deleteTodo(todo.id)
          .then(() =>
            setTodos(existing =>
              existing.filter(current => current.id !== todo.id),
            ),
          )
          .catch(() => setErrorMessage('Unable to delete a todo'))
          .finally(() => {
            setLoading(false);
            setProcessedIs(existing => existing.filter(id => id !== todo.id));
          });
      }
    });
  };

  const handleStatusUpdate = (id: number) => {
    setLoading(true);
    setProcessedIs(existing => [...existing, id]);

    const changeItem = todos.find(todo => todo.id === id);

    if (changeItem) {
      const toUpdate = { completed: !changeItem.completed };

      updateTodo(id, toUpdate)
        .then(() => {
          setTodos(existing =>
            existing.map(el =>
              el.id === id ? { ...el, completed: toUpdate.completed } : el,
            ),
          );
        })
        .catch(() => setErrorMessage('Unable to update a todo'))
        .finally(() => {
          setLoading(false);
          setProcessedIs([]);
        });
    }
  };

  const handleTotalStatusUpdate = () => {
    if (!areAllTodosCompleted) {
      todos.forEach(todo => {
        if (!todo.completed) {
          setLoading(true);
          setProcessedIs(existing => [...existing, todo.id]);
          const toUpdate = { completed: true };

          updateTodo(todo.id, toUpdate)
            .then(() => {
              setTodos(existing =>
                existing.map(el =>
                  el.id === todo.id
                    ? { ...el, completed: toUpdate.completed }
                    : el,
                ),
              );
            })
            .catch(() => setErrorMessage('Unable to update a todo'))
            .finally(() => {
              setLoading(false);
              setProcessedIs(existing => existing.filter(id => id !== todo.id));
            });
        }
      });
    }

    if (areAllTodosCompleted) {
      todos.forEach(todo => {
        setLoading(true);
        setProcessedIs(existing => [...existing, todo.id]);
        const toUpdate = { completed: false };

        updateTodo(todo.id, toUpdate)
          .then(() => {
            setTodos(existing =>
              existing.map(el =>
                el.id === todo.id
                  ? { ...el, completed: toUpdate.completed }
                  : el,
              ),
            );
          })
          .catch(() => setErrorMessage('Unable to update a todo'))
          .finally(() => {
            setLoading(false);
            setProcessedIs(existing => existing.filter(id => id !== todo.id));
          });
      });
    }
  };

  const handleTitleUpdate = (
    e: React.FormEvent<HTMLFormElement>,
    id: number,
    newTitle: string,
    setTitleBeingUpdated: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    e.preventDefault();

    const normalizeNewTitle = newTitle.trim();
    const isTitleChanged = normalizeNewTitle !== title;

    if (!normalizeNewTitle.length) {
      handleDeleteOneTodo(id);

      return;
    }

    if (!isTitleChanged) {
      return;
    }

    const changeItem = todos.find(todo => todo.id === id);
    const toUpdate = { title: normalizeNewTitle };

    if (changeItem) {
      setLoading(true);
      setProcessedIs(existing => [...existing, id]);
      updateTodo(id, toUpdate)
        .then(() => {
          setTodos(existing =>
            existing.map(el =>
              el.id === id ? { ...el, title: toUpdate.title } : el,
            ),
          );
        })
        .catch(() => setErrorMessage('Unable to update a todo'))
        .finally(() => {
          setLoading(false);
          setProcessedIs([]);
          setTitleBeingUpdated(false);
        });
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          allTodosCompleted={areAllTodosCompleted}
          noTodos={noTodos}
          onSubmit={handleSubmit}
          loading={loading}
          title={title}
          onTitleChange={value => setTitle(value)}
          onTotalStatusUpdate={handleTotalStatusUpdate}
        />

        <TodoList
          filteredTodos={filteredTodos}
          onDelete={handleDeleteOneTodo}
          onStatusUpdate={handleStatusUpdate}
          onUpdatedTitleSubmit={handleTitleUpdate}
          loading={loading}
          processedIs={processedIs}
        />

        {tempTodo && <TempTodo todo={tempTodo} />}

        {!noTodos && (
          <Footer
            todos={todos}
            status={status}
            onStatusChange={(value: TodoStatus) => setStatus(value)}
            clearCompletedTodos={handleDeleteCompletedTodos}
          />
        )}
      </div>

      <Error errorMessage={errorMessage} hideError={setErrorMessage} />
    </div>
  );
};
