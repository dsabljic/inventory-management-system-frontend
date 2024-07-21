import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ItemService from '../../service/ItemService';
import ItemTypeService from '../../service/ItemTypeService';

const ItemManagement = () => {
  const [items, setItems] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);

  useEffect(() => {
    fetchItemsAndTypes();
  }, []);

  const fetchItemsAndTypes = async () => {
    try {
      const token = localStorage.getItem('token');
      const [itemsResponse, itemTypesResponse] = await Promise.all([
        ItemService.getAllItems(token),
        ItemTypeService.getAllItemTypes(token)
      ]);
      setItems(itemsResponse);
      setItemTypes(itemTypesResponse);
    } catch (error) {
      console.error('Error fetching items and item types:', error);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      const confirmDelete = window.confirm(`Are you sure you want to delete this item (id: ${itemId})?`);

      const token = localStorage.getItem('token');
      if (confirmDelete) {
        await ItemService.deleteItem(itemId, token);
        fetchItemsAndTypes();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Unable to delete item');
    }
  };

  const getItemTypeName = (typeId) => {
    const itemType = itemTypes.find(type => type.id === typeId);
    return itemType ? itemType.name : 'Unknown';
  };

  return (
    <div className="user-management-container">
      <h2>Items</h2>
      <button className='reg-button'> <Link to="/items/create">Add item</Link></button>
      <table>
        <thead>
          <tr>
            {/* <th>ID</th> */}
            <th>Name</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Available quantity</th>
            <th>Item type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              {/* <td>{item.id}</td> */}
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.quantity}</td>
              <td>{item.availableQuantity}</td>
              <td>{getItemTypeName(item.typeId)}</td>
              <td>
                <button className='delete-button' onClick={() => deleteItem(item.id)}>Delete</button>
                <button><Link to={`/items/update/${item.id}`}>
                  Update
                </Link>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemManagement;