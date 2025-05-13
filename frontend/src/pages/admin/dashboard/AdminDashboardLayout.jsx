import React from 'react'
import AdminHeaders from './AdminHeader'
import AdminSidebar from './AdminSidebar'
import { Outlet } from 'react-router-dom'
import '../../../style/AdminDashboard.scss'


export const AdminDashboardLayout = ({ title }) => {
  return (
    <div className="layout">
        <AdminHeaders title={title}/>

        <div className="dashboard">
            <div className="side">
                <AdminSidebar />
            </div>

            <div className="content">
                <Outlet />
            </div>
        </div>
    </div>
  )
}
