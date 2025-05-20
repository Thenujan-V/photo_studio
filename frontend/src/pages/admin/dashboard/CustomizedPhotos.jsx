import React, { useEffect, useState } from "react";
import {
  fetchAllOrders,
  changeOrderStatus,
} from "../../../Services/orderService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserAlt,
  faSearch,
  faAdd,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { triggerNotification } from "../../../Services/notificationService";
import { Button, Form, Modal } from "react-bootstrap";
import {
  uploadEditedPhoto,
  viewEditedPhoto,
} from "../../../Services/customizedPhotoServices";

const CustomizedPhotos = () => {
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
  const [showModalIndex, setShowModalIndex] = useState(null);
  const [showModalOrderId, setShowModalOrderId] = useState(null);
  const [showAddModalIndex, setShowAddModalIndex] = useState(null);
  const [showAddModalOrderId, setShowAddModalOrderId] = useState(null);
  const [editedImg, setEditedImg] = useState("");
  const [image, setImage] = useState(null);

  const URLForPhotoPath = process.env.REACT_APP_PHOTO_PATH_URL;

  const statusOptions = ["editing", "in_production"];

  useEffect(() => {
    fetchAllOrderHistory();
  }, []);

  const fetchAllOrderHistory = async () => {
    try {
      const response = await fetchAllOrders();
      const data = response.data.enrichedAllOrderDetails || [];
      const excludedStatuses = ["cancelled"];
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
      console.log("grouped :", grouped);
      setFilteredGroupedOrders(grouped);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEditedPhotos = async (orderDetailId) => {
    try {
      await viewEditedPhoto(orderDetailId)
        .then((res) => {
          const data = res.data.fetchEditedPhoto
            ? res.data.fetchEditedPhoto[0].photoPath
            : null;
          data ? setEditedImg(data) : setEditedImg("");
        })
        .catch((err) => console.log("Error when fetch edited photos: ", err));
    } catch (err) {
      console.error(err);
    }
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
    setSearchTerm("");
  };

  const handleViewPhotos = (index, orderId, orderDetailId) => {
    fetchEditedPhotos(orderDetailId);
    setShowModalIndex(index);
    setShowModalOrderId(orderId);
  };

  const openInNewTab = (imageUrl) => {
    window.open(imageUrl, "_blank");
  };

  const handelAdd = (index, orderId) => {
    setShowAddModalIndex(index);
    setShowAddModalOrderId(orderId);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleEditedPhotoSubmit = async (e, orderDetailsId) => {
    e.preventDefault();

    if (!image) {
      triggerNotification("Please upload an image before submitting.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("photos", image);

    await uploadEditedPhoto(orderDetailsId, formData)
      .then((res) => {
        console.log(res);
        if (res.status === 201)
          triggerNotification("Successfully upload edited photo.", "success");
        else triggerNotification("Edited photo upload failed.", "error");
      })
      .catch((err) => console.log("Error when upload photo.", err));
    setImage(null);
  };

  return (
    <div className="live-orders">
      <h2 className="text-center fw-bolder fs-1 mb-4 mt-0 p-0">Live Orders</h2>
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

                    <p className={`m-0 p-0 fw-bold status-tag-${item.status}`}>
                      {item.status}
                    </p>
                  </div>

                  {showModalIndex === index && showModalOrderId === orderId && (
                    <Modal
                      show={true}
                      onHide={() => {
                        setShowModalIndex(null);
                        setEditedImg("");
                      }}
                      centered
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Instructions</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <p className="fw-bold mt-2">Client Photos</p>
                        <div className="show-clint-photos d-flex flex-wrap gap-2">
                          {item.photosPaths &&
                            item.photosPaths.map((photo) => (
                              <div>
                                <img
                                  className="img-fluid cursor-pointer"
                                  style={{
                                    width: "150px",
                                    height: "auto",
                                    cursor: "pointer",
                                  }}
                                  src={`${URLForPhotoPath}/${photo}`}
                                  alt={item.serviceDetails?.serviceName}
                                  onClick={() =>
                                    openInNewTab(`${URLForPhotoPath}/${photo}`)
                                  }
                                />
                              </div>
                            ))}
                        </div>
                        {item.clientMessage && (
                          <div>
                            <p className="fw-bold mt-2">Client Instructions</p>
                            <p>{item.clientMessage}</p>
                          </div>
                        )}
                        {editedImg && (
                          <div>
                            <p className="fw-bold mt-2">Edited Photo</p>
                            <img
                              className="img-fluid cursor-pointer"
                              style={{
                                width: "150px",
                                height: "auto",
                                cursor: "pointer",
                              }}
                              src={`${URLForPhotoPath}/${editedImg}`}
                              alt="edited_photo "
                              onClick={() =>
                                openInNewTab(`${URLForPhotoPath}/${editedImg}`)
                              }
                            />
                          </div>
                        )}
                      </Modal.Body>
                    </Modal>
                  )}
                  {showAddModalIndex === index &&
                    showAddModalOrderId === orderId && (
                      <Modal
                        show={true}
                        onHide={() => {
                          setShowAddModalIndex(null);
                        }}
                        centered
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>Upolad edited photo</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <Form
                            onSubmit={(e) =>
                              handleEditedPhotoSubmit(e, item.orderDetailsId)
                            }
                          >
                            <Form.Group controlId="formFile" className="mb-3">
                              <Form.Label>Choose a photo</Form.Label>
                              <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                              />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                              Submit
                            </Button>
                          </Form>
                        </Modal.Body>
                      </Modal>
                    )}
                  <div className="order-status d-flex flex-column align-items-start justify-content-center gap-3">
                    <div className="d-flex flex-row gap-3">
                      <button
                        onClick={() => handelAdd(index, orderId)}
                        className="search-button p-0"
                        style={{ width: "auto", background: "none" }}
                        disabled={
                          !["editing", "reediting"].includes(item.status)
                        }
                      >
                        <FontAwesomeIcon
                          icon={faPlusCircle}
                          size="2x"
                          color="green"
                        />
                      </button>
                      <button
                        className={`status w-auto`}
                        onClick={() =>
                          handleViewPhotos(index, orderId, item.orderDetailsId)
                        }
                        style={{ cursor: "pointer" }}
                      >
                        Instructions
                      </button>
                    </div>
                    <div className="change-status-container">
                      <select
                        className="status-btn fw-bold p-1"
                        style={{
                          width: "160px",
                          fontSize: "16px",
                          backgroundColor: "#bd2752",
                          cursor: "pointer",
                        }}
                        onChange={(e) =>
                          handleStatusChange(
                            item.orderDetailsId,
                            e.target.value
                          )
                        }
                        defaultValue=""
                        disabled={
                          ![
                            "processing",
                            "editing",
                            "awaiting_approval",
                            "reediting",
                            "approved",
                          ].includes(item.status)
                        }
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

export default CustomizedPhotos;
