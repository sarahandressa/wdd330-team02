import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];

  // Message for empty cart
  if (cartItems.length === 0) {
    document.querySelector(".product-list-cart").innerHTML =
      "<p>Your cart is empty.</p>";
    return;
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list-cart").innerHTML = htmlItems.join("");

  attachRemoveListeners();
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="../../product_pages/?product=${item.Id}" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="../../product_pages/?product=${item.Id}">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors?.[0]?.ColorName || "N/A"}</p>
  <p class="cart-card__quantity">qty: ${item.Quantity}</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <span class="remove-item" data-id="${item.Id}">❌</span>
</li>`;

  return newItem;
}

function attachRemoveListeners() {
  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      removeItemFromCart(id);
    });
  });
}

function removeItemFromCart(id) {
  let cartItems = getLocalStorage("so-cart") || [];

  const indexToRemove = cartItems.findIndex((item) => item.Id === id);
  if (indexToRemove !== -1) {
    cartItems.splice(indexToRemove, 1);
  }

  setLocalStorage("so-cart", cartItems);
  renderCartContents();
}

renderCartContents();
