import React from "react";
import { Link, NavLink } from "react-router-dom";

import "./TitleBar.css";

const TitleBar: React.FC = (props) => {
  return (
    <div className="titleBar">
      <div className="titleBar_page page">
        <h1 className="titleBar_title">
          <Link className="titleBar_titleLink" to="/pokemon">
            POKEDEX
          </Link>
        </h1>
        <div className="titleBar_navLinks">
          <NavLink className="titleBar_navLink" to="/pokemon">
            pokemon
          </NavLink>
          <NavLink className="titleBar_navLink" to="/regions">
            regions
          </NavLink>
          <NavLink className="titleBar_navLink" to="/locations">
            locations
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default TitleBar;
