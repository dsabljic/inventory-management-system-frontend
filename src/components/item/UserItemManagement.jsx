import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ItemService from '../../service/ItemService';

const UserItemManagement = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const itemsResponse = await ItemService.getAllItems(token);
      setItems(itemsResponse);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRequestClick = (item) => {
    navigate('/request', { state: { item } });
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user-management-container">
      <h2>Items</h2>
      <input
        type="text"
        placeholder="Search items"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
      />
      <table>
        <thead>
          <tr>
            {/* <th>ID</th> */}
            <th>Name</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Available quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map(item => item.quantity > 0 ? (
            <tr key={item.id}>
              {/* <td>{item.id}</td> */}
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.quantity}</td>
              <td>{item.availableQuantity}</td>
              <td>
                <button onClick={() => handleRequestClick(item)}>Make a request</button>
              </td>
            </tr>
          ) : null)}
        </tbody>
      </table>
    </div>
  );
};

export default UserItemManagement;