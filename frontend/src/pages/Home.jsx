import React from 'react'
import AppNavbar from '../components/Navbar'
import Carousel from 'react-bootstrap/Carousel'
import '../style/Home.scss'
import AppFooter from '../components/footer'
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
        <div className='home'>
        <AppNavbar />
        <section className='imgSec'>
          <Carousel>
            <Carousel.Item>
              <div className='image1'>
                <h1>"Wedding memories captured with elegance and heart."</h1>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className='image2'>
                <h1>"Celebrate your graduation with stunning portraits."</h1>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className='image3'>
                <h1>"Joyful clicks for your birthday and special days."</h1>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className='image4'>
                <h1>"Pre-shoots that tell your unique story."</h1>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className='image5'>
                <h1>"Love-filled engagement moments, beautifully framed."</h1>
              </div>
            </Carousel.Item>
          </Carousel>
        </section>
        <section className='aboutSec'>
          <div className='container-fluid'>
            <div className='row aboutRow'> 
              <div className='col-12 col-md-6 aboutImg'>
                <h1>About Us</h1>
              </div>
              <div className='col-12 col-md-6 aboutBody'>
                <h4>"Your Story. Your Moments. Captured with Passion, Framed with Perfection"</h4>
                <p>
                  Welcome to our photo studio, where every moment is turned into a lasting memory. With a passion for storytelling through the lens, we specialize in capturing the most cherished occasions of your life—be it weddings, graduations, birthdays, or professional portraits. Step into our studio and let us turn your moments into art you’ll treasure forever.
                </p>
                <Link to='/about' className='aboutLink'>See more</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="studio-services">
          <h2 className="section-title">Explore Our Studio Services</h2>
          <p>Discover a vibrant range of services tailored to capture and preserve your most cherished moments. From stunning photography and cinematic videography to expert frame making, premium printing, and personalized in-studio sessions — our studio offers everything you need under one creative roof.</p>
          <div className="service-container">
            <Link to="/services/photography" className="service-item large">Photography</Link>
            <Link to="/services/videography" className="service-item tall">Videography</Link>
            <Link to="/services/frames" className="service-item wide">Frame Making</Link>
            <Link to="/services/printing" className="service-item small">Printing</Link>
            <Link to="/services/in-studio" className="service-item medium">In-Studio Shots</Link>
          </div>
        </section>
        </div>
        <AppFooter />
    </div>
  )
}

export default Home