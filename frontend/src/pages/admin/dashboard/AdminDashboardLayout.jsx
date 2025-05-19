import React from "react";
import AdminHeaders from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";
import "../../../style/AdminDashboard.scss";

export const AdminDashboardLayout = ({ title }) => {
  return (
    <div className="layout">
      <AdminHeaders title={title} />

      <div className="dashboard">
        <div className="side">
          <AdminSidebar />
        </div>

        <div className="content">
          <Outlet />
        </div>
      </div>
      <footer
        style={{ textAlign: "center", padding: "10px", fontSize: "14px", backgroundColor: "#bd2752", fontWeight: "700", color: "rgb(245, 222, 222)" }}
      >
        © 2025 JUNIOPIX Studio. All rights reserved.
      </footer>
    </div>
  );
};
