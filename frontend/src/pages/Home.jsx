import React from 'react'
import AppNavbar from '../components/Navbar'
import Carousel from 'react-bootstrap/Carousel'
import '../style/Home.scss'
// import img1 from '../assets/img1.jpg';
// import img2 from '../assets/img2.jpg';
// import img3 from '../assets/img3.jpg';
// import img4 from '../assets/img4.jpg';
import img5 from '../assets/img5.jpg';
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
              <h1>About</h1>
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
        </div>
    </div>
  )
}

export default Home