import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ItemTypeService from "../../service/ItemTypeService";

const CreateItemType = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await ItemTypeService.createItemType(formData, token);

      setFormData({
        name: "",
      });
      alert("Item type created successfully");
      navigate("/item-types");
    } catch (error) {
      console.error("Error creating an item type:", error);
      alert("An error occurred while creating an item type");
    }
  };

  return (
    <div className="auth-container">
      <h2>Add new item type</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Item type:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Add item type</button>
      </form>
    </div>
  );
};

export default CreateItemType;