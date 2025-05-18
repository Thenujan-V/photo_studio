import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../style/OrderHistory.scss";
import { decodedToken } from "../../../Services/getToken ";
import { fetchOrdersByClientId } from "../../../Services/orderService";
import { triggerNotification } from "../../../Services/notificationService";
import { fetchInvoice } from "../../../Services/invoiceService";

const OrderHistory = () => {
  const orderStatuses = ['All', 'processing', 'editing', 'awaiting_approval', 'reediting', 'approved', 'in_production', 'ready_for_delivery', 'delivered', 'cancelled']

  const [groupedOrders, setGroupedOrders] = useState({});
  const [expanded, setExpanded] = useState({});
  const clientId = decodedToken()?.userId;
  const [filePath, setFilePath] = useState('')
  const [selectedStatus, setSelectedStatus] = useState("All");

  const URLForPhotoPath = process.env.REACT_APP_PHOTO_PATH_URL

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetchOrdersByClientId(clientId);
        const data = response.data.enrichedOrderDetails || [];

        const grouped = data.reduce((acc, order) => {
          if (!acc[order.orderId]) {
            acc[order.orderId] = [];
          }
          acc[order.orderId].push(order);
          return acc;
        }, {});
        setGroupedOrders(grouped);
      } catch (err) {
        console.error(err);
      }
    };

    if (clientId) {
      fetchOrders();
    }
  }, [clientId]);

  const toggleDetails = (orderId) => {
    setExpanded((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const handleInvoice = async (orderId) => {
    try{
      const invoiceResult = await fetchInvoice(orderId)
      if(invoiceResult.status === 400){
        triggerNotification("There is no invoice in this orderID.","error")
        return
      }
      if(invoiceResult.status === 200){
        const invoicePath = invoiceResult.data.existingInvoice[0]?.filePath
        setFilePath(invoicePath)
        
        if (!invoicePath) {
          triggerNotification("Invoice file path not found.", "error");
          return;
        }

        const REACT_APP_PHOTO_PATH_URL = process.env.REACT_APP_PHOTO_PATH_URL
        const fullURL = `${REACT_APP_PHOTO_PATH_URL}/${invoicePath}`

        window.open(fullURL, '_blank')
      }
      console.log(invoiceResult)
    }catch(err){
      console.log("error when fetch invoice: ", err)
      triggerNotification("Error When fetch invoice","error")
    }
  }
  return (
    <div className="order-history-container">
      <h2>Order History</h2>
      <select
        className="form-select mb-3 w-25"
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
      >
        {orderStatuses.map((status) => (
          <option key={status} value={status}>
            {status === "All" ? "All Orders" : status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
          </option>
        ))}
      </select>
      <div className="order-grid">
        {Object.entries(groupedOrders)
        .filter(([orderId, items]) => selectedStatus === "All" || items.some( item => item.status === selectedStatus))
        .sort((a, b) => Number(b[0]) - Number(a[0]))
        .map(([orderId, items]) => (
          <div key={orderId} className="order-card">
            <div className="order-header">
              <div className="d-flex flex-column">
                <span><strong>Order ID:</strong> {orderId}</span>
                <span><strong>Order Date:</strong> {new Date(items[0].createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <button className="invoice-btn" onClick={() => handleInvoice(orderId)}>Invoice</button>
              </div>
            </div>

            {items
              .filter( item => { return selectedStatus === "All" || item.status === selectedStatus})
              .sort ((a,b) => b.orderDetailsId - a.orderDetailsId)
              .map((item, index) => (
                <div key={item.orderDetailsId} className="order-item">
                  <div className="item-left">
                    <img
                      src={`${URLForPhotoPath}/${item.photosPaths[0] || item.serviceDetails.photoPaths[0]}`}
                      alt="Service"
                      className="service-img"
                    />
                  </div>
                  <div className="item-right">
                    <p className="status"><strong>Status:</strong> {item.status}</p>
                    <p><strong>Service:</strong> {item.serviceDetails?.serviceName}</p>
                    <div className="buttons">
                      <button className="showDetailsBtn" onClick={() => toggleDetails(orderId)}>
                        {expanded[orderId] ? "Hide Details" : "Show Details"}
                      </button>
                    </div>
                    {expanded[orderId] && (
                      <div className="details">
                        <p><strong>Category:</strong> {item.serviceCategory}</p>
                        <p><strong>Quantity:</strong> {item.quantity}</p>
                        <p><strong>Price:</strong> Rs. {item.serviceDetails?.servicePrice * item.quantity}</p>
                        {item.color && <p><strong>Color:</strong> {item.color}</p>}
                        {item.size && <p><strong>Size:</strong> {item.size}</p>}
                        <p><strong>Description:</strong> {item.serviceDetails?.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
