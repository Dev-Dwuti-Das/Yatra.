import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function NavBar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="mb-14 flex flex-wrap items-center gap-4 sm:flex-nowrap">
      <Link
        to="/listings"
        className="text-4xl font-extrabold leading-none tracking-[-0.03em] text-slate-50 transition duration-300 hover:scale-[1.02] md:text-5xl"
      >
        Yatra<span className="text-violet-600">.</span>
      </Link>

      <nav className="ml-0 flex items-center gap-6 sm:ml-7">
        <Link
          to="/listings"
          className="relative text-sm font-semibold text-slate-50 transition hover:text-violet-300 after:absolute after:bottom-[-6px] after:left-0 after:h-[2px] after:w-0 after:bg-violet-400 after:transition-all hover:after:w-full md:text-base"
        >
          Home
        </Link>
        <Link
          to="/create-listing"
          className="relative text-sm font-semibold text-slate-50 transition hover:text-violet-300 after:absolute after:bottom-[-6px] after:left-0 after:h-[2px] after:w-0 after:bg-violet-400 after:transition-all hover:after:w-full md:text-base"
        >
          Be a host
        </Link>
      </nav>

      <div className="ml-auto">
        {isAuthenticated ? (
          <button
            className="rounded-full bg-[#6d18ff] px-4 py-2 text-sm font-bold text-white transition duration-200 hover:translate-y-[-1px] hover:bg-violet-600 active:translate-y-[1px] md:px-5 md:py-2.5 md:text-base"
            type="button"
            onClick={logout}
          >
            Logout
          </button>
        ) : (
          <Link
            className="inline-flex rounded-full bg-[#6d18ff] px-4 py-2 text-sm font-bold text-white transition duration-200 hover:translate-y-[-1px] hover:bg-violet-600 active:translate-y-[1px] md:px-5 md:py-2.5 md:text-base"
            to="/login"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}

export default NavBar;
