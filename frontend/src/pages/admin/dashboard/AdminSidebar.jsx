import React from 'react'
import "../../../style/AdminSidebar.scss"
import { NavLink } from 'react-router-dom'

const AdminSidebar = () => {
  return (
    <div className="sidebar">
      <nav className="sidebar-top">
        <div className='user mt-2'>
            <div className='image'>
                A
            </div>
            <div className='name'>
                <p className='fst-italic' >Hello,</p>
                <p className='fw-bold'>Administrator</p>
            </div>
        </div>
        <NavLink to="/adminDashboard/users" className= 'block' >View Users</NavLink>
        <NavLink to="/adminDashboard/inquiry" className= 'block' >Inquiries</NavLink>
        <NavLink to="/adminDashboard/feedbacks" className= 'block' >Feedbacks</NavLink>
        <NavLink to="/adminDashboard/customized-photos" className= 'block' >Customized Photos</NavLink>
        <NavLink to="/adminDashboard/live-orders" className= 'block' >Live Orders</NavLink>
        <NavLink to="/adminDashboard/paymentsadminDashboard" className= 'block' >Payment Details</NavLink>
        <NavLink to="/adminDashboard/order-history" className= 'block' >Order History</NavLink>
        
      </nav>
      <nav className="sidebar-bottom">
        <NavLink to="/adminDashboard/add-services" className= 'block' >Upload Services</NavLink>
        <NavLink to="/adminDashboard/Edit Services" className= 'block' >Edit Service Details</NavLink>
        <NavLink to="/adminDashboard/Logout" className= 'block' >Logout</NavLink>
      </nav>
    </div>
  )
}

export default AdminSidebar