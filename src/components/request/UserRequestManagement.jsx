import React, { useState, useEffect } from 'react';
import RequestService from '../../service/RequestService';
import ItemService from '../../service/ItemService';

const UserRequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchUserRequests();
  }, []);

  const fetchUserRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const requestsResponse = await RequestService.getUserRequests(token);
      const itemsResponse = await ItemService.getAllItems(token);
      setRequests(requestsResponse);
      setItems(itemsResponse);
    } catch (error) {
      console.error('Error fetching user requests:', error);
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await RequestService.cancelRequest(requestId, token);
      fetchUserRequests();
    } catch (error) {
      console.error('Error canceling request:', error);
    }
  };

  const handleReturnRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await RequestService.returnRequest(requestId, token);
      fetchUserRequests();
    } catch (error) {
      console.error('Error returning request:', error);
    }
  };

  const getItemName = (itemId) => {
    const item = items.find((item) => item.id === itemId);
    return item ? item.name : 'Unknown';
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const filteredRequests = requests.filter((request) => {
    const itemName = getItemName(request.itemId).toLowerCase();
    const matchesSearchTerm = itemName.includes(searchTerm.toLowerCase());
    const matchesStatusFilter = statusFilter ? request.status === statusFilter : true;
    return matchesSearchTerm && matchesStatusFilter;
  });

  return (
    <div className="user-request-management">
      <h2>My requests</h2>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Search by item name"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ marginRight: '10px', padding: '5px', width: '200px' }}
        />
        <select value={statusFilter} onChange={handleStatusFilterChange} style={{ padding: '5px', marginRight: '10px' }}>
          <option value="">Filter by status</option>
          <option value="pending request">Pending Request</option>
          <option value="active">Active</option>
          <option value="pending return">Pending Return</option>
          <option value="pending cancel">Pending Cancel</option>
          <option value="declined">Declined</option>
          <option value="completed">Completed</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Item name</th>
            <th>Requested quantity</th>
            <th>Available quantity</th>
            <th>Date requested</th>
            <th>Start date</th>
            <th>Date approved</th>
            <th>Status</th>
            <th>Reason</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map((request) => (
            <tr key={request.id}>
              <td>{getItemName(request.itemId)}</td>
              <td>{request.requestedQuantity}</td>
              <td>{items.find((item) => item.id === request.itemId)?.availableQuantity || 'Unknown'}</td>
              <td>{request.dateRequested}</td>
              <td>{request.startDate}</td>
              <td>{request.dateApproved ? request.dateApproved : <span style={{ color: 'gray' }}>Not approved</span>}</td>
              <td>{request.status}</td>
              <td>{request.reason}</td>
              <td>
                {request.status === 'active' && (
                  <button onClick={() => handleReturnRequest(request.id)}>Request Return</button>
                )}
                {request.status === 'pending request' && (
                  <button onClick={() => handleCancelRequest(request.id)}>Cancel Request</button>
                )}
                {['declined', 'pending return', 'pending cancel', 'canceled', 'completed'].includes(request.status) && (
                  <span style={{ color: 'gray' }}>No actions needed</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserRequestManagement;