import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ItemTypeService from '../../service/ItemTypeService';

function UpdateItemType() {
  const navigate = useNavigate();
  const { itemTypeId } = useParams();

  const [itemTypeData, setItemTypeData] = useState({
    name: ''
  });

  useEffect(() => {
    fetchItemTypeDataById(itemTypeId);
  }, [itemTypeId]);

  const fetchItemTypeDataById = async (itemTypeId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await ItemTypeService.getItemTypeById(itemTypeId, token);
      const { name } = response;
      setItemTypeData({ name });
    } catch (error) {
      console.error('Error fetching item type:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItemTypeData(() => ({
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const confirmUpdate = window.confirm('Are you sure you want to update this item type?');
      if (confirmUpdate) {
        const token = localStorage.getItem('token');
        const res = await ItemTypeService.updateItemType(itemTypeId, itemTypeData, token);
        console.log(res)
        navigate("/item-types")
      }

    } catch (error) {
      console.error('Error updating item types:', error);
      alert(error)
    }
  };

  return (
    <div className="auth-container">
      <h2>Update item type</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" value={itemTypeData.name} onChange={handleInputChange} />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default UpdateItemType;