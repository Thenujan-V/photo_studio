import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../style/AddServices.scss";
import {
  fetchserviceCategory,
  addServices,
} from "../../../Services/productsService";
import { triggerNotification } from "../../../Services/notificationService";

const AddServices = () => {
  const [serviceType, setServiceType] = useState("");
  const [formData, setFormData] = useState({});
  const [serviceCategory, setServiceCategory] = useState([]);
  const [photos, setPhotos] = useState([]);
  useEffect(() => {
    const fetchAllServiceCategory = async () => {
      try {
        const response = await fetchserviceCategory();
        const data = response.data.serviceCategories || [];
        setServiceCategory(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAllServiceCategory();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPhotos([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (photos.length > 10) {
      alert("You can upload a maximum of 10 photos.");
      return;
    }

    const data = new FormData();

    for (const key in formData) {
      data.append(key, formData[key]);
    }

    photos.forEach((photo) => {
      data.append("photos", photo);
    });

    for (let pair of data.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    try {
      const response = await addServices(data);
      if (response.status === 201) {
        setTimeout(
          triggerNotification("Successfully added service.", "success"),
          5000
        );
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      triggerNotification(`${err.response?.data?.message}`, "error");
    }
  };

  return (
    <>
      <h2 className="text-center fw-bolder fs-1 mb-4">Add New Service</h2>
      <form className="add-service-form" onSubmit={handleSubmit}>
        <label>Service Category</label>
        <select
          name="service_category_id"
          required
          onChange={(e) => {
            const selected = serviceCategory.find(
              (cat) => cat.id.toString() === e.target.value
            );
            setServiceType(selected?.category_name.toLowerCase());
            handleChange(e);
          }}
        >
          <option value="">Select Category</option>
          {serviceCategory.map((category) => (
            <option key={category.id} value={category.id}>
              {category.category_name}
            </option>
          ))}
        </select>

        {serviceType === "photosoot" && (
          <>
            <label>Photoshoot Name</label>
            <input
              type="text"
              name="photoshoot_name"
              onChange={handleChange}
              required
            />

            <label>Price</label>
            <input
              type="number"
              name="price"
              onChange={handleChange}
              required
            />

            <label>Duration</label>
            <input
              type="text"
              name="durarion"
              onChange={handleChange}
              required
            />

            <label>Description</label>
            <textarea
              name="description"
              onChange={handleChange}
              required
            ></textarea>
          </>
        )}

        {serviceType === "printings" && (
          <>
            <label>Printing Name</label>
            <input
              type="text"
              name="printing_name"
              onChange={handleChange}
              required
            />

            <label>Price</label>
            <input
              type="number"
              name="price"
              onChange={handleChange}
              required
            />

            <label>Description</label>
            <textarea
              name="description"
              onChange={handleChange}
              required
            ></textarea>
          </>
        )}

        {serviceType === "frame making" && (
          <>
            <label>Material Name</label>
            <input
              type="text"
              name="material_name"
              onChange={handleChange}
              required
            />

            <label>Size</label>
            <input type="text" name="size" onChange={handleChange} required />

            <label>Color</label>
            <input type="text" name="color" onChange={handleChange} required />

            <label>Price</label>
            <input
              type="number"
              name="price"
              onChange={handleChange}
              required
            />

            <label>Description</label>
            <textarea
              name="description"
              onChange={handleChange}
              required
            ></textarea>
          </>
        )}

        <label>Upload Photos (max 10)</label>
        <input
          type="file"
          name="photos"
          onChange={handleFileChange}
          multiple
          accept="image/*"
          required
        />

        <button type="submit">Add Service</button>
      </form>
    </>
  );
};

export default AddServices;
