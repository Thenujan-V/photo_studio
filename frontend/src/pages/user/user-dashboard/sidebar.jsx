import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import "../../../style/sidebar.scss"
import { decodedToken } from '../../../Services/getToken '
import { userDetails } from '../../../Services/userService'

const Sidebar = () => {
  const token = decodedToken()
  const clientId = token.userId
  const [user, setUser] = useState([])

  useEffect(() => {
    const fetchUserData = async () => {
      const result = await userDetails(clientId)
        console.log(result.existingClient[0])
        setUser(result.existingClient[0])
      
    }
    if(clientId){
      fetchUserData()
    }
  }, [clientId])
  return (
    <div className="sidebar">
      <nav className="sidebar-top">
        <div className='user mt-2'>
            <div className='image'>
                {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className='name'>
                <p className='fst-italic' >Hello,</p>
                <p className='fw-bold text-capitalize'>{user?.username}</p>
            </div>
        </div>
        <NavLink to="/dashboard/profile" className= 'block' >Profile</NavLink>
        <NavLink to="/dashboard/orders" className= 'block' >Order History</NavLink>
        <NavLink to="/dashboard/live-orders" className= 'block' >Live Orders</NavLink>
        <NavLink to="/dashboard/notifications" className= 'block' >Notifications</NavLink>
        <NavLink to="/dashboard/change-mail" className= 'block' >Change E-mail</NavLink>
        <NavLink to="/dashboard/change-password" className= 'block' >Change Password</NavLink>
        <NavLink to="/dashboard/logout" className= 'block' >Logout</NavLink>
      </nav>
      <nav className="sidebar-bottom">
        <NavLink to="/" className= 'block' >Privacy & Policy</NavLink>
        <NavLink to="/" className= 'block' >Terms & Conditions</NavLink>
        <NavLink to="/" className= 'block' >Support</NavLink>
        <NavLink to="/" className= 'block' >Help</NavLink>

      </nav>
    </div>
  )
}

export default Sidebar