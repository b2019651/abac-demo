import { type FC } from "react";
import { FaCheck, FaPencilAlt } from "react-icons/fa";

import { hasPermission, type Todo, type User } from "./lib/auth-abac";

const todos: Todo[] = [
  {
    id: "1",
    title: "洗衣服",
    userId: "1",
    completed: false,
    invitedUsers: [],
  },
  {
    id: "2",
    title: "洗碗",
    userId: "1",
    completed: true,
    invitedUsers: [],
  },
  {
    id: "3",
    title: "遛狗",
    userId: "2",
    completed: false,
    invitedUsers: [],
  },
  {
    id: "4",
    title: "吃晚餐",
    userId: "2",
    completed: true,
    invitedUsers: ["1", "3"],
  },
];

const user: User = { roles: ["user"], id: "3", blockedBy: ["2"] };

const Page: FC = () => {
  return (
    <div className="container mx-auto px-4 my-6">
      <h1 className="text-start fw-bold">
        {user.id}: {user.roles.join(", ")}
      </h1>
      <div className="d-flex gap-4 mb-4">
        <GeneralButtonCheck resource="todos" action="view" />
        <GeneralButtonCheck resource="todos" action="create" />
        <GeneralButtonCheck resource="todos" action="update" />
        <GeneralButtonCheck resource="todos" action="delete" />
      </div>
      <div className="row row-cols-1 row-cols-sm-2 g-4">
        {todos.map((todo) => (
          <div key={todo.id} className="col">
            <Todo {...todo} />
          </div>
        ))}
      </div>
    </div>
  );
};

const Todo: FC<Todo> = (todo) => {
  const { title, userId, completed, invitedUsers } = todo;
  return (
    <div className="card text-start">
      <div className="card-title">
        <div className="d-flex align-items-center px-2 pt-2">
          {completed ? (
            <FaCheck className="text-success" size={20} />
          ) : (
            <FaPencilAlt className="text-danger" size={20} />
          )}
          <span className="fs-4 fw-bold ms-2">{`${todo.id}. ${title}`}</span>
        </div>
      </div>
      <div className="card-body text-secondary">
        Uesr {userId}
        {invitedUsers.length > 0 && ` + User ${invitedUsers.join(", User")}`}
      </div>
      <div className="card-footer d-flex justify-content-around">
        <TodoButtonCheck todo={todo} action="view" />
        <TodoButtonCheck todo={todo} action="update" />
        <TodoButtonCheck todo={todo} action="delete" />
      </div>
    </div>
  );
};

const GeneralButtonCheck: FC<{
  resource: "todos" | "comments";
  action: "view" | "create" | "update" | "delete";
}> = ({ resource, action }) => {
  return (
    <button
      className={`btn btn-primary`}
      disabled={!hasPermission(user, resource, action)}
    >
      {action} any
    </button>
  );
};

const TodoButtonCheck: FC<{
  todo: Todo;
  action: "view" | "update" | "delete";
}> = ({ todo, action }) => {
  return (
    <button
      className={`btn btn-primary`}
      disabled={!hasPermission(user, "todos", action, todo)}
    >
      {action}
    </button>
  );
};

export default Page;
