import React from 'react'
import { useState } from 'react'; 
import AppNavbar from '../components/Navbar'
import '../style/Contact.scss'
import studioImage from '../assets/wedding.webp'
import AppFooter from '../components/footer'
import { createInquiry } from '../Services/inquiryService';
import { triggerNotification } from '../Services/notificationService';


const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (formData.name.length < 4) {
      newErrors.name = "Name must be at least 4 characters.";
    } else if (formData.name.length > 20) {
      newErrors.name = "Name must not exceed 20 characters.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Inquiry message is required.";
    } else if(formData.message.length < 20){
      newErrors.message = "Minimum number of letters 20."
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form submitted:", formData);
      const inquiryData = { userName: formData.name, mail: formData.email, inquiryMsg: formData.message } 
      const inquiryCreateResult = await createInquiry(inquiryData)
      if(inquiryCreateResult.status === 201){
        triggerNotification("Successfully added inquiry.", "success")
      }
      else{
        triggerNotification("Failed to add inquiry.", "error")
      }
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    } else {
      triggerNotification("Failed to add inquiry.", "error")
      setSubmitted(false);
    }
  };

  return (
    <>
    <AppNavbar/>
      <section className="contact-hero text-center p-5">
        <h1>Get in Touch With Us</h1>
        <p>
          Whether you have a question, need support, or want to explore opportunities to work together — our team is here to help.
        </p>
      </section>

      <div className="contact-info-container">
        <div className="contact-image">
          <img src={studioImage} alt="Studio" />
        </div>
        <div className="contact-details">
          <h2>Contact Our Studio</h2>
          <p><strong>Studio Name:</strong> Photo Studio</p>
          <p><strong>Address:</strong> 123 Main Street, Colombo, Sri Lanka</p>
          <p><strong>Hotline:</strong> +94 11 123 4567</p>
          <p><strong>Mobile:</strong> +94 75 565 4544</p>
          <p><strong>Email:</strong> photostudio@gmail.com</p>
          <p><strong>WhatsApp:</strong> +94 70 456 0876</p>
          <p><strong>Facebook:</strong> <a href="https://facebook.com/photostudio" target="_blank" rel="noopener noreferrer">facebook.com/photoStudio</a></p>
          <p><strong>Instagram:</strong> <a href="https://instagram.com/photostudio" target="_blank" rel="noopener noreferrer">@photoStudio</a></p>
        </div>
      </div>

      <div className="container" id="contactusForm">
        <div className="col-xl-12 col-lg-12 col-12 p-0 m-0" id="form">
          <h1>We’re Just a Message Away</h1>
          <p>
          Please fill out the form below with your name, email address, and a brief message about your inquiry.          </p>
          <form onSubmit={handleSubmit} noValidate>

          <div className="mb-3 form-group">
            <label>Name</label>
            <input
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
            {errors.name && <small className="text-danger">{errors.name}</small>}
          </div>

          <div className="mb-3 form-group">
            <label>Email</label>
            <input
              className="form-control"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && (
              <small className="text-danger">{errors.email}</small>
            )}
          </div>

          <div className="mb-3 form-group">
            <label>Inquiry Message</label>
            <textarea
              className="form-control"
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter your message"
            />
            {errors.message && (
              <small className="text-danger">{errors.message}</small>
            )}
          </div>

          {/* Success or Error */}
          {submitted && (
            <div className="text-success mb-3">Thank you! Message sent.</div>
          )}

          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </form>
        </div>
      </div>

      <div className="container-fluid" style={{ width: '100%', height: '400px', marginBottom: '70px' }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63371.81536310962!2d79.81500566499896!3d6.921836877838611!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo!5e0!3m2!1sen!2slk!4v1746112191391!5m2!1sen!2slk"          width="100%"
          height="450"
          style={{ border: 0, borderRadius: '10px', boxShadow: '4px 4px 18px black' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    <AppFooter />
    </>
  );
}

export default Contact



