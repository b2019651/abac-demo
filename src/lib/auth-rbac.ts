export type User = { roles: Role[]; id: string };

export type Role = keyof typeof ROLES;
type Permission = (typeof ROLES)[Role][number];

const ROLES = {
  admin: [
    "view:comments",
    "create:comments",
    "update:comments",
    "delete:comments",
  ],
  moderator: ["view:comments", "create:comments", "delete:comments"],
  user: ["view:comments", "create:comments"],
} as const;

export function hasPermission(user: User, permission: Permission) {
  return user.roles.some((role) =>
    (ROLES[role] as readonly Permission[]).includes(permission)
  );
}

// 用法:
const user: User = { id: "1", roles: ["user"] };

// 可以創建評論
hasPermission(user, "create:comments");

// 可以查看所有評論
hasPermission(user, "view:comments");
