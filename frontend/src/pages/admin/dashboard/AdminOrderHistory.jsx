import React, { useEffect, useState } from "react";
import {
  fetchAllOrders,
  changeOrderStatus,
} from "../../../Services/orderService";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserAlt, faSearch } from "@fortawesome/free-solid-svg-icons";
import "../../../style/AdminOrderHistory.scss";
import { triggerNotification } from "../../../Services/notificationService";
import { fetchInvoice } from "../../../Services/invoiceService";

const AdminOrderHistory = () => {
  const orderStatuses = [
    "All",
    "processing",
    "editing",
    "awaiting_approval",
    "reediting",
    "approved",
    "in_production",
    "ready_for_delivery",
    "delivered",
    "cancelled",
  ];

  const [groupedOrders, setGroupedOrders] = useState({});
  const [filteredGroupedOrders, setFilteredGroupedOrders] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState({});
  const [filePath, setFilePath] = useState("");
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState("All");

  const URLForPhotoPath = process.env.REACT_APP_PHOTO_PATH_URL;

  useEffect(() => {
    fetchAllOrderHistory();
  }, []);

  const fetchAllOrderHistory = async () => {
    try {
      const response = await fetchAllOrders();
      const data = response.data.enrichedAllOrderDetails || [];

      const grouped = data.reduce((acc, order) => {
        if (!acc[order.orderId]) {
          acc[order.orderId] = [];
        }
        acc[order.orderId].push(order);
        return acc;
      }, {});

      setGroupedOrders(grouped);
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

  const handleSearch = () => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      setFilteredGroupedOrders(groupedOrders);
      return;
    }

    const filtered = Object.entries(groupedOrders).reduce(
      (acc, [orderId, items]) => {
        const username = items[0].username?.toLowerCase() || "";
        const clientId = items[0].clientId?.toString().toLowerCase() || "";
        const hasMatchingStatus = items.some((item) =>
          item.status?.toLowerCase().includes(term)
        );

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
  };

  const handleInvoice = async (orderId) => {
    try {
      const invoiceResult = await fetchInvoice(orderId);
      if (invoiceResult.status === 400) {
        triggerNotification("There is no invoice in this orderID.", "error");
        return;
      }
      if (invoiceResult.status === 200) {
        const invoicePath = invoiceResult.data.existingInvoice[0]?.filePath;
        setFilePath(invoicePath);

        if (!invoicePath) {
          triggerNotification("Invoice file path not found.", "error");
          return;
        }

        const REACT_APP_PHOTO_PATH_URL = process.env.REACT_APP_PHOTO_PATH_URL;
        const fullURL = `${REACT_APP_PHOTO_PATH_URL}/${invoicePath}`;

        window.open(fullURL, "_blank");
      }
      console.log(invoiceResult);
    } catch (err) {
      console.log("error when fetch invoice: ", err);
      triggerNotification("Error When fetch invoice", "error");
    }
  };

  return (
    <div className="order-history-container">
      <h2 className="text-center fw-bolder fs-1 mb-4 p-0 mt-0">Order History</h2>
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
      <div className="order-grid">
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
                <div className="d-flex flex-column">
                  <span>
                    <strong>Order ID:</strong> {orderId}
                  </span>
                  <span>
                    <strong>Order Date:</strong>{" "}
                    {new Date(items[0].createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <button
                    className="invoice-btn"
                    onClick={() => handleInvoice(orderId)}
                  >
                    Invoice
                  </button>
                </div>
              </div>

              {items
                .filter((item) => {
                  return (
                    selectedStatus === "All" || item.status === selectedStatus
                  );
                })
                .sort((a, b) => b.orderDetailsId - a.orderDetailsId)
                .map((item, index) => (
                  <div key={item.orderDetailsId}>
                    <div className="order-item">
                      <div className="item-left">
                        <img
                          src={`${URLForPhotoPath}/${
                            item.photosPaths[0] ||
                            item.serviceDetails.photoPaths[0]
                          }`}
                          alt="Service"
                          className="service-img"
                        />
                      </div>
                      <div className="item-right">
                        <p
                          className={`m-0 p-0 fw-bold status-tag-${item.status}`}
                        >
                          {item.status}
                        </p>
                        <p>
                          <strong>Service:</strong>{" "}
                          {item.serviceDetails?.serviceName}
                        </p>
                      </div>
                    </div>

                    <div className="buttons">
                      <button onClick={() => toggleDetails(orderId)}>
                        {expanded[orderId] ? "Hide Details" : "Show Details"}
                      </button>
                    </div>
                    {expanded[orderId] && (
                      <div className="details">
                        <p>
                          <strong>Category:</strong> {item.serviceCategory}
                        </p>
                        <p>
                          <strong>Quantity:</strong> {item.quantity}
                        </p>
                        <p>
                          <strong>Price:</strong> Rs.{" "}
                          {item.serviceDetails?.servicePrice * item.quantity}
                        </p>
                        {item.color && (
                          <p>
                            <strong>Color:</strong> {item.color}
                          </p>
                        )}
                        {item.size && (
                          <p>
                            <strong>Size:</strong> {item.size}
                          </p>
                        )}
                        <p>
                          <strong>Description:</strong>{" "}
                          {item.serviceDetails?.description}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default AdminOrderHistory;
