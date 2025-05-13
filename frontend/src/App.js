import './App.css';
import {BrowserRouter ,  Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Logout from './pages/Logout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { ServiceDetails } from './pages/ServiceDetails';
import AddToCard from './pages/user/AddToCard';
import ProtectedRoute from './components/ProtectedRoute';
import ConfirmOrder from './pages/user/ConfirmOrder';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardLayout from './pages/user/user-dashboard/DashboardLayout';
import UserAccount from './pages/user/user-dashboard/UserAccount';
import Notifications from './pages/user/user-dashboard/Notifications';
import OrderHistory from './pages/user/user-dashboard/OrderHistory';
import ChangePassword from './pages/user/user-dashboard/ChangePassword';
import ChangeMail from './pages/user/user-dashboard/ChangeMail';

const Unauthorized = () => <div><h2>Unauthorized - You do not have permission to access this page.</h2></div>;

function App() {
  return (
    <BrowserRouter>
    <div className="App">
    <ToastContainer />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:categoryId" element={<ServiceDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/add-to-cart" element={ <AddToCard /> } />
        <Route path="/confirmOrder" element={ <ConfirmOrder /> } />
        {/* <Route path="/useraccount" element={ <UserAccount /> } /> */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="/dashboard" element={<DashboardLayout title="My Dashboard" />}>
          <Route path="profile" element={<UserAccount title="My Profile" />} />
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="orders" element={<OrderHistory title="My Orders" />} />
          <Route path="notifications" element={<Notifications title="Notifications" />} />
          {/* <Route path="live-orders" element={<LiveOrders title="Live Orders" />} /> */}
          <Route path="change-mail" element={<ChangeMail title="Change E-mail" />} />
          <Route path="change-password" element={<ChangePassword title="Change Password" />} />
          <Route path="logout" element={<Logout title="Logout" />} />
        </Route>

        <Route path="/logout" element={<Logout />} />
      </Routes>
    </div>
  </BrowserRouter>
  );
}

export default App;
