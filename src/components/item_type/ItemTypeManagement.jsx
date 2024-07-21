import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ItemTypeService from '../../service/ItemTypeService';

const ItemTypeManagement = () => {
    const [itemTypes, setitemTypes] = useState([]);

    useEffect(() => {
      fetchItemTypes();
    }, []);
  
    const fetchItemTypes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await ItemTypeService.getAllItemTypes(token);
        // console.log('response');
        // console.log(response);
        setitemTypes(response);
      } catch (error) {
        console.error('Error fetching item types:', error);
      }
    };
  
    const deleteItemType = async (itemTypeId) => {
      try {
        const confirmDelete = window.confirm(`Are you sure you want to delete this item type (id: ${itemTypeId})?`);
  
        const token = localStorage.getItem('token');
        if (confirmDelete) {
          await ItemTypeService.deleteItemType(itemTypeId, token);
          fetchItemTypes();
        }
      } catch (error) {
        console.error('Error deleting item type:', error);
        alert('Unable to delete item type');
      }
    };
  
    return (
      <div className="user-management-container">
        <h2>Item types</h2>
        <button className='reg-button'> <Link to="/item-types/create">Add item type</Link></button>
        <table>
          <thead>
            <tr>
              {/* <th>ID</th> */}
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {itemTypes.map(itemType => (
              <tr key={itemType.id}>
                {/* <td>{itemType.id}</td> */}
                <td>{itemType.name}</td>
                <td>
                  <button className='delete-button' onClick={() => deleteItemType(itemType.id)}>Delete</button>
                  <button><Link to={`/item-types/update/${itemType.id}`}>
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

export default ItemTypeManagement;