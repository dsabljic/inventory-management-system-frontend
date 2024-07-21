import React, { useState, useEffect } from "react";
import ReservationService from "../../service/ReservationService";
import UserService from "../../service/UserService";

const UserReservationManagement = () => {
  const [reservations, setReservations] = useState([]);
  const [availability, setAvailability] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("token");
      const reservationResponse = await ReservationService.getUserReservations(token);
      setReservations(reservationResponse);
      await fetchAvailabilityForReservations(reservationResponse);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const fetchAvailabilityForReservations = async (reservations) => {
    try {
      const token = localStorage.getItem("token");
      const availability = {};
      for (const reservation of reservations) {
        const availabilityResponse = await ReservationService.getRoomAvailability(
          reservation.roomId,
          reservation.startDate,
          reservation.endDate,
          token
        );
        availability[reservation.id] = availabilityResponse;
      }
      setAvailability(availability);
    } catch (error) {
      console.error("Error fetching availability:", error);
    }
  };

  const handleRequestCancel = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await ReservationService.requestCancellation(id, token);
      fetchReservations();
    } catch (error) {
      alert("Unable to request cancellation");
      console.error("Error requesting cancellation:", error);
    }
  };

  const handleRequestClearance = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await ReservationService.requestClearance(id, token);
      fetchReservations();
    } catch (error) {
      alert("Unable to request clearance");
      console.error("Error requesting clearance:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch = reservation.roomName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || reservation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="reservation-management-container">
      <h2>My Reservations</h2>
      <div>
        <input
          type="text"
          placeholder="Search by room name"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ marginRight: '10px', padding: '5px', width: '200px' }}
        />
        <select value={statusFilter} onChange={handleStatusChange} style={{ padding: '5px', marginRight: '10px' }}>
          <option value="">All statuses</option>
          <option value="pending reservation">Pending Reservation</option>
          <option value="reserved">Reserved</option>
          <option value="declined">Declined</option>
          <option value="pending cancel">Pending Cancel</option>
          <option value="canceled">Canceled</option>
          <option value="pending clearance">Pending Clearance</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Room</th>
            <th>Available Desks</th>
            <th>Reservation Date</th>
            <th>Date Requested</th>
            <th>Date Approved</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredReservations.map((reservation) => (
            <tr key={reservation.id}>
              <td>{reservation.roomName}</td>
              <td>{availability[reservation.id]}</td>
              <td>{reservation.startDate}</td>
              <td>{reservation.dateRequested}</td>
              <td>{reservation.dateApproved ? reservation.dateApproved : "Not approved"}</td>
              <td>{reservation.status}</td>
              <td>
                {reservation.status === "pending request" && (
                  <button onClick={() => handleRequestCancel(reservation.id)}>Request Cancel</button>
                )}
                {reservation.status === "reserved" && (
                  <button onClick={() => handleRequestClearance(reservation.id)}>Request Clearance</button>
                )}
                {["declined", "canceled", "pending cancel", "pending clearance", "completed"].includes(reservation.status) && (
                  <span>No action needed</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserReservationManagement;