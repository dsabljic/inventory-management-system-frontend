import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import RoomService from "../../service/RoomService";
import ReservationService from "../../service/ReservationService";
import UserService from "../../service/UserService";

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    fetchRooms();
    fetchAvailability(selectedDate);
  }, [selectedDate]);

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await RoomService.getAllRooms(token);
      setRooms(response);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const fetchAvailability = async (date) => {
    try {
      const token = localStorage.getItem('token');
      const response = await ReservationService.getAvailabilityForAllRooms(date, date, token);
      setAvailability(response);
    } catch (error) {
      console.error("Error fetching availability:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoomAvailability = (roomId) => {
    const roomAvailability = availability.find(a => a.roomId === roomId);
    return roomAvailability ? roomAvailability.availableDesks : 0;
  };

  return (
    <div className="room-management-container">
      <h2>Rooms</h2>
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>
      <div className="room-grid">
        {filteredRooms.map((room) => (
          <div key={room.id} className="room-wrapper">
            <Link to={`/rooms/${room.id}`} className="room-link">
              <div className="room-info">
                <h3 className="room-name">{room.name}</h3>
              </div>
            </Link>
            <div className="availability">Available: {getRoomAvailability(room.id)}</div>
            <Link to={`/rooms/${room.id}`} className="room-link">
              <div className="room-card">
                <div className="desks-container">
                  {Array.from({ length: room.totalDesks }, (_, index) => (
                    <div
                      key={index}
                      className={`desk ${index < (room.totalDesks - getRoomAvailability(room.id)) ? "occupied" : ""}`}
                    />
                  ))}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      {UserService.isAdmin() &&
      <Link to="/rooms/create" className="add-room-button">Add new</Link>}
    </div>
  );
};

export default RoomManagement;