import React, { useEffect, useState } from "react";
import "../../../style/LiveOrders.scss";
import { decodedToken } from "../../../Services/getToken ";
import { fetchOrdersByClientId } from "../../../Services/orderService";

const LiveOrders = () => {
  const orderStatuses = [
    "All",
    "processing",
    "editing",
    "awaiting_approval",
    "reediting",
    "approved",
    "in_production",
    "ready_for_delivery",
  ];

  const [groupedOrders, setGroupedOrders] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("All");

  const clientId = decodedToken()?.userId;
  const URLForPhotoPath = process.env.REACT_APP_PHOTO_PATH_URL;

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
      <select
        className="form-select mb-3 w-25"
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
      >
        {orderStatuses.map((status) => (
          <option key={status} value={status}>
            {status === "All"
              ? "All Orders"
              : status.charAt(0).toUpperCase() +
                status.slice(1).replace("_", " ")}
          </option>
        ))}
      </select>
      {Object.entries(groupedOrders)
        .filter(
          ([orderId, items]) =>
            selectedStatus === "All" ||
            items.some((item) => item.status === selectedStatus)
        )
        .sort((a, b) => Number(b[0]) - Number(a[0]))
        .map(([orderId, items]) => (
          <div key={orderId} className="order-card">
            <div className="order-header">
              <span>Order ID: {orderId}</span>
              <span>
                <strong>Order Date:</strong>{" "}
                {new Date(items[0]?.createdAt).toLocaleDateString()}
              </span>
            </div>
            <hr />
            {items
              .filter((item) => {
                return (
                  selectedStatus === "All" || item.status === selectedStatus
                );
              })
              .map((item, index) => (
                <div className="order-body mt-2">
                  <img
                    src={`${URLForPhotoPath}/${item.serviceDetails.photoPaths[0]}`}
                    alt={item.serviceDetails?.serviceName}
                  />
                  <div className="order-info">
                    <h3> {item.serviceDetails?.serviceName}</h3>
                    <p> {item.serviceCategory}</p>
                    <p>
                      Price x Qty: Rs. {item.serviceDetails?.servicePrice} x{" "}
                      {item.quantity}
                    </p>
                  </div>
                  <div className="order-status">
                    <button className={`status-btn ${item.status}`}>
                      {item.status}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ))}
    </div>
  );
};

export default LiveOrders;
