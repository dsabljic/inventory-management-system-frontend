import axios from "axios";

class ItemService {
  static BASE_URL = "https://localhost:8443";

  static async createItem(itemData, token) {
    try {
        console.log('itemData from ItemService.createItem()');
        console.log(itemData);
      const response = await axios.post(
        `${ItemService.BASE_URL}/items`,
        itemData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async getAllItems(token) {
    try {
      const response = await axios.get(
        `${ItemService.BASE_URL}/items`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('response from ItemService.getAllItems()');
      console.log(response);
      console.log('response.data from ItemService.getAllItems()');
      console.log(response.data);
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async getItemById(itemId, token) {
    try {
      const response = await axios.get(
        `${ItemService.BASE_URL}/items/${itemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async deleteItem(itemId, token) {
    try {
      const response = await axios.delete(
        `${ItemService.BASE_URL}/items/${itemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async updateItem(itemId, itemData, token) {
    try {
      const response = await axios.put(
        `${ItemService.BASE_URL}/items/${itemId}`,
        itemData,
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

export default ItemService;