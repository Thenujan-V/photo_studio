import React from 'react'
import { Link } from 'react-router-dom'
import AppNavbar from '../components/Navbar'
import '../style/About.scss'
import creativity from '../assets/creativity.png'
import innovation from '../assets/innovation.png'
import passion from '../assets/passion.png'
import reliability from '../assets/reliablity.png'
import satisfaction from '../assets/satisfaction.png'
import precision from '../assets/precision.png'
import AppFooter from '../components/footer'


const About = () => {
  return (
    <div>
        <AppNavbar />
      <>
        <section className="about-hero">
          <h1>Capturing Moments, Creating Memories</h1>
          <p>
          We turn moments into memories through bold, artistic photography that speaks louder than words.</p>
          <Link to="/services">
            <button className="btn w-100">Discover Our Services</button>
          </Link>
        </section>

        <div className="container" id="business-overview">
          <h1>Business Overview</h1>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12" id="about-image">
              <img
                className="img-fluid"
                src="https://px-web-images9.pixpa.com/qT39ok7D_mJo4gccnRQOIWrLbohRpe0jzLn_ucTR5G0/rs:fit:1200:0/q:80/aHR0cHM6Ly9waXhwYWNvbS1pbWcucGl4cGEuY29tL2NvbS9hcnRpY2xlcy8xNTE4NDM4Nzg0LXNodXR0ZXJzdG9ja18xOTE4NDIzODguanBn"
                alt="overview-image"
              />
            </div>
            <div className="col-lg-6 col-md-6 col-12" id="overview">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni atque corrupti tenetur eveniet ut iure quaerat, veniam aspernatur totam quas placeat, iusto obcaecati autem quod qui, ad rerum nostrum culpa earum veritatis blanditiis. Culpa similique odio labore sequi, placeat eaque quisquam esse, repellat distinctio eveniet officia! Perferendis sint, blanditiis amet labore aliquid eius quia saepe esse laudantium ducimus omnis, et molestias ullam minus modi, officiis quaerat vitae enim? Illum aliquid distinctio provident fuga possimus explicabo cumque repellat aspernatur culpa iusto voluptatem vel recusandae quidem dolorum veritatis debitis quibusdam iste fugiat laboriosam dolorem, obcaecati minus facilis nisi. Aspernatur est qui eos.              </p>
            </div>
          </div>
        </div>

        <div className="container" id="mission">
          <h1>Mission & Vision</h1>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12" id="mission-content">
              <div>
                <h3>Mission</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum inventore cumque necessitatibus corporis rerum iusto aperiam porro dolor quo mollitia quaerat modi facere, enim dolorum, dolores earum itaque obcaecati accusamus in doloribus qui? Quae distinctio qui facilis atque libero! Provident odio doloremque assumenda at numquam, vel tenetur eaque quas nemo!
                </p>
              </div>
              <div className="mt-5">
                <h3>Vision</h3>
                <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum inventore cumque necessitatibus corporis rerum iusto aperiam porro dolor quo mollitia quaerat modi facere, enim dolorum, dolores earum itaque obcaecati accusamus in doloribus qui? Quae distinctio qui facilis atque libero! Provident odio doloremque assumenda at numquam, vel tenetur eaque quas nemo!
                </p>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12" id="mission-image">
              <img
                className="img-fluid"
                src="https://st5.depositphotos.com/1096467/64753/i/450/depositphotos_647534160-stock-photo-silhouettes-photographers-photographing-istanbul-evening.jpg"
                alt="vision-image"
              />
            </div>
          </div>
        </div>

      <div className="container-fluid" id="core-values">
        <h1>The Heart of Our Company</h1>
        <div className="row" id="values">
          <div className="col-lg-4 col-md-4 col-12 value">
            <img src={creativity} alt="creativity" />
            <h2>Creativity</h2>
            <p>
            We embrace change and continuously explore new ways to solve real-world problems with cutting-edge technologies.
            </p>
          </div>
          <div className="col-lg-4 col-md-4 col-12 value">
            <img src={precision} alt="precision" />
            <h2>Precision </h2>
            <p>
            very detail matters. From lighting to editing, we ensure each image meets the highest standards.
            </p>
          </div>
          <div className="col-lg-4 col-md-4 col-12 value">
            <img src={ satisfaction} alt="satisfaction" />
            <h2>Client Satisfaction</h2>
            <p>
            Your happiness is our priority. We listen closely to your needs and exceed expectations in every session.
            </p>
          </div>
        </div>
        <div className="row" id="values">
          <div className="col-lg-4 col-md-4 col-12 value">
            <img src={ innovation} alt="innovation" />
            <h2>Innovation </h2>
            <p>
            We embrace modern photography techniques and cutting-edge technology to deliver fresh, dynamic visuals.
            </p>
          </div>
          <div className="col-lg-4 col-md-4 col-12 value">
            <img src={ reliability} alt="reliability" />
            <h2>Reliability </h2>
            <p>
            You can count on us for punctuality, professionalism, and consistent quality every time.
            </p>
          </div>
          <div className="col-lg-4 col-md-4 col-12 value">
            <img src={ passion} alt="passion" />
            <h2>Passion </h2>
            <p>
            Photography isn’t just our job — it’s our passion. We pour our heart into every frame to create lasting memories.
            </p>
          </div>
        </div>
      </div>
    </>
    < AppFooter />
    </div>
  )
}

export default About