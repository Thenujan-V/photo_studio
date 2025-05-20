import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import Logout from "./pages/Logout";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { ServiceDetails } from "./pages/ServiceDetails";
import AddToCard from "./pages/user/AddToCard";
import ProtectedRoute from "./components/ProtectedRoute";
import ConfirmOrder from "./pages/user/ConfirmOrder";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardLayout from "./pages/user/user-dashboard/DashboardLayout";
import UserAccount from "./pages/user/user-dashboard/UserAccount";
import Notifications from "./pages/user/user-dashboard/Notifications";
import OrderHistory from "./pages/user/user-dashboard/OrderHistory";
import ChangePassword from "./pages/user/user-dashboard/ChangePassword";
import ChangeMail from "./pages/user/user-dashboard/ChangeMail";
import { AdminDashboardLayout } from "./pages/admin/dashboard/AdminDashboardLayout";
import ViewUsers from "./pages/admin/dashboard/ViewUsers";
import Inquiry from "./pages/admin/dashboard/Inquiry";
import Feedbacks from "./pages/admin/dashboard/Feedbacks";
import LiveOrders from "./pages/user/user-dashboard/LiveOrders";
import AdminOrderHistory from "./pages/admin/dashboard/AdminOrderHistory";
import AdminLiveOrders from "./pages/admin/dashboard/AdminLiveOrders";
import AddServices from "./pages/admin/dashboard/AddServices";
import PhotosView from "./pages/PhotosView";
import DisplayInvoice from "./pages/user/DisplayInvoice";
import EditServices from "./pages/admin/dashboard/EditServices";
import PaymentDetails from "./pages/admin/dashboard/PaymentDetails";
import DashBoardGraphs from "./pages/admin/dashboard/DashBoardGraphs";
import Unauthorized from "./components/Unauthorized";
import CustomizedPhotos from "./pages/admin/dashboard/CustomizedPhotos";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:categoryId" element={<ServiceDetails />} />
          <Route path="/view-service-photos" element={<PhotosView />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
            <Route path="/add-to-cart" element={<AddToCard />} />
            <Route path="/confirmOrder" element={<ConfirmOrder />} />
            <Route path="/display-invoice" element={<DisplayInvoice />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
            <Route
              path="/dashboard"
              element={<DashboardLayout title="My Dashboard" />}
            >
              <Route
                path="profile"
                element={<UserAccount title="My Profile" />}
              />
              <Route index element={<Navigate to="profile" replace />} />
              <Route
                path="orders"
                element={<OrderHistory title="My Orders" />}
              />
              <Route
                path="notifications"
                element={<Notifications title="Notifications" />}
              />
              <Route
                path="live-orders"
                element={<LiveOrders title="Live Orders" />}
              />
              <Route
                path="change-mail"
                element={<ChangeMail title="Change E-mail" />}
              />
              <Route
                path="change-password"
                element={<ChangePassword title="Change Password" />}
              />
              <Route path="logout" element={<Logout title="Logout" />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route
              path="/adminDashboard"
              element={<AdminDashboardLayout title="Admin Dashboard" />}
            >
              <Route
                path="business-overview"
                element={<DashBoardGraphs title="Business Overview" />}
              />
              <Route
                index
                element={<Navigate to="business-overview" replace />}
              />
              <Route path="users" element={<ViewUsers title="View Users" />} />
              <Route
                path="inquiry"
                element={<Inquiry title="View Inquiry" />}
              />
               <Route
                path="customized-photos"
                element={<CustomizedPhotos title="Customized Photos" />}
              />
              <Route
                path="feedbacks"
                element={<Feedbacks title="View Feddbacks" />}
              />
              <Route
                path="order-history"
                element={<AdminOrderHistory title="All Orders" />}
              />
              <Route
                path="live-orders"
                element={<AdminLiveOrders title="All Live Orders" />}
              />
              <Route
                path="add-services"
                element={<AddServices title="All Live Orders" />}
              />
              <Route
                path="edit-services"
                element={<EditServices title="Edit Services" />}
              />
              <Route
                path="payments-details"
                element={<PaymentDetails title="Payments Details" />}
              />
              <Route path="logout" element={<Logout title="Logout" />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
