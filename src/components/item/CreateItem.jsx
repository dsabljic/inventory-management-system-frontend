import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ItemService from "../../service/ItemService";
import ItemTypeService from "../../service/ItemTypeService";

const CreateItem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: 0,
    availableQuantity: 0,
    typeId: "",
  });

  const [itemTypes, setItemTypes] = useState([]);

  useEffect(() => {
    fetchItemTypes();
  }, []);

  const fetchItemTypes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await ItemTypeService.getAllItemTypes(token);
      setItemTypes(response);
    } catch (error) {
      console.error("Error fetching item types:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "quantity" || name === "availableQuantity" ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const dataToSend = {
        ...formData,
        typeId: parseInt(formData.typeId),
      };

      console.log("Submitting form with data:", dataToSend);
      console.log("Using token:", token);

      await ItemService.createItem(dataToSend, token);

      setFormData({
        name: "",
        description: "",
        quantity: 0,
        availableQuantity: 0,
        typeId: "",
      });
      alert("Item created successfully");
      navigate("/items");
    } catch (error) {
      console.error("Error creating item:", error);
      if (error.response && error.response.status === 403) {
        alert("Access forbidden: You do not have permission to perform this action.");
      } else {
        alert("An error occurred while creating the item");
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>Add new item</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Available Quantity:</label>
          <input
            type="number"
            name="availableQuantity"
            value={formData.availableQuantity}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Item Type:</label>
          <select
            name="typeId"
            value={formData.typeId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select item type</option>
            {itemTypes.map((itemType) => (
              <option key={itemType.id} value={itemType.id}>
                {itemType.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Add item</button>
      </form>
    </div>
  );
};

export default CreateItem;