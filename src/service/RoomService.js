import axios from 'axios';

class RoomService {
  static BASE_URL = 'https://localhost:8443';

  static async getAllRooms(token) {
    try {
      const response = await axios.get(`${RoomService.BASE_URL}/rooms`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async getRoomById(roomId, token) {
    try {
      const response = await axios.get(`${RoomService.BASE_URL}/rooms/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async createRoom(roomData, token) {
    try {
      const response = await axios.post(
        `${RoomService.BASE_URL}/rooms`,
        roomData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async updateRoom(roomId, roomData, token) {
    try {
      const response = await axios.put(
        `${RoomService.BASE_URL}/rooms/${roomId}`,
        roomData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async deleteRoom(roomId, token) {
    try {
      const response = await axios.delete(
        `${RoomService.BASE_URL}/rooms/${roomId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }
}

export default RoomService;