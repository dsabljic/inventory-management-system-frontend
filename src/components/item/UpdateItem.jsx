import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ItemService from "../../service/ItemService";
import ItemTypeService from "../../service/ItemTypeService";

const UpdateItem = () => {
  const { itemId } = useParams();
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
    fetchItemData();
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

  const fetchItemData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await ItemService.getItemById(itemId, token);
      setFormData(response);
    } catch (error) {
      console.error("Error fetching item data:", error);
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

      await ItemService.updateItem(itemId, dataToSend, token);

      alert("Item updated successfully");
      navigate("/items");
    } catch (error) {
      console.error("Error updating item:", error);
      if (error.response && error.response.status === 403) {
        alert("Access forbidden: You do not have permission to perform this action.");
      } else {
        alert("An error occurred while updating the item");
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>Update item</h2>
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
          <label>Available quantity:</label>
          <input
            type="number"
            name="availableQuantity"
            value={formData.availableQuantity}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Item type:</label>
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
        <button type="submit">Update item</button>
      </form>
    </div>
  );
};

export default UpdateItem;