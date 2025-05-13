import React, { useState } from 'react'
import '../style/Payment.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCcVisa,faCcMastercard} from '@fortawesome/free-brands-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { triggerNotification } from '../Services/notificationService';

const Payment = ({onOk}) => {
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!/^\d{16}$/.test(formData.cardNumber)) newErrors.cardNumber = 'Card number must be 16 digits';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiry)) newErrors.expiry = 'Expiry must be in MM/YY format';
    if (!/^\d{3}$/.test(formData.cvv)) newErrors.cvv = 'CVV must be 3 digits';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      triggerNotification("Payment Success", "success");
      setTimeout(() => {
        onOk();
      }, 3000); 
    } else {
      setErrors(validationErrors);
      triggerNotification("Payment failed", "error");
    }
  };

  return (
    <>
      <div className="payment-form">
        <h2>Card Details</h2>
        <div className="card-icons">
              <FontAwesomeIcon icon={faCcVisa} size="3x" color="#1a1f71" />
              <FontAwesomeIcon icon={faCcMastercard} size="3x" color="#eb001b" />
            </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name on Card</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
            {errors.name && <small>{errors.name}</small>}
          </div>

          <div className="form-group">
            <label>Card Number</label>
            <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleChange} maxLength={16} />
            {errors.cardNumber && <small>{errors.cardNumber}</small>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Expiry Date (MM/YY)</label>
              <input type="text" name="expiry" value={formData.expiry} onChange={handleChange} placeholder="MM/YY" />
              {errors.expiry && <small>{errors.expiry}</small>}
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input type="text" name="cvv" value={formData.cvv} onChange={handleChange} maxLength={3} />
              {errors.cvv && <small>{errors.cvv}</small>}
            </div>
          </div>

          <button type="submit">Pay Now</button>
        </form>
      </div>
    </>
  )
}

export default Payment
