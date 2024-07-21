import axios from "axios";

class ItemTypeService {
  static BASE_URL = "https://localhost:8443";

  static async createItemType(itemTypeData, token) {
    try {
      const response = await axios.post(
        `${ItemTypeService.BASE_URL}/admin/itemTypes`,
        itemTypeData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async getAllItemTypes(token) {
    try {
      const response = await axios.get(
        `${ItemTypeService.BASE_URL}/admin/itemTypes`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log('response from ItemTypeService.getAllItemTypes()');
      // console.log(response);
      // console.log('response.data from ItemTypeService.getAllItemTypes()');
      // console.log(response.data);
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async getItemTypeById(itemTypeId, token) {
    try {
      const response = await axios.get(
        `${ItemTypeService.BASE_URL}/admin/itemTypes/${itemTypeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async deleteItemType(itemTypeId, token) {
    try {
      const response = await axios.delete(
        `${ItemTypeService.BASE_URL}/admin/itemTypes/${itemTypeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async updateItemType(itemTypeId, itemTypeData, token) {
    try {
      const response = await axios.put(
        `${ItemTypeService.BASE_URL}/admin/itemTypes/${itemTypeId}`,
        itemTypeData,
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

export default ItemTypeService;
