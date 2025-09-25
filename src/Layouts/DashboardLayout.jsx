import { NavLink, Outlet } from "react-router";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import useUserRole from "../Components/Hooks/useUserRole";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

const DashboardLayout = () => {
  const { role, roleLoading } = useUserRole();
  const {loading}=useContext(AuthContext)
  console.log(role)

  if (roleLoading || loading) {
    return <p>Loading role...</p>;
  }


  return (
    <div className="min-h-screen flex flex-col">


      <Navbar />

      <div className="flex flex-1 bg-emerald-200">

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
            { !roleLoading && role !== 'admin' &&
              <>
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
              </>
            }
            {!roleLoading && role === 'admin' &&
              <>
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
                <li>
                  <NavLink
                    to="/dashboard/reports"
                    className={({ isActive }) =>
                      isActive ? "bg-primary text-white p-2 rounded" : "p-2 rounded"
                    }
                  >
                    Reports
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/manageusers"
                    className={({ isActive }) =>
                      isActive ? "bg-primary text-white p-2 rounded" : "p-2 rounded"
                    }
                  >
                    Manage Users
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/banusers"
                    className={({ isActive }) =>
                      isActive ? "bg-primary text-white p-2 rounded" : "p-2 rounded"
                    }
                  >
                    Ban Users
                  </NavLink>
                </li>
              </>
            }
          </ul>
        </aside>

        <main className="flex-1 p-6 bg-base-300">
          <Outlet />
        </main>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default DashboardLayout;
