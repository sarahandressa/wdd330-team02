const baseURL = import.meta.env.VITE_SERVER_URL;

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ExternalServices {
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

  async checkout(orderData) {
    const url = `${this.baseURL}/checkout`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    };

    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text(); // Capture any body error
      console.error("❌ Server response:", response.status, response.statusText, errorText);
      throw new Error(`Checkout failed: ${response.status} - ${errorText}`);
    }


    return await response.json();
  }
}