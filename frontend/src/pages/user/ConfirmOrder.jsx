import React, { useEffect, useState } from 'react';
import {  useLocation } from 'react-router-dom';
import '../../style/ConfirmOrder.scss';
import AppNavbar from '../../components/Navbar';
import AppFooter from '../../components/footer';
import Payment from '../../components/Payment';
import { clientsUploadPhotos, createOrderDelivery, fetchOrdersByClientId } from '../../Services/orderService';
import { decodedToken } from '../../Services/getToken ';
import { triggerNotification } from '../../Services/notificationService';
import { createPayment } from '../../Services/paymentServices';
import { useNavigate } from 'react-router-dom';


const ConfirmOrder = () => {
  const location = useLocation();
  const { selectedItems, orderId } = location.state || []
  const [orderDetails, setOrderDetails] = useState([])
  const [isPayment , setIsPayment] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [deliveryInfo, setDeliveryInfo] = useState({
    sender_phone_number: '',
    receiver_phone_number: '',
    receiver_name: '',
    receiver_address_district: '',
    receiver_address_city: '',
    receiver_address_street: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentData, setPaymentData] = useState('')
  const navigate = useNavigate();


  const token = decodedToken()
  const clientId = token.userId 

  const districts = [
    'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
    'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
    'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
    'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
    'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
  ];

  useEffect( () => {
    const fetchOders =  async() =>{
      await fetchOrdersByClientId(clientId)
        .then(res => {
          const responseData = res.data.enrichedOrderDetails

          if(orderId){
            const currentorders = responseData?.filter( item => item.orderId === orderId)
            setOrderDetails(currentorders)
            console.log("co :", currentorders)
          }
        })
        .catch(err => console.log("error when fetch orders. ", err))
    }
  
    if(clientId){
      fetchOders()
    }
  }, [clientId, orderId])
  

  const handleUpload = async (orderDetailsId, index) => {
    // console.log("oid :", orderDetailsId)
    const filesToUpload = uploadedPhotos[index];
    // console.log("inde :", filesToUpload)

    // const [selectedDistrict, setSelectedDistrict] = useState('');

  
    if (!filesToUpload || filesToUpload.length === 0) {
      triggerNotification("No files selected to upload.");
      return;
    }
  
    if (filesToUpload.length > 10) {
      triggerNotification("Maximum 10 images allowed.");
      return;
    }
  
    const formData = new FormData();
    filesToUpload.forEach((file) => {
      formData.append("photos", file);
    });

    try {
      const response = await clientsUploadPhotos(orderDetailsId, formData)
      console.log("responnn :", response)
      if (response.status !== 201) throw new Error("Upload failed.");
      triggerNotification("Images uploaded successfully!", "success");

    } catch (error) {
      console.error("Error uploading images:", error);
      triggerNotification("Image upload failed.");
      window.location.reload()
    }
  };

  const getTotalAmount = () => {
    return selectedItems?.reduce((total, item) => {
      const numericPrice = parseInt(item.servicePrice.replace(/[^\d]/g, ''), 10);
      return total + numericPrice * item.quantity;
    }, 0);
  };

  const handleDeliveryChange = (e) => {
    const { name, value } = e.target;
      setDeliveryInfo((prev) => ({ ...prev, [name]: value }));
  };

  const validations = () => {
    const missingUploads = orderDetails.some((item, index) => {
        return (item.serviceCategory === 'printings' || item.serviceCategory === 'frame making') && 
               (!uploadedPhotos[index] || uploadedPhotos[index].length === 0);
      });
      if (missingUploads) {
        triggerNotification("Please upload at least one image for all printing or frame items.", "error");
        return;
      }
      const isDeliveryInfoIncomplete = Object.values(deliveryInfo).some(value => value.trim() === '');

      if (isDeliveryInfoIncomplete) {
        triggerNotification("Please fill in all delivery details before placing the order.", "error");
        return;
      }
      if(!isDeliveryInfoIncomplete){
        if(deliveryInfo.sender_phone_number.length < 10 || deliveryInfo.receiver_phone_number.length < 10 ){
          triggerNotification("Phone number must be atleast 10 characters.", "error");
          return;
        }
        if(!/^\d+$/.test(deliveryInfo.sender_phone_number) || !/^\d+$/.test(deliveryInfo.receiver_phone_number) ){
          triggerNotification("Phone number couldn't have characters.", "error");
          return;
        }
        if(deliveryInfo.receiver_name.length < 4 ){
          triggerNotification("Reciever name must be atleast 4 characters.", "error");
          return;
        }
        if( !/^[A-Za-z\s]+$/.test(deliveryInfo.receiver_name) ){
          triggerNotification("Name must contain only letters and spaces.", "error");
          return;
        }
      }
  };

  const handleSubmit = async() => {
    validations()
    const deliveryDetails = { senderPhoneNumber: deliveryInfo.sender_phone_number,
                              receiverName: deliveryInfo.receiver_name, 
                              receiverPhoneNumber: deliveryInfo.receiver_phone_number, 
                              receiverDistrict: deliveryInfo.receiver_address_district, 
                              receiverCity: deliveryInfo.receiver_address_city, 
                              receiverStreet: deliveryInfo.receiver_address_street
                            }

    const totalAmount = getTotalAmount()

    try{
      const deliveryDetailsSave = await createOrderDelivery(orderId, deliveryDetails)
      if(deliveryDetailsSave.status === 201){
        triggerNotification("Sccessfully saved delivery details.", "Success")
        
    if(paymentMethod === 'Cash'){
      setPaymentData({ orderId, clientId, totalAmount, paymentMethod, status: 'processing'})
      const placeOrder = await createPayment(paymentData)
        if(placeOrder.status === 201){
          triggerNotification("Sccessfully Place Order.", "Success")
          navigate('/invoice', { state: {selectedItems, orderId} })
          
        }
    } 
      }
      else{
        triggerNotification("Something went wrong when save delivbery detailsl. Try again.", "error")
      }
    }catch(err){
      console.log('error occured when place order.', err) 
    }
  }

    const handlePaymentResult = (success) => {
    const totalAmount = getTotalAmount()
    if (success) {
    } else {

    } 
    setIsPayment(false);
    };

  return (
    <>
    <AppNavbar />
    <div className="confirm-order-container">
      <div className="left-section">
        <h2>Selected Items</h2>
        <div className="selected-items-scroll">
        {orderDetails && orderDetails.map((item, index) => (
          <div className="selected-item" key={item.orderDetailsId}>
            <img src={item.serviceDetails.photoPaths[1]} alt={item.serviceDetails.serviceName} />
            <div>
              <p><strong>{item.serviceDetails.serviceName}</strong></p>
              <p>{item.serviceDetails.description}</p>
              {item.serviceDetails.color && <p className="cart-color">Color: {item.serviceDetails.color}</p>}
              {item.serviceDetails.size && <p className="cart-size">Size: {item.serviceDetails.size}</p>}
              <p>Qty: {item.quantity}</p>
              <p>Price: {item.serviceDetails.servicePrice}</p>
              {item.serviceCategory === 'printings' || item.serviceCategory === 'frame making'} 
              {(item.serviceCategory === 'printings' || item.serviceCategory === 'frame making') && (
                    <div className="upload-section">
                      <h4>Upload (Max 5 images)</h4>
                      <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => {
                          const files = Array.from(e.target.files);
                          if (files.length > 5) {
                              triggerNotification('Maximum 5 images allowed for this item.');
                              return;
                          }
                          const updatedPhotos = [...uploadedPhotos];
                          updatedPhotos[index] = files;
                          setUploadedPhotos(updatedPhotos);
                          }}
                      />
                      <p>{uploadedPhotos[index]?.length || 0} file(s) selected</p>
                      <button className="submit-btn" onClick={() => handleUpload(item.orderDetailsId, index)}>Upload</button>
                    </div>
                )}
            </div>
          </div>
        ))}
        </div>
        <h5>Total: LKR {getTotalAmount()?.toLocaleString()}</h5>

      </div>

      <div className="right-section">
        <h2>Delivery Details</h2>
        <form className="delivery-form">
          <input name="sender_phone_number" type='tel' pattern="[0-9]{10}" placeholder="Sender Phone Number" onChange={handleDeliveryChange} required/>
          <input name="receiver_phone_number" type='tel' pattern="[0-9]{10}" placeholder="Receiver Phone Number" onChange={handleDeliveryChange} required/>
          <input name="receiver_name" type='text' placeholder="Receiver Name" onChange={handleDeliveryChange} required/>
          {/* <input name="reciver_address_district" placeholder="District" onChange={handleDeliveryChange} required /> */}
          <select
              name="receiver_address_district"
              onChange={handleDeliveryChange}
              value={deliveryInfo.receiver_address_district}
              required
            >
              <option value="" disabled selected hidden>Receiver District</option>
              {districts.map((district, index) => (
                <option key={index} value={district}>
                  {district}
                </option>
              ))}
          </select>
          <input name="receiver_address_city" placeholder="City" onChange={handleDeliveryChange} required/>
          <input name="receiver_address_street" placeholder="Street" onChange={handleDeliveryChange} required/>
        </form>

        <h2>Payment</h2>
        <div className="payment-options">
          <label>
            <input type="radio" name="payment" value="Cash" checked={paymentMethod === 'Cash'} onChange={() => setPaymentMethod('Cash')} />
            Cash on Delivery
          </label>
          <label>
            <input type="radio" name="payment" value="Card" checked={paymentMethod === 'Card'} onChange={() => {
              setPaymentMethod('Card');
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
          <Payment 
            onOk={() => setIsPayment(false)}
            paymentDetails={{orderId, clientId, totalAmount: getTotalAmount(), paymentMethod}}
          />
        </div>
      </div>
    )}
    </>
  );
};

export default ConfirmOrder;
