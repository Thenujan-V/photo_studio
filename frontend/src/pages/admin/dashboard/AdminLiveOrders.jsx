import React, { useEffect, useState } from "react";
import "../../../style/AdminLiveOrders.scss"; 
import { fetchAllOrders, changeOrderStatus } from '../../../Services/orderService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAlt, faSearch } from '@fortawesome/free-solid-svg-icons';

const AdminLiveOrders = () => {
    const [groupedOrders, setGroupedOrders] = useState({});
    const [filteredGroupedOrders, setFilteredGroupedOrders] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [expanded, setExpanded] = useState({});

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
            setFilteredGroupedOrders(grouped);
          } catch (err) {
            console.error(err);
          }
        };

    const toggleDetails = (orderId) => {
    setExpanded((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
    };

  const handleKeyDown = (e) => {
  if (e.key === 'Enter') {
    handleSearch();
  }
};

const handleSearch = () => {
  const term = searchTerm.trim().toLowerCase();

  if (!term) {
    setFilteredGroupedOrders(groupedOrders); // Show all if search is empty
    return;
  }

  const filtered = Object.entries(groupedOrders).reduce((acc, [orderId, items]) => {
    const username = items[0].username?.toLowerCase() || '';
    const clientId = items[0].clientId?.toString().toLowerCase() || '';

    // Check if username starts with term OR clientId matches exactly
    if (username.startsWith(term) || clientId === term) {
      acc[orderId] = items;
    }

    return acc;
  }, {});

  setFilteredGroupedOrders(filtered);
  setSearchTerm(''); 
};

const handleAllOrder = () => {
  fetchAllOrderHistory();
  setSearchTerm('');
}

  return (
    <div className="live-orders">
      <h2>Live Orders</h2>
      <div className="search-container">
              <input
                type="text"
                placeholder="Search by username or cliendId"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button onClick={handleSearch} className="search-button" style={{width:"60px", height:"35px"}}>
                <FontAwesomeIcon icon={faSearch} />
              </button>
              <button onClick={handleAllOrder} className="All-button" style={{width:"60px", height:"35px", marginLeft:"5px"}}>
                All
              </button>
            </div>
        {Object.entries(filteredGroupedOrders).map(([orderId, items]) => (
            <div key={orderId} className="order-card">
              <p ><FontAwesomeIcon icon={faUserAlt} size="x" color="#f90348" title="User Profile" style={{paddingRight:"5px"}}/>{items[0].username}</p>
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


export default AdminLiveOrders