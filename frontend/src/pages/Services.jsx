import React, { useEffect } from 'react'
import AppNavbar from '../components/Navbar'
import '../style/Service.scss'
import professional from "../assets/professional.png"
import premium from "../assets/premium.png"
import quick from "../assets/quick.png"
import customized from "../assets/Customized.png"
import AppFooter from '../components/footer'
import { Link } from 'react-router-dom';
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { createFeedbacks } from '../Services/feedbackService'
import {  decodedToken } from '../Services/getToken '
import { triggerNotification } from '../Services/notificationService'


const Services = () => {

  const [review, setReview] = useState({ name: '', mailId: '', feedback: '' });
  const [touched, setTouched] = useState({});
  const [ratingNo, setRatingNo] = useState(0);
  const [successMessage, setSuccessMessage] = useState(false);
  const [clientId, setClientId] = useState('')

  useEffect(() => {
    const token = decodedToken()
    setClientId(token?.userId)

  }, [])

  const handleChange = (e) => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const setRating = (star) => {
    setRatingNo(star);
  };

    const validate = () => {
      return {
        name: review.name.trim() === '',
        mailId:
          review.mailId.trim() === '' ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(review.mailId),
        feedback: review.feedback.trim() === '',
      };
    };

    const errors = validate();
    const isFormValid = !Object.values(errors).some((x) => x);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (isFormValid) {
        const feedBackForm = { feedback: review.feedback, rating: ratingNo }
        const addFeedbackResult = await createFeedbacks(clientId, feedBackForm) 
        if(addFeedbackResult.status === 201){
          setSuccessMessage(true);
          setReview({ name: '', mailId: '', feedback: '' });
          setTouched({});
          setRatingNo(0);
        }
        else{
          triggerNotification("Feddback Failed.", "error")
        }
        
      } else {
        setTouched({ name: true, mailId: true, feedback: true });
      }
    };

  return (
    <div>
        <AppNavbar />
        <>
          <section className="services-hero text-center p-5">
            <h1>Timeless Photography & Stunning Visual Creations</h1>
            <p>We specialize in professional photography, videography, high-quality photo printing, and custom framing to bring your stories to life.</p>
            {/* <button className="btn" onClick={() => navigate('/contact')}>Contact Us</button> */}
          </section>
        </>

        <section className="studio-services">
          <h2 className="section-title">Explore Our Studio Services</h2>
          <p>Discover a vibrant range of services tailored to capture and preserve your most cherished moments. From stunning photography and cinematic videography to expert frame making, premium printing, and personalized in-studio sessions — our studio offers everything you need under one creative roof.</p>
          <div className="service-container">
            <Link to="/services/1" className="service-item large">Photography</Link>
            <Link to="/services/4" className="service-item tall">Videography</Link>
            <Link to="/services/3" className="service-item wide">Frame Making</Link>
            <Link to="/services/2" className="service-item small">Printing</Link>
            <Link to="/services/5" className="service-item medium">In-Studio Shots</Link>
          </div>
        </section>

        <div className="container-fluid row" id="choose">
          <h1>Why Choose Us</h1>
          <div className="row values">
            <div className="col-lg-3 col-md-6 col-6 value">
              <img src={professional} alt="Professional Photographers" />
              <h2>Professional Team</h2>
              <p>Our experienced photographers and videographers bring creativity and precision to every project, capturing moments just as you imagine—or better.</p>
            </div>
            <div className="col-lg-3 col-md-6 col-6 value">
              <img src={customized} alt="Tailored Services" />
              <h2>Customized Services</h2>
              <p>Whether it’s a wedding, portrait, or corporate shoot, we tailor our photography and printing services to your specific needs and style.</p>
            </div>
            <div className="col-lg-3 col-md-6 col-6 value">
              <img src={premium} alt="Premium Quality Prints" />
              <h2>Premium Quality</h2>
              <p>We use high-end equipment and materials to ensure that every photo, video, print, and frame meets professional standards and lasts a lifetime.</p>
            </div>
            <div className="col-lg-3 col-md-6 col-6 value">
              <img src={quick} alt="Quick Delivery" />
              <h2>Quick Turnaround</h2>
              <p>We value your time. Our team delivers edited photographs, videos, and framed prints promptly—without compromising on quality.</p>
            </div>
          </div>
        </div>

        {clientId && <div className="container" id="review">
          <form onSubmit={handleSubmit} className="review-form">
            <h1>Leave a Review</h1>
            {successMessage && (
              <p id="review-res">Thank you for your valuable feedback!</p>
            )}

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={review.name}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {touched.name && errors.name && (
              <p className="text-danger w-100 text-end p-0 m-0">Name is required.</p>
            )}

            <input
              type="email"
              name="mailId"
              placeholder="Your Email"
              value={review.mailId}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {touched.mailId && (
              <p className="text-danger w-100 text-end p-0 m-0">
                {errors.mailId && review.mailId.trim() === '' && 'Email is required.'}
                {errors.mailId &&
                  review.mailId.trim() !== '' &&
                  'Enter a valid email address.'}
              </p>
            )}

            <textarea
              name="feedback"
              placeholder="Write your feedback..."
              value={review.feedback}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {touched.feedback && errors.feedback && (
              <p className="text-danger w-100 text-end p-0 m-0">Feedback is required.</p>
            )}

            <div className="stars">
              <div>
                {[1, 2, 3, 4, 5].map((star) => (
                  <label key={star} onClick={() => setRating(star)} style={{ cursor: 'pointer' }}>
                    <FontAwesomeIcon
                      icon={star <= ratingNo ? faStarSolid : faStarRegular}
                      className="me-1 fa-3x"
                      style={{ color: 'gold' }}
                    />
                  </label>
                ))}
              </div>
              <p>How would you rate our service?</p>
            </div>

            <button type="submit">Submit</button>
          </form>
        </div>}

        < AppFooter />
    </div>
  )
}

export default Services