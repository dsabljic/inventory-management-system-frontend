import axios from "axios";

class UserService {
  static BASE_URL = "https://localhost:8443";

  static async login(email, password) {
    try {
      const response = await axios.post(`${UserService.BASE_URL}/auth/login`, {
        email,
        password,
      });
      console.log(response.data);
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async register(userData) {
    try {
      const response = await axios.post(
        `${UserService.BASE_URL}/auth/register`,
        userData
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async createUser(userData, token) {
    try {
      const response = await axios.post(
        `${UserService.BASE_URL}/admin/users`,
        userData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async getAllUsers(token) {
    try {
      const response = await axios.get(`${UserService.BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async getProfile(token) {
    try {
      const response = await axios.get(
        `${UserService.BASE_URL}/adminUser/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async getUserById(userId, token) {
    try {
      const response = await axios.get(
        `${UserService.BASE_URL}/admin/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async deleteUser(userId, token) {
    try {
      const response = await axios.delete(
        `${UserService.BASE_URL}/admin/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async updateUser(userId, userData, token) {
    try {
      const response = await axios.put(
        `${UserService.BASE_URL}/admin/users/${userId}`,
        userData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async resendVerificationEmail(token) {
    try {
      const response = await axios.post(
        `${UserService.BASE_URL}/auth/resendVerification`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async approveVerification(userId, token) {
    try {
      const response = await axios.put(
        `${UserService.BASE_URL}/admin/approveVerification/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async forgotPassword(email) {
    try {
      const response = await axios.post(
        `${UserService.BASE_URL}/auth/forgotPassword`,
        { email }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }
  
  static async resetPassword(token, newPassword) {
    try {
      const response = await axios.post(
        `${UserService.BASE_URL}/auth/resetPassword?token=${token}`,
        { newPassword }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  /**AUTHENTICATION CHECKER */
  static logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }

  static isAuthenticated() {
    const token = localStorage.getItem("token");
    return !!token;
  }

  static isAdmin() {
    const role = localStorage.getItem("role");
    return role === "ADMIN";
  }

  static isUser() {
    const role = localStorage.getItem("role");
    return role === "USER";
  }

  static isPendingUser() {
    const role = localStorage.getItem("role");
    return role === "PENDING_USER";
  }

  static adminOnly() {
    return this.isAuthenticated() && this.isAdmin();
  }
}

export default UserService;