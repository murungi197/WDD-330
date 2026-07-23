const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(res) {
  const jsonResponse = await res.json();
  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: 'servicesError', message: jsonResponse };
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

export default class ExternalServices {
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

  async checkout(orderData) {
    const url = `${baseURL}checkout`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    };

    const response = await fetch(url, options);
    const data = await convertToJson(response);
    return data;
  }
}
