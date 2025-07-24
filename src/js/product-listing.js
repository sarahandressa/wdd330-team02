import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

const category = getParam("category") || "tents";
const baseUrl = import.meta.env.VITE_SERVER_URL;
const dataSource = new ProductData(baseUrl);
const listElement = document.querySelector(".product-list");
const productList = new ProductList(category, dataSource, listElement);
productList.init();

// Optional: update title on page
const title = document.querySelector("#category-title");
if (title) {
  title.textContent = `Top Products: ${category.replace("-", " ")}`;
}

console.log("Category:", category);
