import { AppRouter } from "@/server/routers/_app";
import { inferRouterOutputs } from "@trpc/server";
import { FormEvent, useRef, useState } from "react";
import { trpc } from "../utils/trpc";
import { Icon } from "@iconify/react";

type Todo = inferRouterOutputs<AppRouter>["todo"]["list"][0];

const TodoCreator = () => {
  const context = trpc.useContext();
  const addTodo = trpc.todo.create.useMutation({
    onSuccess() {
      context.todo.list.invalidate();
    },
  });

  const [title, setTitle] = useState("");
  const [description, setDecsription] = useState("");
  const [deadline, setDeadline] = useState<string | undefined>(undefined);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLInputElement>(null);
  const deadlineInputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const todo = await addTodo.mutateAsync({ title, description, deadline });
    setTitle("");
    setDecsription("");
    setDeadline(undefined);
    if (titleInputRef.current) titleInputRef.current.value = "";
    if (descriptionInputRef.current) descriptionInputRef.current.value = "";
    if (deadlineInputRef.current) deadlineInputRef.current.value = "";
  };

  return (
    <>
      <h2>Create Todo</h2>
      <form className="todo-add-form" onSubmit={onSubmit}>
        <div className="input-group">
          <label>Title</label>
          <input
            type="text"
            ref={titleInputRef}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Description</label>
          <input
            type="text"
            ref={descriptionInputRef}
            onChange={(event) => setDecsription(event.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Deadline</label>
          <input
            type="date"
            ref={deadlineInputRef}
            onChange={(event) => setDeadline(event.target.value)}
          />
        </div>

        <button className="todo-add-button" type="submit">
          Add
        </button>
      </form>
    </>
  );
};

const Todo = ({ todo }: { todo: Todo }) => {
  const context = trpc.useContext();
  const deleteTodo = trpc.todo.delete.useMutation({
    onSuccess() {
      context.todo.list.invalidate();
    },
  });
  const editTodo = trpc.todo.update.useMutation({
    onSuccess() {
      context.todo.list.invalidate();
    },
  });

  return (
    <div className="todo">
      <input
        className="todo-checkbox"
        type="checkbox"
        checked={todo.completed}
        onChange={(event) => {
          editTodo.mutate({
            ...todo,
            completed: event.target.checked,
            deadline: todo.deadline ?? undefined,
          });
        }}
      />
      <div className="todo-content">
        <span className="todo-title">
          {todo.title}
          {todo.deadline && (
            <span className="todo-date">
              {new Date(todo.deadline).toLocaleDateString()}
            </span>
          )}
        </span>
        <span className="todo-description">{todo.description}</span>
      </div>
      <a
        className="todo-delete-button"
        onClick={() => deleteTodo.mutate(todo.id)}
      >
        <Icon icon="mdi:bin" />
      </a>
    </div>
  );
};

const TodoList = ({ todos }: { todos: Todo[] }) => (
  <div className="todo-list">
    <h2>Todo List</h2>
    {todos.map((todo) => (
      <Todo key={todo.id} todo={todo} />
    ))}
  </div>
);

export default function IndexPage() {
  const todos = trpc.todo.list.useQuery();

  if (!todos.data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1 className="page-title">Todos</h1>
      <TodoCreator />
      <TodoList todos={todos.data} />
    </div>
  );
}
