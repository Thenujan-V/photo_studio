import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import '../../style/AddToCard.scss';
import axios from 'axios';
import AppNavbar from '../../components/Navbar';
import AppFooter from '../../components/footer';
import { useNavigate } from 'react-router-dom';

const AddToCard = () => {
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const navigate = useNavigate();

    const fetchCartItems = () => {
    //   axios.get('/api/cart/get-from-cart/:clientId') 
    //     .then(res => setItems(res.data.items))
    //     .catch(err => console.error(err));
    const cardItems = {
        "items": [
            {
              "id": 5,
              "name": "Tamil Wedding Shoot",
              "description": "Traditional Tamil wedding photography with candid and posed shots.",
              "price": "LKR 60,000",
              "quantity": 1,
              "image" : "https://cdn0.weddingwire.in/vendor/9812/3_2/960/jpg/435930296-729066849153426-1695746735005873786-n_15_469812-172199018480648.jpeg",
              "category": "photography",
            },
            {
                "id": 15,
                "name": "T-shirt Printing",
                "description": "High-quality heat transfer or screen printing on T-shirts.",
                "price": "LKR 1,200",
                "quantity": 1,
                "image": "https://www.weddingphotoplanet.com/admin_image/slider/13012245661647863146Beautiful-Bride-Photo-Shoot.jpg",
                "category": "printing",
              },
            {
                "id": 9,
                "name": "Drone Videography",
                "description": "Aerial videography for weddings and outdoor events.",
                "price": "LKR 45,000",
                "quantity": 1,
                "image": "https://www.weddingphotoplanet.com/admin_image/slider/13012245661647863146Beautiful-Bride-Photo-Shoot.jpg",
                "category": "videography",
            },
            {
                "id": 24,
                "name": "Wooden Frame - A4",
                "description": "Handmade wooden frame, suitable for certificates and portraits.",
                "material": "Mahogany Wood",
                "color": "Dark Brown",
                "size": "A4",
                "price": "LKR 1,200",
                "quantity": 1,
                "image": "https://www.weddingphotoplanet.com/admin_image/slider/13012245661647863146Beautiful-Bride-Photo-Shoot.jpg",
                "category": "frames",
              },
          ]
    };
    setItems(cardItems.items);
    };
  
    useEffect(() => {
      fetchCartItems();
    }, []);

    const updateQuantity = (id, newQty) => {
        console.log("Quantity update");
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, quantity: newQty } : item
          )
        );
        if (newQty < 1) return;
    
        axios.put(`/api/cart/quantity-change/${id}`, { quantity: newQty }) 
          .then(() => {
            fetchCartItems();
          })
          .catch((err) => console.error(err));
      };
    
      const handleRemove = (id) => {
        axios.delete(`/api/cart/delete-cart/${id}`)
          .then(() => {
            // setItems((prevItems) => prevItems.filter((item) => item.id !== id));
            fetchCartItems();
          })
          .catch((err) => console.error(err));
      };
      
      const handleSelectAll = () => {
        if (selectedItems.length === items.length) {
          setSelectedItems([]); // Deselect all
        } else {
          setSelectedItems(items.map(item => item.id)); // Select all
        }
      };

      const handleSelectItem = (id) => {
        setSelectedItems((prevSelected) =>
          prevSelected.includes(id)
            ? prevSelected.filter(itemId => itemId !== id)
            : [...prevSelected, id]
        );
      };

      const navigateToCheckout = () => {
        if (selectedItems.length === 0) {
          alert("Please select at least one item before proceeding to checkout.");
          return;
        }
        const selectedItemData = items.filter(item => selectedItems.includes(item.id));
        navigate('/confirmOrder', { state: { selectedItems: selectedItemData } });
      };

      const getSelectedTotal = () => {
        return items
          .filter(item => selectedItems.includes(item.id))
          .reduce((total, item) => {
            const numericPrice = parseInt(item.price.replace(/[^\d]/g, ''), 10);
            return total + numericPrice * item.quantity;
          }, 0);
      };
    
      return (
        <>
        <AppNavbar />
          <div className="cart-container">
            <h2>Your Cart Items - {items.length}</h2>
            {items.length === 0 ? (
              <p className="no-items">No items in your cart.</p>
            ) : (
            items.map((item) => {
              const numericPrice = parseInt(item.price.replace(/[^\d]/g, ''), 10);
              const totalPrice = numericPrice * item.quantity;
      
              return (
                <div className="cart-item" key={item.id}>
                  <input
                    type="checkbox"
                    className="cart-checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                  />
                  <img src={item.image} alt={item.name} className="cart-img" />
                  <div className="cart-details">
                    <p className="cart-name">{item.name}</p>
                    {item.color && <p className="cart-color">Color: {item.color}</p>}
                    {item.size && <p className="cart-size">Size: {item.size}</p>}
                    <p className="cart-desc">{item.description}</p>
                  </div>
                  <div className="cart-quantity">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <p className="cart-price">{item.price}</p>
                  <p className="cart-total">LKR {totalPrice.toLocaleString()}</p>
                  <FontAwesomeIcon
                  icon={faTrashAlt}
                  className="cart-delete"
                  title="Remove"
                  onClick={() => handleRemove(item.id)}
                  />
                </div>
              );
            }))}
      
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
              <button className="checkout-btn" onClick={() => navigateToCheckout()}>Checkout</button>
            </div>
          </div>
          < AppFooter />
        </>
      );
    };
    
    export default AddToCard;