import React, { useState, useEffect } from "react";
import ReservationService from "../../service/ReservationService";
import UserService from "../../service/UserService";

const ReservationManagement = () => {
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
      const reservationResponse = await ReservationService.getAllReservations(token);
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

  const handleUpdateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await ReservationService.updateReservationStatus(id, status, token);
      fetchReservations();
    } catch (error) {
      alert("Unable to update reservation status");
      console.error("Error updating reservation status:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch = reservation.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          reservation.roomName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || reservation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="reservation-management-container">
      <h2>Reservation management</h2>
      <div>
        <input
          type="text"
          placeholder="Search by user or room name"
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
            <th>User</th>
            <th>Room</th>
            <th>Available desks</th>
            <th>Reservation date</th>
            <th>Date requested</th>
            <th>Date approved</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredReservations.map((reservation) => (
            <tr key={reservation.id}>
              <td>{reservation.userName}</td>
              <td>{reservation.roomName}</td>
              <td>{availability[reservation.id]}</td>
              <td>{reservation.startDate}</td>
              <td>{reservation.dateRequested}</td>
              <td>
                {reservation.dateApproved ? reservation.dateApproved : "Not approved"}
              </td>
              <td>{reservation.status}</td>
              <td>
                {reservation.status === "pending request" && (
                  <>
                    <button onClick={() => handleUpdateStatus(reservation.id, "reserved")}>
                      Approve
                    </button>
                    <br />
                    <button onClick={() => handleUpdateStatus(reservation.id, "declined")}>
                      Decline
                    </button>
                  </>
                )}
                {reservation.status === "pending cancel" && (
                  <button onClick={() => handleUpdateStatus(reservation.id, "canceled")}>
                    Approve Cancel
                  </button>
                )}
                {reservation.status === "pending clearance" && (
                  <button onClick={() => handleUpdateStatus(reservation.id, "completed")}>
                    Mark as Completed
                  </button>
                )}
                {["reserved", "declined", "canceled", "completed"].includes(reservation.status) && (
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

export default ReservationManagement;