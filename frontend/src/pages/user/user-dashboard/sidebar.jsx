import React from 'react'
import { NavLink } from 'react-router-dom'
import "../../../style/sidebar.scss"

const sidebar = () => {
  return (
    <div className="sidebar">
      <nav className="sidebar-top">
        <div className='user mt-2'>
            <div className='image'>
                U
            </div>
            <div className='name'>
                <p className='fst-italic' >Hello,</p>
                <p className='fw-bold'>USERNAME</p>
            </div>
        </div>
        <NavLink to="/dashboard/profile" className= 'block' >Profile</NavLink>
        <NavLink to="/dashboard/orders" className= 'block' >Order History</NavLink>
        <NavLink to="/dashboard/live-orders" className= 'block' >Live Orders</NavLink>
        <NavLink to="/dashboard/notifications" className= 'block' >Notifications</NavLink>
        <NavLink to="/dashboard/password" className= 'block' >Change Password</NavLink>
        <NavLink to="/dashboard/logout" className= 'block' >Logout</NavLink>
      </nav>
      <nav className="sidebar-bottom">
        <NavLink to="/dashboard/notifications" className= 'block' >Notifications</NavLink>

      </nav>
    </div>
  )
}

export default sidebar