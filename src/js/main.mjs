import { loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

if (document.getElementsByClassName("product-list").length != 0) {
  const dataSource = new ProductData("tents");
  const element = document.querySelector(".product-list");
  const productList = new ProductList("Tents", dataSource, element);
  productList.init();
}