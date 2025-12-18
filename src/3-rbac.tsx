import { type FC } from "react";

import { hasPermission, type User } from "./lib/auth-rbac";

const user: User = { roles: ["admin"], id: "1" };

const Page: FC = () => {
  return (
    <div className="card">
      <div className="card-title pt-2 fs-4">留言</div>
      <div className="card-body">一些隨機的評論</div>

      {/* 刪除按鈕的邏輯判斷 */}

      {hasPermission(user, "delete:comments") && (
        <div className="card-footer">
          <a className="btn btn-danger">刪除</a>
        </div>
      )}
    </div>
  );
};

export default Page;
