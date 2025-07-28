import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

const category = getParam("category") || "tents";
const baseUrl = import.meta.env.VITE_SERVER_URL;
const dataSource = new ExternalServices(baseUrl);
const listElement = document.querySelector(".product-list");
const productList = new ProductList(category, dataSource, listElement);

productList.init();
// Initialize product list and then set up sorting
productList.init().then(() => {
  // Add event listener for sort dropdown
  const sortSelect = document.querySelector("#sort");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      productList.sortProducts(e.target.value);
    });
  }

  // Optional: update title on page
  const title = document.querySelector("#category-title");
  if (title) {
    title.textContent = `Top Products: ${category.replace("-", " ")}`;
  }

  console.log("Category:", category);
});