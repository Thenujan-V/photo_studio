import React from 'react';
import { useParams } from 'react-router-dom';
import '../style/ServiceDetails.scss';
import AppNavbar from '../components/Navbar';
import AppFooter from '../components/footer'

export const ServiceDetails = () => {
    const { category } = useParams();
    function handleAddToCard(id, category) {
      console.log("category:", category);
    }
    const services = [
        {
          "category": "photography",
          "services": [
            {
              "name": "Tamil Wedding Shoot",
              "description": "Traditional Tamil wedding photography with candid and posed shots.",
              "price": "LKR 25,000 – 60,000",
              "image" : "https://cdn0.weddingwire.in/vendor/9812/3_2/960/jpg/435930296-729066849153426-1695746735005873786-n_15_469812-172199018480648.jpeg"
            },
            {
              "name": "Sinhala Wedding Shoot",
              "description": "Elegant Sinhala wedding coverage with attention to rituals and moments.",
              "price": "LKR 30,000 – 70,000",
              "image":  "https://www.ferndara.com.au/wp-content/uploads/2019/07/RUK0365-1200x900.jpg"
            },
            {
              "name": "Birthday Photography",
              "description": "Fun and colorful birthday celebration coverage for all age groups.",
              "price": "LKR 10,000 – 25,000",
              "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyLVGvPq3TVe-jPVTmskGa_s8STQXrMfAzpg&s"
            },
            {
              "name": "Bridal Shoot",
              "description": "Exclusive bridal photo session with lighting, makeup, and styling.",
              "price": "LKR 20,000 – 40,000",
              "image": "https://www.weddingphotoplanet.com/admin_image/slider/13012245661647863146Beautiful-Bride-Photo-Shoot.jpg"
            }
          ]
        },
        {
          "category": "videography",
          "services": [
            {
              "name": "Wedding Videography",
              "description": "Full-day wedding video coverage with cinematic editing.",
              "price": "LKR 40,000 – 100,000"
            },
            {
              "name": "Event Highlights",
              "description": "Short highlight video for events like birthdays, engagements, etc.",
              "price": "LKR 15,000 – 30,000"
            },
            {
              "name": "Drone Videography",
              "description": "Aerial videography for weddings and outdoor events.",
              "price": "LKR 20,000 – 45,000"
            }
          ]
        },
        {
          "category": "frames",
          "services": [
            {
              "name": "Wooden Frame - A4",
              "description": "Handmade wooden frame, suitable for certificates and portraits.",
              "material": "Mahogany Wood",
              "color": "Dark Brown",
              "size": "A4",
              "price": "LKR 1,200"
            },
            {
              "name": "Metal Frame - 16x20",
              "description": "Sleek modern aluminum frame for family photos.",
              "material": "Aluminum",
              "color": "Silver",
              "size": "16x20 inches",
              "price": "LKR 2,500"
            },
            {
              "name": "Custom Decorative Frame",
              "description": "Personalized frame with design of your choice.",
              "material": "Wood or Metal",
              "color": "Custom",
              "size": "Custom",
              "price": "Starting from LKR 3,000"
            }
          ]
        },
        {
          "category": "printing",
          "services": [
            {
              "name": "Mug Printing",
              "description": "Custom photo or text printed on ceramic mugs.",
              "price": "LKR 900 – 1,500"
            },
            {
              "name": "Plate Printing",
              "description": "Decorative photo printing on ceramic plates.",
              "price": "LKR 1,500 – 2,500"
            },
            {
              "name": "T-shirt Printing",
              "description": "High-quality heat transfer or screen printing on T-shirts.",
              "price": "LKR 1,200 – 2,000"
            },
            {
              "name": "Canvas Printing",
              "description": "Gallery-style canvas photo prints in various sizes.",
              "price": "LKR 2,000 – 5,000"
            }
          ]
        },
        {
          "category": "in-studio",
          "services": [
            {
              "name": "Passport Photo",
              "description": "Official-sized passport photos with instant delivery.",
              "price": "LKR 300"
            },
            {
              "name": "Family Portrait",
              "description": "Professional indoor family photo sessions.",
              "price": "LKR 3,000 – 6,000"
            },
            {
              "name": "Kids Studio Shoot",
              "description": "Creative and fun shoots for toddlers and kids.",
              "price": "LKR 2,000 – 4,500"
            },
            {
              "name": "Maternity Shoot",
              "description": "Elegant and emotional maternity portraits in studio setup.",
              "price": "LKR 4,000 – 7,500"
            }
          ]
        }
      ]

      
    const categoryData = services.find((s) => s.category === category);

    if (!categoryData) return <div>Category not found</div>;

  return (
    <>
        <AppNavbar />
        <section className="services-hero text-center p-5">
            <h1>Timeless Photography & Stunning Visual Creations</h1>
            <p>We specialize in professional photography, videography, high-quality photo printing, and custom framing to bring your stories to life.</p>
        </section>
        <div className="details-container">
            <h1>{categoryData.category} Services</h1>
            <div className="services-grid">
                {categoryData.services.map((service, index) => (
                    <div key={index} className="service-card">
                        <img src={service.image} alt={service.name} className="service-image" />
                        <h4>{service.name}</h4>
                        <p>{service.description}</p>
                        {service.material && (
                            <p><strong>Material:</strong> {service.material}</p>
                        )}
                        {service.size && (
                            <p><strong>Size:</strong> {service.size}</p>
                        )}
                        {service.color && (
                            <p><strong>Color:</strong> {service.color}</p>
                        )}
                        <p><strong>Price:</strong> {service.price}</p>
                        <div className="service-buttons">
                            <button className="add-cart-btn" onClick={() => handleAddToCard(index, categoryData.category)}>Add to Cart</button>
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
