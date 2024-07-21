import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RoomService from "../../service/RoomService";
import ReservationService from "../../service/ReservationService";
import UserService from "../../service/UserService";

const RoomInfo = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [availableDesks, setAvailableDesks] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRoom(roomId);
  }, [roomId]);

  useEffect(() => {
    if (room) {
      fetchAvailability(room.id, selectedDate);
    }
  }, [room, selectedDate]);

  const fetchRoom = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const roomResponse = await RoomService.getRoomById(id, token);
      setRoom(roomResponse);
    } catch (error) {
      console.error("Error fetching room:", error);
    }
  };

  const fetchAvailability = async (roomId, date) => {
    try {
      const token = localStorage.getItem("token");
      const availabilityResponse = await ReservationService.getRoomAvailability(
        roomId,
        date,
        date,
        token
      );
      setAvailableDesks(availabilityResponse);
    } catch (error) {
      console.error("Error fetching availability:", error);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this room (id: ${room.id})?`
    );
    if (confirmDelete) {
      try {
        const token = localStorage.getItem("token");
        await RoomService.deleteRoom(room.id, token);
        navigate("/rooms");
      } catch (error) {
        console.error("Error deleting room:", error);
      }
    }
  };

  const handleUpdate = () => {
    navigate(`/rooms/update/${room.id}`);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setMessage('');
  };

  const handleViewHistory = () => {
    navigate(`/rooms/history/${room.id}`);
  };

  const handleReservation = async () => {
    const today = new Date().toISOString().split("T")[0];
    if (selectedDate <= today) {
      setMessage('Cannot create a reservation for today or past dates.');
      return;
    }

    if (availableDesks > 0) {
      try {
        const token = localStorage.getItem("token");
        const reservationData = {
          requestedDesks: 1,
          startDate: selectedDate,
          roomId: room.id
        };
        await ReservationService.createReservation(reservationData, token);
        alert('Reservation request created successfully.');
        navigate("/user/reservations");
      } catch (error) {
        setMessage('Failed to create reservation request.');
        console.error("Error creating reservation:", error);
      }
    } else {
      setMessage('No available desks for the selected date.');
    }
  };

  if (!room) return <div>Loading...</div>;

  return (
    <div className="auth-container">
      <div className="room-details">
        <h2>{room.name}</h2>
        <p>
          <strong>Building: </strong>
          {room.building}, <strong>Floor: </strong>
          {room.floor}
        </p>
        <p>
          <strong>Desks: </strong>
          {room.totalDesks}
        </p>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={selectedDate}
            onChange={handleDateChange}
            required
          />
        </div>
        <p>
          <strong>Available desks: </strong>
          {availableDesks}
        </p>
        <br />
        <div className="center-div">
          <div className="room-card-single">
            <div className="desks-container">
              {Array.from({ length: room.totalDesks }, (_, index) => (
                <div
                  key={index}
                  className={`desk ${index < (room.totalDesks - availableDesks) ? "occupied" : ""}`}
                />
              ))}
            </div>
          </div>
        </div>
        {UserService.isAdmin() && (
          <div>
            <br />
            <button onClick={handleUpdate} className="action-button">
              Update
            </button>
            <br />
            <button onClick={handleDelete} className="delete-button">
              Delete
            </button>
            <br />
            <button onClick={handleViewHistory} className="history-button">
              View History
            </button>
          </div>
        )}

        {UserService.isUser() && (
          <div>
            <br />
            <button onClick={handleReservation} className="action-button">
              Request a reservation
            </button>
            {message && <p>{message}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomInfo;