import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import InlinePermission from "./1-inline";
import RBACPermissionSingle from "./2-rbac-single-role";
import RBACPermission from "./3-rbac";
import ABACPermission from "./4-abac";

const App = () => {
  return (
    <Router>
      <nav className="p-3 border-bottom">
        <Link to="/" className="me-3">
          Inline
        </Link>
        <Link to="/rbac-single" className="me-3">
          RBAC Single Role
        </Link>
        <Link to="/rbac" className="me-3">
          RBAC
        </Link>
        <Link to="/abac" className="me-3">
          ABAC
        </Link>
      </nav>
      <div className="p-3">
        <Routes>
          <Route path="/" element={<InlinePermission />} />
          <Route path="/rbac-single" element={<RBACPermissionSingle />} />
          <Route path="/rbac" element={<RBACPermission />} />
          <Route path="/abac" element={<ABACPermission />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
