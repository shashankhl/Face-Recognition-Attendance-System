import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../store/auth-context";

import classes from "./Navigation.module.css";
const Navigation = () => {
  const ctx = useContext(AuthContext);

  return (
    <nav className={classes.nav}>
      <ul>
        {!ctx.isLoggedIn && (
          <li>
            <Link to="/">Home</Link>
          </li>
        )}
        {!ctx.isLoggedIn && (
          <li>
            <Link to="/signup" id="signup">
              Register
            </Link>
          </li>
        )}
        {!ctx.isLoggedIn && (
          <li>
            <Link to="/login" id="logout">
              <button>Login</button>
            </Link>
          </li>
        )}
        {ctx.isLoggedIn && (
          <li>
            <Link to=".." relative="path" id="signup">
              back
            </Link>
          </li>
        )}

        {ctx.isLoggedIn && (
          <li>
            <Link to="/" id="logout">
              <button onClick={ctx.onLogout}>Logout</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
