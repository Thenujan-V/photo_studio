import React, { useEffect, useState } from 'react'
import { fetchAllOrders, changeOrderStatus } from '../../../Services/orderService';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import '../../../style/AdminOrderHistory.scss'

const AdminOrderHistory = () => {

    const [groupedOrders, setGroupedOrders] = useState({});
    const [filteredGroupedOrders, setFilteredGroupedOrders] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [expanded, setExpanded] = useState({});
    const [showDropdown, setShowDropdown] = useState({});
    const navigate = useNavigate();

     const statusOptions = [
    'processing',
    'editing',
    'awaiting_approval',
    'reediting',
    'approved',
    'in_production',
    'ready_for_delivery',
    'delivered',
    'cancelled',
  ];

      useEffect(() => {
          fetchAllOrderHistory();
      }, []);

      const fetchAllOrderHistory = async () => {
          try {
            const response = await fetchAllOrders();
            const data = response.data.enrichedAllOrderDetails || [];
    
            // Group orders by orderId
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

  const handleStatusChange = async (orderDetailsId, newStatus) => {
    console.log("orderdetailsId:",orderDetailsId , newStatus);
    try {
      await changeOrderStatus(orderDetailsId, newStatus);
      alert(`Status changed to ${newStatus}`);

      // Optional: Refetch orders or update UI directly
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
      alert('Failed to change status');
      console.error(error);
    }
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
};

const handleAllOrder = () => {
  fetchAllOrderHistory();
}

  console.log("groupedOrders:", groupedOrders)
    return (
    <div className="order-history-container">
        <h2>Order History</h2>
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
        <div className="order-grid">
        {Object.entries(filteredGroupedOrders).map(([orderId, items]) => (
            <div key={orderId} className="order-card">
            <p ><FontAwesomeIcon icon={faUserAlt} size="x" color="#f90348" title="User Profile" style={{paddingRight:"5px"}}/>{items[0].username}</p>
            <div className="order-header">
                <span><strong>Order ID:</strong> {orderId}</span>
                <span><strong>Order Date:</strong> {new Date(items[0].createdAt).toLocaleDateString()}</span>
            </div>

            {items.map((item, index) => (
            <div key={item.orderDetailsId}>
                <div className="order-item">
                <div className="item-left">
                    <img
                    src={`/uploads/${item.photosPaths[0] || item.serviceDetails.photoPaths[0]}`}
                    alt="Service"
                    className="service-img"
                    />
                </div>
                <div className="item-right">
                    <p><strong>Status:</strong> {item.status}</p>
                    <p><strong>Service:</strong> {item.serviceDetails?.serviceName}</p>
                </div>
                </div>

                <div className="buttons">
                <button onClick={() => toggleDetails(orderId)}>
                    {expanded[orderId] ? "Hide Details" : "Show Details"}
                </button>
                <div className="change-status-container">
                  <select
                    className="status-select"
                    onChange={(e) => handleStatusChange(item.orderDetailsId, e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>Change status</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>
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
            ))}

            </div>
        ))}
        </div>
    </div>
    );
}

export default AdminOrderHistory