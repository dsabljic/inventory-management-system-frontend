import React, { useState, useEffect } from 'react';
import RequestService from '../../service/RequestService';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const AdminRequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const requestsResponse = await RequestService.getAllRequests(token);
      setRequests(requestsResponse);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleSortChange = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const updateRequestStatus = async (requestId, status) => {
    try {
      const token = localStorage.getItem('token');
      await RequestService.updateRequestStatus(requestId, status, token);
      fetchRequests();
    } catch (error) {
      console.error('Error updating request status:', error);
      alert('Unable to update request status');
    }
  };

  const filteredRequests = requests
    .filter(request => 
      (request.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       request.userName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter ? request.status === statusFilter : true)
    )
    .sort((a, b) => {
      const dateA = new Date(a.dateRequested);
      const dateB = new Date(b.dateRequested);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  return (
    <div className="admin-request-management">
      <h2>Requests</h2>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Search by item name or user name"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ marginRight: '10px', padding: '5px', width: '200px' }}
        />
        <select value={statusFilter} onChange={handleStatusChange} style={{ padding: '5px', marginRight: '10px' }}>
          <option value="">Filter by status</option>
          <option value="pending request">Pending Request</option>
          <option value="active">Active</option>
          <option value="pending cancel">Pending Cancel</option>
          <option value="declined">Declined</option>
          <option value="completed">Completed</option>
          <option value="pending return">Pending Return</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Item name</th>
            <th>User name</th>
            <th>Requested quantity</th>
            <th>Available quantity</th>
            <th>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                Date requested
                <i
                  className={`pi ${sortOrder === 'asc' ? 'pi-sort-amount-up-alt' : 'pi-sort-amount-down-alt'}`}
                  onClick={handleSortChange}
                  style={{ cursor: 'pointer', marginLeft: '5px' }}
                />
              </div>
            </th>
            <th>Date approved</th>
            <th>Start date</th>
            <th>Status</th>
            <th>Reason</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map(request => (
            <tr key={request.id}>
              <td>{request.itemName}</td>
              <td>{request.userName}</td>
              <td>{request.requestedQuantity}</td>
              <td>{request.availableQuantity}</td>
              <td>{request.dateRequested}</td>
              <td>{request.dateApproved || <span style={{ color: 'gray' }}>Not approved</span>}</td>
              <td>{request.startDate}</td>
              <td>{request.status}</td>
              <td>{request.reason}</td>
              <td>
                {request.status === 'pending request' && (
                  <>
                    <Button label="Approve" onClick={() => updateRequestStatus(request.id, 'accepted')} className="p-button-rounded p-button-success p-mr-2" />
                    <br />
                    <Button label="Decline" onClick={() => updateRequestStatus(request.id, 'declined')} className="p-button-rounded p-button-danger" />
                  </>
                )}
                {request.status === 'pending cancel' && (
                  <Button label="Approve Cancel" onClick={() => updateRequestStatus(request.id, 'canceled')} className="p-button-rounded p-button-success" />
                )}
                {request.status === 'pending return' && (
                  <Button label="Confirm Return" onClick={() => updateRequestStatus(request.id, 'completed')} className="p-button-rounded p-button-success" />
                )}
                {['active', 'declined', 'completed', 'canceled'].includes(request.status) && (
                  <span style={{ color: 'gray' }}>No action needed</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminRequestManagement;