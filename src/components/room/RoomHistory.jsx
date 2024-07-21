import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReservationService from '../../service/ReservationService';

const RoomHistory = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory(roomId);
  }, [roomId]);

  const fetchHistory = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const historyResponse = await ReservationService.getReservationHistory(id, token);
      setHistory(historyResponse);
    } catch (error) {
      console.error('Error fetching reservation history:', error);
      setError('Error fetching reservation history');
    }
  };

  const handleBack = () => {
    navigate(`/rooms/${roomId}`);
  };

  const generateCompleteHistory = () => {
    if (history.length === 0) return [];

    const completeHistory = [];
    const firstDate = new Date(history[0].date);
    const lastDate = new Date(history[history.length - 1].date);

    for (let d = firstDate; d <= lastDate; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().split('T')[0];
      const record = history.find(record => record.date === dateString);
      if (record) {
        completeHistory.push(record);
      } else {
        completeHistory.push({ date: dateString, userNames: ['No reservations'] });
      }
    }

    return completeHistory;
  };

  const completeHistory = generateCompleteHistory();

  return (
    <div className="history-container">
      <h2>Reservation History for Room {roomId}</h2>
      {error && <p className="error">{error}</p>}
      <button onClick={handleBack} className="back-button">Back to Room</button>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Users</th>
          </tr>
        </thead>
        <tbody>
          {completeHistory.map((record, index) => (
            <tr key={index}>
              <td>{record.date}</td>
              <td>{record.userNames.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomHistory;