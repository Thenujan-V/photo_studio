import React from "react";
import Invoice from "../../components/Invoice";
import AppNavbar from "../../components/Navbar";
import AppFooter from "../../components/footer";
import { useLocation } from "react-router-dom";

const DisplayInvoice = () => {
  const location = useLocation();
  const { orderDetails, paymentMethod, deliveryDetails } = location.state || [];
  console.log(orderDetails, paymentMethod, deliveryDetails);
  return (
    <div>
      <AppNavbar />
      <Invoice details={{ orderDetails, paymentMethod, deliveryDetails }} />
      <AppFooter />
    </div>
  );
};

export default DisplayInvoice;
