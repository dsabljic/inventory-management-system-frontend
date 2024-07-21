import axios from "axios";

class RequestService {
  static BASE_URL = "https://localhost:8443";

  static async createRequest(requestData, token) {
    try {
      const response = await axios.post(`${RequestService.BASE_URL}/requests`, requestData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async getAllRequests(token) {
    try {
      const response = await axios.get(`${RequestService.BASE_URL}/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const requests = response.data;

      const requestsWithDetails = await Promise.all(
        requests.map(async (request) => {
          const itemResponse = await axios.get(`${RequestService.BASE_URL}/items/${request.itemId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const userResponse = await axios.get(`${RequestService.BASE_URL}/admin/users/${request.userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          return {
            ...request,
            itemName: itemResponse.data.name,
            userName: userResponse.data.user.name,
            availableQuantity: itemResponse.data.availableQuantity,
          };
        })
      );

      return requestsWithDetails;
    } catch (err) {
      throw err;
    }
  }

  static async updateRequestStatus(requestId, status, token) {
    try {
      const response = await axios.put(
        `${RequestService.BASE_URL}/requests/${requestId}/status`,
        {},
        {
          params: { status },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async getUserRequests(token) {
    const response = await axios.get(`${RequestService.BASE_URL}/requests/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  static async cancelRequest(requestId, token) {
    const response = await axios.put(
      `${RequestService.BASE_URL}/requests/${requestId}/cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  static async returnRequest(requestId, token) {
    const response = await axios.put(
      `${RequestService.BASE_URL}/requests/${requestId}/return`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
}

export default RequestService;