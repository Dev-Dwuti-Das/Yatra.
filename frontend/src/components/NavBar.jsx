import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function NavBar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="lux-nav mb-10 flex flex-wrap items-center gap-4 sm:flex-nowrap">
      <Link to="/listings" className="brand-mark text-4xl leading-none md:text-5xl">
        Yatra<span>.</span>
      </Link>

      <nav className="ml-0 flex items-center gap-6 sm:ml-8">
        <Link to="/listings" className="nav-link text-sm md:text-base">
          Villas
        </Link>
        <Link to="/create-listing" className="nav-link text-sm md:text-base">
          Host
        </Link>
      </nav>

      <div className="ml-auto">
        {isAuthenticated ? (
          <button className="btn-lux-solid" type="button" onClick={logout}>
            Logout
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <Link className="btn-lux-ghost" to="/register">
              Sign up
            </Link>
            <Link className="btn-lux-solid" to="/login">
              Login
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default NavBar;
