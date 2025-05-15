import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../style/OrderHistory.scss";
import { decodedToken } from "../../../Services/getToken ";
import { fetchOrdersByClientId } from "../../../Services/orderService";

const OrderHistory = () => {
  const [groupedOrders, setGroupedOrders] = useState({});
  const [expanded, setExpanded] = useState({});
  const clientId = decodedToken()?.userId;

  // const URLForPhotoPath = `E:/photo_studio/server-side/uploads`
  const URLForPhotoPath = `http://localhost:4000/uploads`


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetchOrdersByClientId(clientId);
        const data = response.data.enrichedOrderDetails || [];

        // Group orders by orderId
        const grouped = data.reduce((acc, order) => {
          if (!acc[order.orderId]) {
            acc[order.orderId] = [];
          }
          acc[order.orderId].push(order);
          return acc;
        }, {});
console.log("ggg :", grouped)
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

  return (
    <div className="order-history-container">
      <h2>Order History</h2>
      <div className="order-grid">
        {Object.entries(groupedOrders).map(([orderId, items]) => (
          <div key={orderId} className="order-card">
            <div className="order-header">
              <span><strong>Order ID:</strong> {orderId}</span>
              <span><strong>Order Date:</strong> {new Date(items[0].createdAt).toLocaleDateString()}</span>
            </div>

            {items.map((item, index) => (
              <div key={item.orderDetailsId} className="order-item">
                <div className="item-left">
                  <img
                    src={`${URLForPhotoPath}/${item.photosPaths[0] || item.serviceDetails.photoPaths[0]}`}
                    alt="Service"
                    className="service-img"
                  />
                </div>
                <div className="item-right">
                  <p><strong>Status:</strong> {item.status}</p>
                  <p><strong>Service:</strong> {item.serviceDetails?.serviceName}</p>
                  <div className="buttons">
                    <button onClick={() => toggleDetails(orderId)}>
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
