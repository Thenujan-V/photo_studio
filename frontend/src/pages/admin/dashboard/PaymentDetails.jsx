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
import { updateStatus } from "../../../Services/paymentServices";

const PaymentDetails = () => {
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
  const [expandedPaymentDetails, setExpandedPaymentDetails] = useState({});
  const [filePath, setFilePath] = useState("");
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("");

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

  const togglePaymentDetails = (orderId) => {
    setExpandedPaymentDetails((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
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

  const handleChangePaymentStatus = async (paymentId, status) => {
    try {
      alert("Are sure want to change payment status to complete");
      const paymentStatusChangeResult = await updateStatus(paymentId, status);
      if (paymentStatusChangeResult.status == 200) {
        triggerNotification("Payment complete.", "success");
      } else {
        console.log(
          "error occur in payment status change.",
          paymentStatusChangeResult
        );
        triggerNotification("Payment Failed.", "error");
      }
    } catch (err) {
      console.log("error when change payment status.", err);
    }
  };
  return (
    <div className="order-history-container">
      <h2 className="text-center fw-bolder fs-1 mb-4 p-0 mt-0">Payment Details</h2>
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
              <div className="buttons d-flex justify-content-between">
                <button onClick={() => toggleDetails(orderId)}>
                  {expanded[orderId] ? "Hide Details" : "Show Details"}
                </button>
                <button
                  className="w-auto"
                  onClick={() => togglePaymentDetails(orderId)}
                >
                  {expandedPaymentDetails[orderId]
                    ? "Hide Details"
                    : "Payment Details"}
                </button>
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
                    {expanded[orderId] && (
                      <div className="details d-flex flex-row gap-4">
                        <div className="order-item">
                          <div className="item-left">
                            <img
                              src={`${URLForPhotoPath}/${item.serviceDetails.photoPaths[0]}`}
                              alt="Service"
                              className="service-img"
                            />
                            <p className="p-0 m-0 w-75">
                              <strong>
                                {item.serviceDetails?.serviceName}
                              </strong>
                            </p>
                          </div>
                        </div>
                        <div>
                          <p
                            className={`m-0 p-0 fw-bold status-tag-${item.status}`}
                          >
                            {item.status}
                          </p>
                          <p className="m-0 p-0">
                            <strong>Quantity:</strong> {item.quantity}
                          </p>
                          <p className="m-0 p-0">
                            <strong>Price:</strong> Rs.{" "}
                            {item.serviceDetails?.servicePrice}
                          </p>
                          <p className="m-0 p-0">
                            <strong>Total:</strong> Rs.{" "}
                            {item.serviceDetails?.servicePrice} *{" "}
                            {item.quantity} ={" "}
                            {item.serviceDetails?.servicePrice * item.quantity}
                            /=
                          </p>
                          {item.color && (
                            <p className="m-0 p-0">
                              <strong>Color:</strong> {item.color}
                            </p>
                          )}
                          {item.size && (
                            <p className="m-0 p-0">
                              <strong>Size:</strong> {item.size}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    {expandedPaymentDetails[orderId] && index === 0 && (
                      <div className="d-flex gap-5">
                        <div className="flex-1 m-0 p-0">
                          <p className="p-0 m-0">
                            <strong>Payment Status: </strong>
                            <span
                              className={`m-0 p-0 fw-bold payment-status-tag-${item.paymentStatus}`}
                            >
                              {item.paymentStatus}
                            </span>
                          </p>
                          <p className="m-0 p-0">
                            <strong>Total Amount:</strong> {item.totalAmount}
                          </p>
                          <p className="m-0 p-0">
                            <strong>Payment Method:</strong>{" "}
                            {item.paymentMethod}
                          </p>
                        </div>
                        {item.paymentStatus !== "complete" && (
                          <div
                            className="flex-1 rounded borderd shadow p-2 justify-self-center align-self-center d-flex flex-column align-items-center"
                            style={{ backgroundColor: "#f0ecec" }}
                          >
                            <p
                              className="text-center fw-bold"
                              style={{ color: "#bd2752" }}
                            >
                              click here to update payment status to complete
                            </p>
                            <button
                              onClick={() =>
                                handleChangePaymentStatus(
                                  item.paymentId,
                                  "complete"
                                )
                              }
                              style={{
                                backgroundColor: "#bd2752",
                              }}
                            >
                              Complete
                            </button>
                          </div>
                        )}
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

export default PaymentDetails;
