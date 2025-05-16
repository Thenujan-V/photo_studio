import React from 'react'
import AppNavbar from '../components/Navbar'
import AppFooter from '../components/footer'
import { useLocation } from 'react-router-dom';
import '../style/PhotoView.scss';

const PhotosView = () => {
    const location = useLocation();
    const { serviceName, description, photoPaths } = location.state || []
    const REACT_APP_PHOTO_PATH_URL = process.env.REACT_APP_PHOTO_PATH_URL

    return (
        <>
            <AppNavbar />
            <section className="photos-hero text-center p-5">
                <h1>{serviceName? `${serviceName}` : `Timeless Photography & Stunning Visual Creations`}</h1>
                <p>{description? `${description}` : `We specialize in professional photography, videography, high-quality photo printing, and custom framing to bring your stories to life.`}</p>
            </section>
            <section className='container-fluid photos-container'>
                <h1>{serviceName? `${serviceName} Photos` : `Photos`}</h1>
                <div class="row gallery-grid">
                    {
                        photoPaths ? (
                            photoPaths?.map(path => (
                                <div class="m-0 p-0 gallery-item">
                                    <img src={`${REACT_APP_PHOTO_PATH_URL}/${path}`} alt="eventphoto" class="img-fluid " />
                                </div>
                            ))
                        ) : <p>There are no photos in this service.</p>
                    }
                </div>
            </section>
            < AppFooter />
        </>
    )
}

export default PhotosView