import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
    const [serviceCategory, setServiceCategory] = useState("");


    useEffect(() => {
      const fetchServices = async() => {
        try{
          const servicesResponse = await fetchServicesByCategoryId(categoryId)
          const { serviceCategory, services } = servicesResponse.data.servicesDetails;

          setStudioServices(services)
          setServiceCategory(serviceCategory)

        }catch(err){
          throw err
        }
      }

      if(categoryId){
        fetchServices()
      }
    }, [categoryId])


    const handleAddToCard = async(categoryId, serviceId) =>  {
      try{
        const tokenDecode = decodedToken()
        const cartItem = { clientId: tokenDecode.userId, categoryId, serviceId} 

        const addToCart = await createCartItems(cartItem)
        console.log("add :", addToCart)
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

  return (
    <>
        <AppNavbar />
        <section className="services-hero text-center p-5">
            <h1>Timeless Photography & Stunning Visual Creations</h1>
            <p>We specialize in professional photography, videography, high-quality photo printing, and custom framing to bring your stories to life.</p>
        </section>
        <div className="details-container">
            <h1>{serviceCategory} Services</h1>
            <div className="services-grid">
                {StudioServices.map((service, index) => (
                    <div key={index} className="service-card">
                        <img src={service.photoPaths[0]} alt={service.serviceName} className="service-image" />
                        <h4>{service.serviceName}</h4>
                        <p>{service.description}</p>
                        {service.material && (
                            <p><strong>Material:</strong> {service.material}</p>
                        )}
                        {service.frameSize && (
                            <p><strong>Size:</strong> {service.frameSize}</p>
                        )}
                        {service.framneColor && (
                            <p><strong>Color:</strong> {service.framneColor}</p>
                        )}
                        <p><strong>Price:</strong> {service.servicePrice}</p>
                        <div className="service-buttons">
                            <button className="add-cart-btn" onClick={() => handleAddToCard(service.serviceCategoryId, service.serviceId)}>Add to Cart</button>
                            <button className="book-now-btn">Book Now</button>
                        <a href={service.image} target="_blank" rel="noreferrer" className="view-photo-btn">
                            View Photo
                        </a>
                    </div>
                </div>
                ))}
            </div>
        </div>
        < AppFooter />
    </>
  )
}
