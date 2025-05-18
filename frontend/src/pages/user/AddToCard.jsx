import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import "../../style/AddToCard.scss";
import axios from "axios";
import AppNavbar from "../../components/Navbar";
import AppFooter from "../../components/footer";
import { useNavigate } from "react-router-dom";
import {
  deleteCartItem,
  fetchCartItems,
  quantityUpdate,
} from "../../Services/cartService";
import { decodedToken } from "../../Services/getToken ";
import { triggerNotification } from "../../Services/notificationService";
import { createOrder } from "../../Services/orderService";

const AddToCard = () => {
  const token = decodedToken();
  const clientId = token.userId;

  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();
  // const { cart_id, service_category_id, service_id, quantity } = item
  const REACT_APP_PHOTO_PATH_URL = process.env.REACT_APP_PHOTO_PATH_URL;

  useEffect(() => {
    const fetchCart = async () => {
      await fetchCartItems(clientId)
        .then((res) => setItems(res.data.enrichedCartDetails))
        .catch((err) => console.error(err));
    };

    if (clientId) {
      fetchCart();
    }
  }, [clientId]);

  const updateQuantity = async (id, newQty) => {
    if (newQty < 1) return;
    if (newQty > 3) {
      triggerNotification(
        "You can update quantity upto 3. If you want more than 3 items contact us via call.",
        "error"
      );
      return;
    }

    await quantityUpdate(id, newQty)
      .then((res) => {
        if (res.status === 200) {
          triggerNotification("quantity update successfully.", "success");
          fetchCartItems(clientId).then((res) =>
            setItems(res.data.enrichedCartDetails)
          );
        }
      })
      .catch((err) => console.error(err));
  };

  const handleRemove = async (id) => {
    await deleteCartItem(id)
      .then((res) => {
        if (res.status === 200) {
          triggerNotification("Item deleted.", "success");
          fetchCartItems(clientId).then((res) =>
            setItems(res.data.enrichedCartDetails)
          );
        }
      })
      .catch((err) => console.error(err));
  };

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]); // Deselect all
    } else {
      setSelectedItems(items.map((item) => item.id)); // Select all
    }
  };

  const handleSelectItem = (
    id,
    serviceCategory,
    categoryId,
    serviceId,
    quantity,
    serviceName,
    photoPath,
    description,
    color,
    size,
    servicePrice
  ) => {
    setSelectedItems((prevSelected) => {
      const isAlreadySelected = prevSelected.some((item) => item.id === id);

      if (isAlreadySelected) {
        return prevSelected.filter((item) => item.id !== id);
      } else {
        return [
          ...prevSelected,
          {
            id,
            serviceCategory,
            categoryId,
            serviceId,
            quantity,
            serviceName,
            photoPath,
            description,
            color,
            size,
            servicePrice,
          },
        ];
      }
    });
  };

  const navigateToCheckout = async () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item before proceeding to checkout.");
      return;
    }
    // const selectedItemData = items.filter(item => selectedItems.includes(item.id));
    const selectFiedls = selectedItems.map((item) => ({
      cartId: item.id,
      serviceCategoryId: item.categoryId,
      serviceId: item.serviceId,
      quantity: item.quantity,
    }));

    const resultForCreateOrder = await createOrder(clientId, selectFiedls);

    const orderId = resultForCreateOrder.data.order_id;
    console.log("od :", orderId);

    navigate("/confirmOrder", { state: { selectedItems, orderId } });
  };

  const getSelectedTotal = () => {
    const selectedIds = selectedItems.map((sel) => String(sel.id));

    return items
      .filter((item) => selectedIds.includes(String(item.cartId)))
      .reduce((total, item) => {
        const priceStr = item.serviceDetails?.servicePrice || "0";
        const numericPrice = parseInt(priceStr.replace(/[^\d]/g, ""), 10) || 0;
        return total + numericPrice * (item.quantity || 1);
      }, 0);
  };
  console.log("it :", items);
  return (
    <>
      <AppNavbar />
      <div className="cart-container">
        <h2>Your Cart Items - {items.length}</h2>
        {items && items.length === 0 ? (
          <p className="no-items">No items in your cart.</p>
        ) : (
          items &&
          items.map((item) => {
            const totalPrice = item.serviceDetails.servicePrice * item.quantity;

            return (
              <div className="cart-item" key={item.cartId}>
                <input
                  type="checkbox"
                  className="cart-checkbox"
                  checked={selectedItems.some(
                    (selected) => selected.id === item.cartId
                  )}
                  onChange={() =>
                    handleSelectItem(
                      item.cartId,
                      item.serviceCategory,
                      item.serviceDetails.serviceCategoryId,
                      item.serviceDetails.serviceId,
                      item.quantity,
                      item.serviceDetails.serviceName,
                      item.serviceDetails.photoPaths[1],
                      item.serviceDetails.description,
                      item.serviceDetails.color
                        ? item.serviceDetails.color
                        : null,
                      item.serviceDetails.size
                        ? item.serviceDetails.size
                        : null,
                      item.serviceDetails.servicePrice
                    )
                  }
                />
                <img
                  src={`${REACT_APP_PHOTO_PATH_URL}/${item.serviceDetails.photoPaths[0]}`}
                  alt={item.serviceDetails.serviceName}
                  className="cart-img rounded shadow-lg"
                />
                <div className="cart-details">
                  <p className="cart-name">{item.serviceDetails.serviceName}</p>
                  {item.serviceDetails.color && (
                    <p className="cart-color">
                      Color: {item.serviceDetails.color}
                    </p>
                  )}
                  {item.serviceDetails.size && (
                    <p className="cart-size">
                      Size: {item.serviceDetails.size}
                    </p>
                  )}
                  <p className="cart-desc">{item.serviceDetails.description}</p>
                </div>
                <div className="cart-quantity">
                  <button
                    onClick={() =>
                      updateQuantity(item.cartId, item.quantity - 1)
                    }
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.cartId, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
                <p className="cart-price fw-bold text-center">
                  LKR {item.serviceDetails.servicePrice}
                </p>
                <p className="cart-total">LKR {totalPrice.toLocaleString()}</p>
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  className="cart-delete"
                  title="Remove"
                  onClick={() => handleRemove(item.cartId)}
                />
              </div>
            );
          })
        )}

        <div className="select-all">
          <div className="select">
            <input
              type="checkbox"
              checked={selectedItems.length === items.length}
              onChange={handleSelectAll}
            />
            <label>All</label>
          </div>
          <div className="cart-summary">
            {selectedItems.length > 0 && (
              <h3>Total Value: LKR {getSelectedTotal().toLocaleString()}</h3>
            )}
          </div>
          <button className="checkout-btn" onClick={navigateToCheckout}>
            Checkout
          </button>
        </div>
      </div>
      <AppFooter />
    </>
  );
};

export default AddToCard;
