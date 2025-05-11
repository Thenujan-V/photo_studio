import React from 'react'
import Headers from './header'
import Sidebar from './sidebar'
import { Outlet } from 'react-router-dom'
import Navbar from '../../../components/Navbar'
import '../../../style/dashboardLayout.scss'
import AppFooter from "../../../components/footer"

const DashboardLayout = ({ title }) => {
  return (
    <div className="layout">
        <Navbar />
        <Headers title={title}/>

        <div className="dashboard">
            <div className="side">
                <Sidebar />
            </div>

            <div className="content">
                <Outlet />
            </div>
        </div>

        <AppFooter />

    </div>
  )
}

export default DashboardLayout