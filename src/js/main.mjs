import cartIcon, { loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import Alert from "./Alert.js";

loadHeaderFooter();
cartIcon();

const alerts = new Alert("/json/alerts.json");
alerts.init();

if (document.getElementsByClassName("product-list").length != 0) {
  const dataSource = new ProductData("tents");
  const element = document.querySelector(".product-list");
  const productList = new ProductList("Tents", dataSource, element);
  productList.init();
}