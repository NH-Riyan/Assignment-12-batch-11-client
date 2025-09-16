import { NavLink, Outlet } from "react-router";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-base-200 p-5">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <ul className="menu space-y-2">
          <li>
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                isActive ? "bg-primary text-white p-2 rounded" : "p-2 rounded"
              }
            >
              My Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/addpost"
              className={({ isActive }) =>
                isActive ? "bg-primary text-white p-2 rounded" : "p-2 rounded"
              }
            >
              Add Post
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/myposts"
              className={({ isActive }) =>
                isActive ? "bg-primary text-white p-2 rounded" : "p-2 rounded"
              }
            >
              My Posts
            </NavLink>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-base-100">
        <Outlet /> {/* This is where nested routes will be rendered */}
      </main>
    </div>
  );
};

export default DashboardLayout;
