import { Link } from 'react-router-dom';

export const NavBar: React.FC = () => {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link className="btn btn-ghost normal-case text-xl" to="/">
          Journal
        </Link>
      </div>

      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/statistics">Reflect!</Link>
          </li>
          <li>
            <Link to="/settings">Set Questions</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
