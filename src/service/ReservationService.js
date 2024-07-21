import axios from 'axios';

class ReservationService {
  static BASE_URL = 'https://localhost:8443/reservations';

  static async getAvailabilityForAllRooms(startDate, endDate, token) {
    try {
      const response = await axios.get(`${this.BASE_URL}/rooms/availability`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getRoomAvailability(roomId, startDate, endDate, token) {
    try {
      const response = await axios.get(`${this.BASE_URL}/availability`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { roomId, startDate, endDate },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getReservationHistory(roomId, token) {
    try {
      const response = await axios.get(`${this.BASE_URL}/history/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async createReservation(reservationData, token) {
    try {
      const response = await axios.post(this.BASE_URL, reservationData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getAllReservations(token) {
    try {
      const response = await axios.get(`${this.BASE_URL}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const reservations = response.data;

      const reservationsWithDetails = await Promise.all(
        reservations.map(async (reservation) => {
          const roomResponse = await axios.get(`https://localhost:8443/rooms/${reservation.roomId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const userResponse = await axios.get(`https://localhost:8443/admin/users/${reservation.userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          return {
            ...reservation,
            roomName: roomResponse.data.name,
            userName: userResponse.data.user.name,
            availableDesks: roomResponse.data.totalDesks,
          };
        })
      );

      return reservationsWithDetails;
    } catch (error) {
      throw error;
    }
  }

  static async updateReservationStatus(id, status, token) {
    try {
      const response = await axios.put(`${this.BASE_URL}/${id}/status`, null, {
        headers: { Authorization: `Bearer ${token}` },
        params: { status },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getUserReservations(token) {
    try {
      const response = await axios.get(`${this.BASE_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const reservations = response.data;

      const reservationsWithDetails = await Promise.all(
        reservations.map(async (reservation) => {
          const roomResponse = await axios.get(`https://localhost:8443/rooms/${reservation.roomId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          return {
            ...reservation,
            roomName: roomResponse.data.name,
          };
        })
      );

      return reservationsWithDetails;
    } catch (error) {
      throw error;
    }
  }

  static async requestCancellation(reservationId, token) {
    try {
      const response = await axios.put(`${this.BASE_URL}/${reservationId}/requestCancel`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async requestClearance(reservationId, token) {
    try {
      const response = await axios.put(`${this.BASE_URL}/${reservationId}/requestClearance`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default ReservationService;