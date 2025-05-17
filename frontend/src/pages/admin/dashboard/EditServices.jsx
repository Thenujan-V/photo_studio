import React, { useEffect, useState } from 'react';
import { Table, Form } from 'react-bootstrap';
import '../../../style/EditServices.scss';
import { fetchserviceCategory, fetchServicesByCategoryId, editServices } from '../../../Services/productsService';

const EditServices = () => {
  const [categories, setServiceCategory] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [services, setServices] = useState([]);
  const [serviceType, setServiceType] = useState('');
  const [editing, setEditing] = useState({});

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

  const handleCategoryClick = async (category) => {
    setSelectedCategoryId(category.id);
    setServiceType(category.category_name.toLowerCase());
    try {
      const response = await fetchServicesByCategoryId(category.id);
      const data = response.data?.servicesDetails?.services || [];
      setServices(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (id, field, value) => {
    setEditing((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleEdit = async (service) => {
    const updateData = editing[service.serviceId];
    if (updateData) {
        console.log("updated data:", updateData);
      await editServices(service.serviceCategoryId, service.serviceId, updateData);
      alert('Service updated!');
      const refreshed = await fetchServicesByCategoryId(service.serviceCategoryId);
      setServices(refreshed.data.servicesDetails.services || []);
      setEditing((prev) => ({ ...prev, [service.serviceId]: null }));
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 fw-bold">Edit Services</h2>
      <div className="category-buttons d-flex flex-wrap mb-4 justify-content-center">
        {categories.map((cat) => (
          <button
            key={cat.id}
            variant={selectedCategoryId === cat.id ? "#f90348" : "outline-primary"}
            className="m-2"
            onClick={() => handleCategoryClick(cat)}
          >
            {cat.category_name}
          </button>
        ))}
      </div>

      {selectedCategoryId ? (
  services.length > 0 ? (
    <Table striped bordered hover responsive className="services-table">
      <thead className="table-dark">
        <tr>
          <th>Service Name</th>
          {serviceType === 'frame making' && <th>Size</th>}
          {serviceType === 'frame making' && <th>Color</th>}
          {serviceType === 'photosoot' && <th>Duration</th>}
          <th>Description</th>
          <th>Price</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {services.map((service) => (
          <tr key={service.serviceId}>
            <td>
              <Form.Control
                defaultValue={service.serviceName}
                onChange={(e) =>
                  handleChange(
                    service.serviceId,
                    serviceType === 'photosoot'
                      ? 'photoshoot_name'
                      : serviceType === 'printings'
                      ? 'printing_name'
                      : 'material_name',
                    e.target.value
                  )
                }
              />
            </td>

            {serviceType === 'frame making' && (
              <>
                <td>
                  <Form.Control
                    defaultValue={service.size}
                    onChange={(e) => handleChange(service.serviceId, 'size', e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    defaultValue={service.color}
                    onChange={(e) => handleChange(service.serviceId, 'color', e.target.value)}
                  />
                </td>
              </>
            )}

            {serviceType === 'photosoot' && (
              <td>
                <Form.Control
                  defaultValue={service.duration}
                  onChange={(e) => handleChange(service.serviceId, 'duration', e.target.value)}
                />
              </td>
            )}

            <td>
              {serviceType !== 'frame making' ? (
                <Form.Control
                  as="textarea"
                  defaultValue={service.description}
                  onChange={(e) => handleChange(service.serviceId, 'description', e.target.value)}
                />
              ) : (
                '—'
              )}
            </td>

            <td>
              <Form.Control
                type="number"
                defaultValue={service.servicePrice}
                onChange={(e) => handleChange(service.serviceId, 'price', e.target.value)}
              />
            </td>

            <td>
              <button
                size="sm"
                onClick={() => handleEdit(service)}
              >
                Update
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  ) : (
    <p className="text-center">No data found for this category.</p>
  )
) : (
  <p className="text-center">Select a category to view services.</p>
)}

    </div>
  );
};

export default EditServices;
