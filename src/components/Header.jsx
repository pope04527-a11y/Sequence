// src/components/Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import menuIcon from "../assets/images/header/menu.svg";
import refreshIcon from "../assets/images/header/logout.svg";
import logo from "../assets/images/header/logo_black.png";
import "./Header.css"; // optional, only if you put CSS separately

/**
 * Header Component
 * @param {function} onMenuClick - function to trigger Sidebar open
 * @param {boolean} disableMenu - when true, disables the hamburger button
 *
 * Behaviours added:
 * - Clicking the logo navigates to the dashboard page ("/dashboard").
 * - Clicking the logout icon navigates to the logout route ("/logout").
 */
export default function Header({ onMenuClick, disableMenu = false }) {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    // Navigate to dashboard when logo is clicked
    navigate("/dashboard");
  };

  const handleLogoutClick = () => {
    // Navigate to logout page/component when logout icon is clicked
    navigate("/logout");
  };

  return (
    <header className="header">
      <div className="header-bar">
        {/* Hamburger menu icon */}
        <img
          src={menuIcon}
          alt="Menu"
          className={`header-icon ${disableMenu ? "disabled" : ""}`}
          onClick={disableMenu ? undefined : onMenuClick}
          style={{
            cursor: disableMenu ? "not-allowed" : "pointer",
            opacity: disableMenu ? 0.5 : 1,
          }}
        />

        {/* Logo - clicking navigates to dashboard */}
        <div
          className="header-logo-wrap"
          role="button"
          tabIndex={0}
          onClick={handleLogoClick}
          onKeyPress={(e) => {
            if (e.key === "Enter" || e.key === " ") handleLogoClick();
          }}
          style={{ cursor: "pointer" }}
        >
          <img src={logo} alt="Sequence Logo" className="header-logo" />
        </div>

        {/* Refresh / logout - clicking navigates to logout component */}
        <img
          src={refreshIcon}
          alt="Logout"
          className="header-icon"
          onClick={handleLogoutClick}
          style={{ cursor: "pointer" }}
        />
      </div>
    </header>
  );
}