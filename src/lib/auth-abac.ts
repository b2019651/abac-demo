/** 留言 */
type Comment = {
  /** 留言編號 */
  id: string;
  /** 留言內容 */
  body: string;
  /** 留言的作者 */
  authorId: string;
  /** 留言的創建時間 */
  createdAt: Date;
};

/** 代辦事項 */
export type Todo = {
  /** 代辦事項編號 */
  id: string;
  /** 代辦事項標題 */
  title: string;
  /** 代辦事項的作者 */
  userId: string;
  /** 代辦事項是否已完成 */
  completed: boolean;
  /** 代辦事項邀請的使用者 */
  invitedUsers: string[];
};

/** 角色 */
type Role = "admin" | "moderator" | "user";
/** 使用者 */
export type User = { blockedBy: string[]; roles: Role[]; id: string };

/** 檢查權限 (布林值或函數) */
type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((user: User, data: Permissions[Key]["dataType"]) => boolean);

/** 規則庫類型 */
type RolesWithPermissions = {
  /** 角色 */
  [R in Role]: Partial<{
    /** 權限 */
    [Key in keyof Permissions]: Partial<{
      /** 動作 */
      [Action in Permissions[Key]["action"]]: PermissionCheck<Key>;
    }>;
  }>;
};

/** 權限類型 */
type Permissions = {
  comments: {
    dataType: Comment;
    action: "view" | "create" | "update";
  };
  todos: {
    // 可以執行諸如 Pick<Todo, "userId"> 之類的操作來獲取您使用的角色
    dataType: Todo;
    action: "view" | "create" | "update" | "delete";
  };
};

/** 權限規則庫 */
const ROLES = {
  admin: {
    comments: {
      view: true,
      create: true,
      update: true,
    },
    todos: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
  },
  moderator: {
    comments: {
      view: true,
      create: true,
      update: true,
    },
    todos: {
      view: true,
      create: true,
      update: true,
      // 版主可以刪除任何待辦事項，但前提是該事項的狀態必須是 completed。
      delete: (user, todo) => todo.completed,
    },
  },
  user: {
    comments: {
      // 使用者可以查看任何留言，前提是留言的作者沒有封鎖該使用者。
      view: (user, comment) => !user.blockedBy.includes(comment.authorId),
      create: true,
      update: (user, comment) => comment.authorId === user.id,
    },
    todos: {
      view: (user, todo) => !user.blockedBy.includes(todo.userId),
      create: true,
      // 使用者可以更新一個待辦事項，只要他是創建者，或者他被邀請協作該事項。
      update: (user, todo) =>
        todo.userId === user.id || todo.invitedUsers.includes(user.id),
      delete: (user, todo) =>
        (todo.userId === user.id || todo.invitedUsers.includes(user.id)) &&
        todo.completed,
    },
  },
} as const satisfies RolesWithPermissions;

/** 檢查使用者是否擁有指定的權限 (ABAC 模型封裝) */
export function hasPermission<Resource extends keyof Permissions>(
  user: User,
  resource: Resource,
  action: Permissions[Resource]["action"],
  data?: Permissions[Resource]["dataType"]
) {
  return user.roles.some((role) => {
    const permission = (ROLES as RolesWithPermissions)[role][resource]?.[
      action
    ];
    if (permission == null) return false;

    if (typeof permission === "boolean") return permission;
    return data != null && permission(user, data);
  });
}

// 用法:
const user: User = { blockedBy: ["2"], id: "1", roles: ["user"] };
const todo: Todo = {
  completed: false,
  id: "3",
  invitedUsers: [],
  title: "Test Todo",
  userId: "1",
};

// 可以建立評論
hasPermission(user, "comments", "create"); // true

// 可以查看 `todo` 這個代辦事項
hasPermission(user, "todos", "view", todo); // ture

// 可以查看所有待辦事項
hasPermission(user, "todos", "view"); //false
