import React from "react";
import { Outlet } from 'react-router-dom'
import { Link } from "react-router-dom";

export const Layout: React.FC = () => {
    return  (
        <div>
        <p>This is our Layout</p>

        <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/work">Work</Link>
        </li>
        </ul>
        <Outlet />
    </div>
    );
};