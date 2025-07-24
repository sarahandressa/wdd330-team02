import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];

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
  // pick a real image URL, with sensible fallbacks
  const imgSrc =
    item.Image ||
    item.Images?.PrimarySmall ||
    item.Images?.PrimaryMedium ||
    item.Images?.PrimaryLarge ||
    "/images/default-product.jpg";

  return `
    <li class="cart-card divider">
      <a href="/product_pages/index.html?product=${item.Id}" class="cart-card__image">
        <img
          src="${imgSrc}"
          alt="${item.NameWithoutBrand || item.Name}"
        />
      </a>
      <a href="/product_pages/index.html?product=${item.Id}">
        <h2 class="card__name">${item.NameWithoutBrand || item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors?.[0]?.ColorName || "N/A"}</p>
      <p class="cart-card__quantity">qty: ${item.quantity}</p>
      <p class="cart-card__price">$${item.FinalPrice.toFixed(2)}</p>
      <span class="remove-item" data-id="${item.Id}">❌</span>
    </li>
  `;
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

  const item = cartItems.find((item) => item.Id === id);

  if (item) {
    if (item.quantity > 1) {
      item.quantity -= 1; // Decrease by 1
    } else {
      // Remove if quantity becomes 0
      cartItems = cartItems.filter((item) => item.Id !== id);
    }

    setLocalStorage("so-cart", cartItems);
    renderCartContents();
    calculateCartTotal();

    if (window.checkout) {
      window.checkout.init(); // Recalculate summary and update DOM
    }
  }
}

//Total price fix
function calculateCartTotal() {
  const cartItems = getLocalStorage("so-cart") || [];
  const total = cartItems.reduce((sum, item) => {
    const quantity = item.quantity || 1;
    return sum + item.FinalPrice * quantity;
  }, 0);

  const totalElement = document.querySelector(".cartTotal");
  if (totalElement) {
    totalElement.textContent = `Total: $${total.toFixed(2)}`;
  }
}

function ensureCartQuantities() {
  const cartItems = getLocalStorage("so-cart") || [];
  cartItems.forEach((item) => {
    if (!item.quantity) item.quantity = 1;
  });
  setLocalStorage("so-cart", cartItems);
  return cartItems;
}

const cartItems = ensureCartQuantities();
renderCartContents();
calculateCartTotal();

export { renderCartContents, calculateCartTotal, ensureCartQuantities };
