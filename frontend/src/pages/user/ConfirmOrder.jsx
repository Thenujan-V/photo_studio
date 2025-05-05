import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../../style/ConfirmOrder.scss';
import AppNavbar from '../../components/Navbar';
import AppFooter from '../../components/footer';
import Payment from '../../components/Payment';

const ConfirmOrder = () => {
  const location = useLocation();
  const { selectedItems } = location.state || { selectedItems: [] };
  const [isPayment , setIsPayment] = useState(false);

  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [deliveryInfo, setDeliveryInfo] = useState({
    sender_phone_number: '',
    receiver_phone_number: '',
    reciver_name: '',
    reciver_address_district: '',
    receiver_address_city: '',
    receiver_address_street: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const handleUpload = async (index) => {
    const filesToUpload = uploadedPhotos[index];
  
    if (!filesToUpload || filesToUpload.length === 0) {
      alert("No files selected to upload.");
      return;
    }
  
    if (filesToUpload.length > 5) {
      alert("Maximum 5 images allowed.");
      return;
    }
  
    const formData = new FormData();
    filesToUpload.forEach((file) => {
      formData.append("images", file);
    });
  const orderDetailsId = 1;
    try {
      const response = await fetch(`/api/cart/add-photos/${orderDetailsId}`, {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) throw new Error("Upload failed.");
  
      const result = await response.json();
      console.log("Upload successful:", result);
      alert("Images uploaded successfully!");
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Image upload failed.");
    }
  };

  const getTotalAmount = () => {
    return selectedItems.reduce((total, item) => {
      const numericPrice = parseInt(item.price.replace(/[^\d]/g, ''), 10);
      return total + numericPrice * item.quantity;
    }, 0);
  };

  const handleDeliveryChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const missingUploads = selectedItems.some((item, index) => {
        return (item.category === 'printing' || item.category === 'frames') && 
               (!uploadedPhotos[index] || uploadedPhotos[index].length === 0);
      });
    
      if (missingUploads) {
        alert("Please upload at least one image for all printing or frame items.");
        return;
      }
      const isDeliveryInfoIncomplete = Object.values(deliveryInfo).some(value => value.trim() === '');

      if (isDeliveryInfoIncomplete) {
        alert("Please fill in all delivery details before placing the order.");
        return;
      }
    
    console.log({ selectedItems, uploadedPhotos, deliveryInfo, paymentMethod });
    alert("Order submitted successfully!");
  };

  return (
    <>
    <AppNavbar />
    <div className="confirm-order-container">
      <div className="left-section">
        <h2>Selected Items</h2>
        <div className="selected-items-scroll">
        {selectedItems.map((item, index) => (
          <div className="selected-item" key={item.id}>
            <img src={item.image} alt={item.name} />
            <div>
              <p><strong>{item.name}</strong></p>
              <p>{item.description}</p>
              {item.color && <p className="cart-color">Color: {item.color}</p>}
              {item.size && <p className="cart-size">Size: {item.size}</p>}
              <p>Qty: {item.quantity}</p>
              <p>Price: {item.price}</p>
              {item.category === 'printing' || item.category === 'frames'}
              {(item.category === 'printing' || item.category === 'frames') && (
                    <div className="upload-section">
                    <h4>Upload (Max 5 images)</h4>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                        const files = Array.from(e.target.files);
                        if (files.length > 5) {
                            alert('Maximum 5 images allowed for this item.');
                            return;
                        }
                        const updatedPhotos = [...uploadedPhotos];
                        updatedPhotos[index] = files;
                        setUploadedPhotos(updatedPhotos);
                        }}
                    />
                    <p>{uploadedPhotos[index]?.length || 0} file(s) selected</p>
                    <button className="submit-btn" onClick={() => handleUpload(index)}>Upload</button>
                    </div>
                )}
            </div>
          </div>
        ))}
        </div>
        <h5>Total: LKR {getTotalAmount().toLocaleString()}</h5>

      </div>

      <div className="right-section">
        <h2>Delivery Details</h2>
        <form className="delivery-form">
          <input name="sender_phone_number" placeholder="Sender Phone Number" onChange={handleDeliveryChange} />
          <input name="receiver_phone_number" placeholder="Receiver Phone Number" onChange={handleDeliveryChange} />
          <input name="reciver_name" placeholder="Receiver Name" onChange={handleDeliveryChange} />
          <input name="reciver_address_district" placeholder="District" onChange={handleDeliveryChange} />
          <input name="receiver_address_city" placeholder="City" onChange={handleDeliveryChange} />
          <input name="receiver_address_street" placeholder="Street" onChange={handleDeliveryChange} />
        </form>

        <h2>Payment</h2>
        <div className="payment-options">
          <label>
            <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} />
            Cash on Delivery
          </label>
          <label>
            <input type="radio" name="payment" value="online" checked={paymentMethod === 'online'} onChange={() => {
              setPaymentMethod('online');
              setIsPayment(true); 
            }} />
            Online Payment
          </label>
        </div>

        <button className="submit-btn" onClick={handleSubmit}>Place Order</button>
      </div>
    </div>
    <AppFooter />

    {isPayment && (
      <div className="custom-modal-overlay">
        <div className="custom-modal-box">
          <button className="close-button" onClick={() => setIsPayment(false)}>✖</button>
          <Payment />
        </div>
      </div>
    )}
    </>
  );
};

export default ConfirmOrder;
