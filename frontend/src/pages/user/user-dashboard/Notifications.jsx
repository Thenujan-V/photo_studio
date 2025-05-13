import React, { useEffect, useState } from 'react';
import '../../../style/Notifications.scss';

const dummyNotifications = [
  {
    id: 1,
    userId: 'user1',
    image: 'https://5.imimg.com/data5/SELLER/Default/2023/4/300935887/RK/PR/IE/4354612/img-20220703-wa0001-1000x1000.jpg',
    service: 'Photography',
    serviceCategory: 'Tamil Weddiing'
  },
  {
    id: 2,
    userId: 'user1',
    image: 'https://5.imimg.com/data5/SELLER/Default/2023/4/300935887/RK/PR/IE/4354612/img-20220703-wa0001-1000x1000.jpg',
    service: 'Printing',
    serviceCategory: 'Mug Printing'
  },
  {
    id: 3,
    userId: 'user1',
    image: 'https://5.imimg.com/data5/SELLER/Default/2023/4/300935887/RK/PR/IE/4354612/img-20220703-wa0001-1000x1000.jpg',
    service: 'Frame',
    serviceCategory:'Wood Frame',
    color: 'Black',
    size: '12*16'
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const userId = 'user1';

  useEffect(() => {
    const userNotifications = dummyNotifications.filter((n) => n.userId === userId);
    setNotifications(userNotifications);
  }, [userId]);

  const handleDownload = (imageUrl) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'notification-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <h2 className="profile-heading">Notifications</h2>
      <div className="notification">
        {notifications.length === 0 ? (
          <p className="no-notification">0 Notifications</p>
        ) : (
          <div className="notifications-list">
            {notifications.map((notif) => (
              <div className="notification-card" key={notif.id}>
                <div className="left-noti">
                  <div className="dot" />
                  <img
                    src={notif.image}
                    alt="Notification"
                    className="notification-img"
                  />
                  <div className="notification-details">
                    <span className="service-name">{notif.service}</span>
                    <span className="category">{notif.serviceCategory}</span>
                    {notif.color && <span className="category">Color: {notif.color}</span>}
                    {notif.size && <span className="category">Size: {notif.size}</span>}
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
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Notifications;
