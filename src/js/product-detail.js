// src/js/product-detail.js

import cartIcon, { loadHeaderFooter, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

loadHeaderFooter();
cartIcon();

const productId = getParam("product");
if (!productId) {
  document.querySelector("main").innerHTML =
    "<p class='error'>No product specified.</p>";
} else {
  const details = new ProductDetails(productId, new ProductData());
  details.init();
}
