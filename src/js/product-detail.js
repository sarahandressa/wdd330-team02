// src/js/product-detail.js

import cartIcon, { loadHeaderFooter, getParam } from "./utils.mjs";
import ExternalServices from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

loadHeaderFooter();
cartIcon();

const productId = getParam("product");
const baseURL = import.meta.env.VITE_SERVER_URL;

if (!productId) {
  document.querySelector("main").innerHTML =
    "<p class='error'>No product specified.</p>";
} else {
  const dataSource = new ExternalServices(baseURL);
  const details = new ProductDetails(productId, dataSource);
  details.init();
}
