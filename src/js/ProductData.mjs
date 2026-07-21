const baseURL = import.meta.env.VITE_SERVER_URL;

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Bad Response');
  }
}

function normalizeLocalData(data) {
  if (Array.isArray(data)) {
    return data;
  }
  if (data && Array.isArray(data.Result)) {
    return data.Result;
  }
  return [];
}

async function loadFromLocal(category) {
  const response = await fetch(`/json/${category}.json`);
  if (!response.ok) {
    throw new Error('Local file not found');
  }
  const data = await response.json();
  return normalizeLocalData(data);
}

export default class ProductData {
  constructor() {}

  async getData(category) {
    try {
      const response = await fetch(`${baseURL}products/search/${category}`);
      const data = await convertToJson(response);
      return data.Result || [];
    } catch (error) {
      console.warn(`API fetch failed for ${category}, falling back to local data`, error);
      return loadFromLocal(category);
    }
  }

  async findProductById(id) {
    try {
      const response = await fetch(`${baseURL}product/${id}`);
      const data = await convertToJson(response);
      return data.Result;
    } catch (error) {
      console.warn(`API fetch failed for product ${id}, falling back to local data`, error);
      const localCategories = ['tents', 'backpacks', 'sleeping-bags'];
      for (const category of localCategories) {
        try {
          const products = await loadFromLocal(category);
          const found = products.find((product) => product.Id === id);
          if (found) {
            return found;
          }
        } catch (e) {
          // continue to next category
        }
      }
      return null;
    }
  }
}
