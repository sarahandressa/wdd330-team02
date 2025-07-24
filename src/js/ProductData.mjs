const baseURL = import.meta.env.VITE_SERVER_URL;

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async getData(category) {
    console.log("Fetching:", `${this.baseURL}/products/search/${category}`);
    const response = await fetch(`${this.baseURL}/products/search/${category}`);
    console.log("Status:", response.status);
    const data = await convertToJson(response);
    console.log("Data received:", data);
    return data.Result;
  }

  async findProductById(id) {
  const url = `${this.baseURL}/product/${id}`;
  console.log("Fetching product by ID:", url); 
  const response = await fetch(url);
  const data = await convertToJson(response);
  return data.Result;
}

  async submitOrder(cartItems) {
    const response = await fetch(`${this.baseURL}/orders`, {
      method: "POST",
      body: JSON.stringify(cartItems),
      headers: { "Content-Type": "application/json" }
    });
    return await response.json();
  }
}