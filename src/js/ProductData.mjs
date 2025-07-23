const baseURL = import.meta.env.VITE_SERVER_URL;

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}




export default class ProductData {
  // Fetch products by category
  async getData(category) {
    console.log("Fetching:", `${baseURL}/products/search/${category}`);
    const response = await fetch(`${baseURL}/products/search/${category}`);
    console.log("Status:", response.status);
    const data = await convertToJson(response);
    console.log("Data received:", data);
    return data.Result;
  }

  // Fetch single product by ID
  async findProductById(id) {
    const response = await fetch(`${baseURL}/product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }
async submitOrder(cartItems) {
  const response = await fetch(`${serverURL}/orders`, {
    method: "POST",
    body: JSON.stringify(cartItems),
    headers: { "Content-Type": "application/json" }
  });
  return await response.json();
}

}

