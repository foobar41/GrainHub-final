import React from "react";
import "./topbar.css";
import { ExitToApp } from "@material-ui/icons";
import { logoutUser } from "../../redux/apiCalls";
import { useDispatch } from "react-redux";

export default function Topbar() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    logoutUser(dispatch);
    window.location.href = "http://localhost:3001"
  };

  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <span className="logo">Admin</span>
        </div>
        <div className="topRight">
          <div onClick={handleLogout} className="topbarIconContainer">
            <ExitToApp />
            <h4>Logout</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
