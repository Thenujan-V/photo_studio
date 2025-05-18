import React, { useEffect, useState } from 'react';
import '../../../style/Notifications.scss';
import { changeOrderStatus, fetchEditedPhotos, fetchOrdersByClientId } from '../../../Services/orderService';
import { decodedToken } from '../../../Services/getToken ';
import { triggerNotification } from '../../../Services/notificationService';


const Notifications = () => {
  const token = decodedToken()
  const clientId = token.userId
  const [notifications, setNotifications] = useState([]);
  const [orders, setOrders] = useState([]);
  const [groupedOrders, setGroupedOrders] = useState({});
  const URLForPhotoPath = process.env.REACT_APP_PHOTO_PATH_URL
  const [expanded, setExpanded] = useState({});
  

  useEffect(() => {
    const editedPhotos = async () => {
      const userOrders = await fetchOrdersByClientId(clientId);
      const data = userOrders.data?.enrichedOrderDetails || []

      if(userOrders.status === 200){
        setOrders(userOrders.data.enrichedOrderDetails);

        const grouped = data.reduce((acc, order) => {
          if (!acc[order.orderId]) {
            acc[order.orderId] = [];
          }
          acc[order.orderId].push(order);
          return acc;
        }, {});

        const enrichedGrouped = {};

        for (const [orderId, items] of Object.entries(grouped)) {
          const enrichedItems = await Promise.all(
            items
            .filter(item => ["awaiting_approval" , "reediting" , "approved"].includes(item.status) )
            .map(async (item) => {
              const fetchedPhoto = await fetchEditedPhotos(item.orderDetailsId);

              if (fetchedPhoto.status === 200) {
                return {
                  ...item,
                  editedPhoto: fetchedPhoto.data.fetchEditedPhoto[0],
                };
              }
              return item;
            })
          );
          enrichedGrouped[orderId] = enrichedItems;
        }

        setGroupedOrders(enrichedGrouped);
        console.log("Grouped with edited photos:", enrichedGrouped);

      }
    }

    if(clientId) editedPhotos()

  }, [clientId]);

  const toggleDetails = (orderId) => {
    setExpanded((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const openInNewTab = (imageUrl) => {
  window.open(imageUrl, '_blank');
  };

  const handleStatusChange = async (orderDetailsId, status) => {
    try{
      const changeStatusResult = await changeOrderStatus(orderDetailsId, status)
      console.log("ee :", changeStatusResult)
      if(changeStatusResult.status === 200){
        triggerNotification("Successfully updated", "success")
        window.location.reload()
      }
      else{
        triggerNotification("Update failed", "error")
      }
    }catch(err){
      console.log("Error when status change.", err)
    }
  }
  return (
    <>
      <h2 className="profile-heading">Notifications</h2>
      <div className="notification">
        {orders.length === 0 ? (
          <p className="no-notification">0 Notifications</p>
            ) : (
              <div className="notifications-list">
                { Object.values(groupedOrders).every(items => !items || items.length === 0) ? (
                    <p className='w-100 text-center'>No notifications available</p>
                  ) : ( Object.entries(groupedOrders)
                  .sort((a, b) => Number(b[0]) - Number(a[0]))      
                  .map(([orderId, items]) => (
                          items.length !== 0 && (<div key={orderId} className="order-card">
                            <div className="order-header">
                                <span><strong>Order ID:</strong> {orderId}</span>
                                <span><strong>Order Date:</strong> {new Date(items[0]?.createdAt).toLocaleDateString()}</span>
                            </div>

                            {items.map((item, index) => (
                              <div key={item.orderDetailsId} className="order-item d-flex flex-row justify-content-between gap-3">
                                <div className="item-left">
                                  <p className='fw-bold bg-dark text-center rounded' style={{width:'25px', color: 'white'}}>{item.orderDetailsId}</p>
                                  <img
                                    src={`${URLForPhotoPath}/${item.photosPaths[0] || item.serviceDetails.photoPaths[0]}`}
                                    alt="Service"
                                    className="service-img"
                                  />
                                </div>
                                <div className="item-right d-flex flex-column justify-content-center">
                                  <p><strong>Service Name:</strong> {item.serviceDetails?.serviceName}</p>
                                  <p><strong>Status:</strong> {item.status}</p>
                                  <p><strong>Quantity:</strong> {item.quantity}</p>
                                  <p><strong>Price:</strong> Rs. {item.serviceDetails?.servicePrice * item.quantity}</p>
                                  {item.color && <p><strong>Color:</strong> {item.color}</p>}
                                  {item.size && <p><strong>Size:</strong> {item.size}</p>}
                                  {item.editedPhoto && <div className="buttons">
                                    <button className="showDetailsBtn" onClick={() => toggleDetails(orderId)}>
                                      {expanded[orderId] ? "Hide Photo" : "Edited Photo"}
                                    </button>
                                  </div>}
                                </div>
                                <div>
                                  {expanded[orderId] && (
                                    <div className="details">
                                      <img
                                        src={`${URLForPhotoPath}/${item.editedPhoto?.photoPath}`}
                                        alt="Notification"
                                        className="notification-img"
                                      />
                                      <button onClick={() => openInNewTab(`${URLForPhotoPath}/${item.editedPhoto?.photoPath}`)} style={{marginTop:'10px', width:'150px'}}>
                                        View Img
                                      </button>
                                    </div>
                                  )}
                                </div>
                                <div className="btn-group d-flex flex-column justify-content-center">
                                  <button 
                                    disabled={ ["reediting", "approved"].includes(item.status) } 
                                    onClick={() => handleStatusChange(item.orderDetailsId, 'reediting')}
                                    >ReEdit
                                  </button>
                                  <button 
                                    disabled={ ["reediting", "approved"].includes(item.status) } 
                                    onClick={() => handleStatusChange(item.orderDetailsId, 'approved')}
                                    >Approved
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>)
                      ))
                    )
                }
            {/* {Object.entries(groupedOrders)
              .filter(status => status !== 'awaiting_approval' || 'reediting' || 'approved' || 'in_production' )
              .map((notif) => (
                <div className="notification-card" key={notif.orderId}>
                  <div className="order-header">
                    <div className="d-flex flex-column">
                      <span><strong>Order ID:</strong> {notif.orderId}</span>
                      <span><strong>Order Date:</strong> {new Date(items[0].createdAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <button className="invoice-btn" onClick={() => handleInvoice(orderId)}>Invoice</button>
                    </div>
                  </div>
                  <div className="left-noti">
                    <div className="dot" />
                    <img
                      src={notif.image}
                      alt="Notification"
                      className="notification-img"
                    />
                    <div className="notification-details">
                      <span className="service-name">{notif.serviceDetails.serviceName}</span>
                      {notif.serviceDetails.framneColor && <span className="category">Color: {notif.serviceDetails.framneColor}</span>}
                      {notif.serviceDetails.frameSize && <span className="category">Size: {notif.serviceDetails.frameSize}</span>}
                      <button onClick={() => handleDownload(notif.image)} style={{marginTop:'10px', width:'150px'}}>
                        Download Img
                      </button>
                    </div>
                  </div>
                  <div className="btn-group">
                    <button >ReEdit</button>
                    <button >Confirm</button>
                  </div>
                </div>
            ))} */}
          </div>
        )}
      </div>
    </>
  );
};

export default Notifications;
