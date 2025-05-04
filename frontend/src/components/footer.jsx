import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faHome, faEnvelope, faPhone, faPrint } from '@fortawesome/free-solid-svg-icons';

export const footer = () => {
  return (
    <div className="container-fluid mt-5 p-0">
      <footer className="text-center text-lg-start text-white" style={{ backgroundColor: 'var(--primary-color)' }}>
        <div className="container p-0">
          <section>
            <div className="row">
              <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
                <h6 className="text-uppercase mb-4 font-weight-bold">
                  Photo Studio
                </h6>
                <p>
                We offer top-notch photography, videography, framing, and printing services — all crafted with care, creativity, and quality to capture your best moments.
                </p>
              </div>

              <hr className="w-100 clearfix d-md-none" />

              <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
                <h6 className="text-uppercase mb-4 font-weight-bold">
                  Useful links
                </h6>
                <p><a href="#" className="text-white">Home</a></p>
                <p><a href="#" className="text-white">About</a></p>
                <p><a href="#" className="text-white">Services</a></p>
                <p><a href="#" className="text-white">Contact Us</a></p>
              </div>

              <hr className="w-100 clearfix d-md-none" />

              <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
                <h6 className="text-uppercase mb-4 font-weight-bold">Contact</h6>
                <p><FontAwesomeIcon icon={faHome} className="me-2" /> Colombo, 2nd Street 10012, Srilanka.</p>
                <p><FontAwesomeIcon icon={faEnvelope} className="me-2" /> inquiry@photoStudio.com</p>
                <p><FontAwesomeIcon icon={faPhone} className="me-2" /> +94 77 678 7678</p>
                <p><FontAwesomeIcon icon={faPrint} className="me-2" /> +94 70 609 7678</p>
              </div>
            </div>
          </section>

          <hr className="my-3" />

          <section className="p-3 pt-0 d-flex justify-content-between flex-wrap align-items-center">
            <div>
              <p className="p-3 m-0">© 2025 Copyright: photoStudio.com</p>
            </div>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="me-3 text-light">
                <FontAwesomeIcon icon={faFacebook} size="lg" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="me-3 text-light">
                <FontAwesomeIcon icon={faInstagram} size="lg" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-light">
                <FontAwesomeIcon icon={faLinkedin} size="lg" />
              </a>
            </div>
          </section>
        </div>
      </footer>
    </div>
  )
}


export default footer;
