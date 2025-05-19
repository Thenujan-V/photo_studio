import React from "react";
import "../../../style/AdminSidebar.scss";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="sidebar">
      <nav className="sidebar-top">
        <div className="user mt-2">
          <div className="image">A</div>
          <div className="name">
            <p className="fst-italic">Hello,</p>
            <p className="fw-bold">Administrator</p>
          </div>
        </div>
        <NavLink to="/adminDashboard/business-overview" className="block mt-2" >
          Over View
        </NavLink>
        <NavLink to="/adminDashboard/customized-photos" className="block mt-2">
          Customized Photos
        </NavLink>
        <NavLink to="/adminDashboard/live-orders" className="block mt-2">
          Live Orders
        </NavLink>
        <NavLink to="/adminDashboard/payments-details" className="block mt-2">
          Payment Details
        </NavLink>
        <NavLink to="/adminDashboard/order-history" className="block mt-2">
          Order History
        </NavLink>
        <NavLink to="/adminDashboard/feedbacks" className="block mt-2">
          Feedbacks
        </NavLink>
        <NavLink to="/adminDashboard/inquiry" className="block mt-2">
          Inquiries
        </NavLink>
      </nav>
      <nav className="sidebar-bottom">
        <NavLink to="/adminDashboard/add-services" className="block mt-2">
          Upload Services
        </NavLink>
        <NavLink to="/adminDashboard/edit-services" className="block mt-2">
          Edit Service Details
        </NavLink>
        <NavLink to="/adminDashboard/users" className="block mt-2">
          View Users
        </NavLink>
        <NavLink to="/adminDashboard/Logout" className="block mt-2">
          Logout
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminSidebar;
