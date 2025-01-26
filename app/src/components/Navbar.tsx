import { Link } from 'react-router-dom';


export const NavBar: React.FC = () => {
  return (
    <nav className="navbar bg-base-100">
      <div className="flex-1">
        <Link className="btn btn-ghost normal-case text-3xl" to="/">
          Journal
        </Link>
      </div>

      {/* flex-none nimmt nur platz ein den es benötigt*/}
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 space-x-4">
          <li>
            <Link
              to="/reflections"
              className="btn btn-outline btn-primary text-lg"
            >
              Reflections
            </Link>
          </li>
          <li>
            <Link
              to="/questions"
              className="btn btn-outline btn-primary text-lg"
            >
              Manage Questions
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
