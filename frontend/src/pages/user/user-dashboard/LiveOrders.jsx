import React, { useEffect, useState } from "react";
import "../../../style/LiveOrders.scss";
import { decodedToken } from "../../../Services/getToken ";
import { fetchOrdersByClientId } from "../../../Services/orderService";

const LiveOrders = () => {
  const [groupedOrders, setGroupedOrders] = useState({});
  const clientId = decodedToken()?.userId;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetchOrdersByClientId(clientId);
        const data = response.data.enrichedOrderDetails || [];

        const excludedStatuses = ["delivered", "cancelled"];
        const processingOrders = data.filter(
          (order) => !excludedStatuses.includes(order.status)
        );

        const grouped = processingOrders.reduce((acc, order) => {
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

  const orderIds = Object.keys(groupedOrders);

  return (
    <div className="live-orders">
      <h2>Live Orders</h2>
        {Object.entries(groupedOrders).map(([orderId, items]) => (
            <div key={orderId} className="order-card">
              <div className="order-header">
                <span>Order ID: {orderId}</span>
                <span>{new Date(items[0].createdAt).toLocaleDateString()}</span>
              </div>
              <hr />
              {items.map((item, index) => (
              <div className="order-body">
                <img src={`/uploads/${item.photosPaths[0] || item.serviceDetails.photoPaths[0]}`} alt= {item.serviceDetails?.serviceName} />
                <div className="order-info">
                  <h3> {item.serviceDetails?.serviceName}</h3>
                  <p> {item.serviceCategory}</p>
                  <p>
                    Price x Qty: Rs. {item.serviceDetails?.servicePrice} x {item.quantity}
                  </p>
                </div>
                <div className="order-status">
                  <button className="status-btn">{item.status}</button>
                </div>
              </div>))}
            </div>))}
    </div>
  );
};

export default LiveOrders;
