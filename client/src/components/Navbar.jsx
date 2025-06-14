import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">SkillSwap</Link>

      <div className="space-x-6">
        <Link to="/explore" className="hover:text-blue-600 font-medium">Explore</Link>

        

         {user && (
          <Link to="/publish" className="hover:text-blue-600 font-medium">
            Publish Skill
          </Link>
        )}

        {user ? (
          <>
            <Link to="/profile" className="hover:text-blue-600 font-medium">Hi, {user.name}</Link>
            <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-600 font-medium">Login</Link>
            <Link to="/signup" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
