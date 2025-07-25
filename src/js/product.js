import { getParam } from "./utils.mjs";
import ProductData from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";

document.addEventListener("DOMContentLoaded", () => {
  const dataSource = new ProductData("tents");
  const productId = getParam("product");

  const product = new ProductDetails(productId, dataSource);
  product.init();
});
