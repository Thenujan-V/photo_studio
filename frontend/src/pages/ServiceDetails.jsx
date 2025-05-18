import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../style/ServiceDetails.scss';
import AppNavbar from '../components/Navbar';
import AppFooter from '../components/footer'
import { createCartItems } from '../Services/cartService';
import { triggerNotification } from '../Services/notificationService';
import {  decodedToken } from '../Services/getToken ';
import { fetchServicesByCategoryId } from '../Services/productsService';



export const ServiceDetails = () => {
    const { categoryId } = useParams();
    const [ StudioServices, setStudioServices ] = useState([])
    const [serviceCategory, setServiceCategory] = useState("")
    const navigate = useNavigate()

    const REACT_APP_PHOTO_PATH_URL = process.env.REACT_APP_PHOTO_PATH_URL

    useEffect(() => {
      const fetchServices = async() => {
        try{
          const servicesResponse = await fetchServicesByCategoryId(categoryId)
          const { serviceCategory, services } = servicesResponse.data.servicesDetails
          console.log('ss ', services)
          setStudioServices(services)
          setServiceCategory(serviceCategory)

        }catch(err){
          throw err
        }
      }

      if(categoryId){
        fetchServices()
      }
      else{
        setStudioServices([])
        setServiceCategory("")

      }
    }, [categoryId])


    const handleAddToCard = async(categoryId, serviceId) =>  {
      const tokenDecode = decodedToken()
      if(!tokenDecode?.userId){
        triggerNotification("You want to login first.")
      }
      try{
        const cartItem = { clientId: tokenDecode.userId, categoryId, serviceId} 
        const addToCart = await createCartItems(cartItem)
        if(addToCart.status === 201){
          triggerNotification("successfully added into cart.", "success")
        }else if(addToCart.status === 400){
          console.log("err")
          triggerNotification("This item already in cart.", "error")
        }
        else{
          triggerNotification("Add to cart faild.", "error")  

        }
      }
      catch(err){
        if(err.status === 400){
          triggerNotification("This item already in cart.", "error")
        }
        console.log("error in add to cart.",err)
      }
    }

    const viewPhotosOfService = (serviceName, description, photoPaths) => {
      console.log(serviceName, description, photoPaths)
      navigate('/view-service-photos', { state: { serviceName, description, photoPaths}})
    }

  return (
    <>
        <AppNavbar />
        <section className="services-hero text-center p-5">
            <h1>Timeless Photography & Stunning Visual Creations</h1>
            <p>We specialize in professional photography, videography, high-quality photo printing, and custom framing to bring your stories to life.</p>
        </section>
        <div className="container details-container">
            <h1>{serviceCategory? `${serviceCategory} Services` : `Services`}</h1>
            <div className="services-grid row">
                {StudioServices.length !== 0 ? (StudioServices.map((service, index) => (
                    <div key={index} className="service-card col-lg-3 col-md-4 col-6">
                        <img src={`${REACT_APP_PHOTO_PATH_URL}/${service.photoPaths[0]}`} alt={service.serviceName} className="service-image" />
                        <h4 className='mt-3'>{service.serviceName}</h4>
                        <p className='description'>{service.description}</p>
                        {service.material && (
                            <p><strong>Material:</strong> {service.material}</p>
                        )}
                        <div className='d-flex justify-content-center gap-3 '>
                          {service.frameSize && (
                              <p><strong>Size:</strong> {service.frameSize}</p>
                          )}
                          {service.framneColor && (
                              <p><strong>Color:</strong> {service.framneColor}</p>
                          )}
                        </div>
                        <p><strong>Price:</strong> LKR {service.servicePrice}</p>
                        <div className="service-buttons">
                            {service.serviceCategoryId !== 1 ?
                              (<button className="add-cart-btn w-75" onClick={() => handleAddToCard(service.serviceCategoryId, service.serviceId)}>
                                Add to Cart
                              </button>):
                              (<button className="add-cart-btn w-75" onClick={() => window.open('https://wa.me/1234567890', '_blank')}>
                                Call To Inquiry
                              </button>)
                            }
                        <button onClick={() => viewPhotosOfService(service.serviceName, service.description, service.photoPaths)} rel="noreferrer" className="view-photo-btn fw-bold w-75">
                            View Photo
                        </button>
                    </div>
                </div>
                ))): <p className='text-center'>There are no services available in this service category!</p> }
            </div>
        </div>
        < AppFooter />
    </>
  )
}
