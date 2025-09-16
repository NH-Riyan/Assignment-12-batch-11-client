import { NavLink, Outlet } from "react-router";
import Navbar from "../Components/Navbar/Navbar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar at the top */}
      <Navbar />

      {/* Sidebar + Main Content under navbar */}
      <div className="flex flex-1 bg-emerald-200">
        {/* Sidebar */}
        <aside className="w-64 bg-base-300 p-5 ">
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
            <li>
              <NavLink
                to="/dashboard/announcements"
                className={({ isActive }) =>
                  isActive ? "bg-primary text-white p-2 rounded" : "p-2 rounded"
                }
              >
                Make Announcements
              </NavLink>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-base-300">
          <Outlet /> {/* Nested routes render here */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
