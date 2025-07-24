import "./cart.js";
import { getLocalStorage, setLocalStorage } from "./utils.mjs";

import CheckoutProcess from "./CheckoutProcess.mjs";

import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const checkout = new CheckoutProcess("sleepoutside-cart", ".order-summary");

checkout.init();

document.querySelector("#zip").addEventListener("blur", () => {
  checkout.calculateOrderTotal();
});
