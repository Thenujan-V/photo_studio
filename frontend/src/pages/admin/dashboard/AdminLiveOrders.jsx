import React, { useEffect, useState } from "react";
import "../../../style/AdminLiveOrders.scss";
import {
  fetchAllOrders,
  changeOrderStatus,
} from "../../../Services/orderService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserAlt, faSearch } from "@fortawesome/free-solid-svg-icons";
import { triggerNotification } from "../../../Services/notificationService";

const AdminLiveOrders = () => {
  const orderStatuses = [
    "All",
    "editing",
    "awaiting_approval",
    "reediting",
    "approved",
    "in_production",
    "ready_for_delivery",
  ];

  const [groupedOrders, setGroupedOrders] = useState({});
  const [filteredGroupedOrders, setFilteredGroupedOrders] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState({});
  const [expanded, setExpanded] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("All");
  const URLForPhotoPath = process.env.REACT_APP_PHOTO_PATH_URL;

  const statusOptions = [
    "processing",
    "editing",
    "in_production",
    "ready_for_delivery",
    "delivered",
    "cancelled",
  ];
  useEffect(() => {
    fetchAllOrderHistory();
  }, []);

  const fetchAllOrderHistory = async () => {
    try {
      const response = await fetchAllOrders();
      const data = response.data.enrichedAllOrderDetails || [];
      const excludedStatuses = ["delivered", "cancelled"];
      const processingOrders = data.filter(
        (order) => !excludedStatuses.includes(order.status)
      );
      // Group orders by orderId
      const grouped = processingOrders.reduce((acc, order) => {
        if (!acc[order.orderId]) {
          acc[order.orderId] = [];
        }
        acc[order.orderId].push(order);
        return acc;
      }, {});

      setGroupedOrders(grouped);
      console.log("grouped :", grouped);
      setFilteredGroupedOrders(grouped);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleDetails = (orderId) => {
    setExpanded((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleStatusChange = async (orderDetailsId, newStatus) => {
    try {
      const statusChangeResult = await changeOrderStatus(
        orderDetailsId,
        newStatus
      );
      if (statusChangeResult.status === 200) {
        triggerNotification("Status change successfully", "success");
      } else {
        triggerNotification("Status change failed", "error");
      }
      alert(`Status changed to ${newStatus}`);

      setGroupedOrders((prev) => {
        const updated = { ...prev };
        for (let orderId in updated) {
          updated[orderId] = updated[orderId].map((item) =>
            item.orderDetailsId === orderDetailsId
              ? { ...item, status: newStatus }
              : item
          );
        }
        return updated;
      });

      setShowDropdown((prev) => ({ ...prev, [orderDetailsId]: false }));
    } catch (error) {
      alert("Failed to change status");
      console.error(error);
    }
  };

  const handleSearch = () => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      setFilteredGroupedOrders(groupedOrders); // Show all if search is empty
      return;
    }

    const filtered = Object.entries(groupedOrders).reduce(
      (acc, [orderId, items]) => {
        const username = items[0].username?.toLowerCase() || "";
        const clientId = items[0].clientId?.toString().toLowerCase() || "";
        const hasMatchingStatus = items.some((item) =>
          item.status?.toLowerCase().includes(term)
        );

        // Check if username starts with term, clientId matches, or any item's status includes term
        if (
          username.startsWith(term) ||
          clientId === term ||
          hasMatchingStatus
        ) {
          acc[orderId] = items;
        }

        return acc;
      },
      {}
    );

    setFilteredGroupedOrders(filtered);
    setSearchTerm("");
  };

  const handleAllOrder = () => {
    fetchAllOrderHistory();
    setSearchTerm("");
  };

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
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by username or cliendId"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSearch}
          className="search-button"
          style={{ width: "60px", height: "35px" }}
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
        <button
          onClick={handleAllOrder}
          className="All-button"
          style={{ width: "60px", height: "35px", marginLeft: "5px" }}
        >
          All
        </button>
      </div>
      {Object.entries(filteredGroupedOrders)
        .filter(
          ([orderId, items]) =>
            selectedStatus === "All" ||
            items.some((item) => item.status === selectedStatus)
        )
        .sort((a, b) => Number(b[0]) - Number(a[0]))
        .map(([orderId, items]) => (
          <div key={orderId} className="order-card">
            <p>
              <FontAwesomeIcon
                icon={faUserAlt}
                size="x"
                color="#f90348"
                title="User Profile"
                style={{ paddingRight: "5px" }}
              />
              {items[0].username}
            </p>
            <div className="order-header">
              <span>Order ID: {orderId}</span>
              <span>{new Date(items[0].createdAt).toLocaleDateString()}</span>
            </div>
            <hr />
            {items
              .filter((item) => {
                return (
                  selectedStatus === "All" || item.status === selectedStatus
                );
              })
              .map((item, index) => (
                <div className="order-body mt-3">
                  <img
                    src={`${URLForPhotoPath}/${
                      item.photosPaths[0] || item.serviceDetails.photoPaths[0]
                    }`}
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
                  <div className="order-status d-flex flex-column align-items-center justify-content-center gap-3">
                    <button className={`status-btn ${item.status}`}>
                      {item.status}
                    </button>
                    <div className="change-status-container">
                      <select
                        className="status-btn fw-bold p-1"
                        style={{
                          width: "160px",
                          fontSize: "16px",
                          backgroundColor: "#bd2752",
                        }}
                        onChange={(e) =>
                          handleStatusChange(
                            item.orderDetailsId,
                            e.target.value
                          )
                        }
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Change status
                        </option>
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status.replace(/_/g, " ")}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ))}
    </div>
  );
};

export default AdminLiveOrders;
