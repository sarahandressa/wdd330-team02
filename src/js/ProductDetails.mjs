// src/js/ProductDetails.mjs

import cartIcon, { getLocalStorage, setLocalStorage } from "./utils.mjs";

function productDetailsTemplate(product) {
  // 1️⃣ Pick the real URL from the Images object
  const rawSrc =
    product.Images?.PrimaryLarge ||
    product.Images?.PrimaryMedium ||
    product.Images?.PrimarySmall ||
    "/images/default-product.jpg";

  // 2️⃣ No need to normalize "http" URLs here
  const imageSrc = rawSrc;

  const color = product.Colors?.[0]?.ColorName || "Color not specified";
  const description = product.DescriptionHtmlSimple || "No description available";

  const isDiscounted = product.FinalPrice < product.SuggestedRetailPrice;
  const discountPercent = isDiscounted
    ? Math.round(
        ((product.SuggestedRetailPrice - product.FinalPrice) /
          product.SuggestedRetailPrice) *
          100
      )
    : 0;

  return `
    <h2>${product.Brand.Name}</h2>
    <h3 class="divider">${product.NameWithoutBrand}</h3>
    <div class="image-container">
      <img
        src="${imageSrc}"
        alt="${product.NameWithoutBrand}"
        class="divider"
      />
      ${
        isDiscounted
          ? `<div class="discount-badge">-${discountPercent}%</div>`
          : ""
      }
    </div>
    <p class="product-card__price">
      ${
        isDiscounted
          ? `<span class="old-price">$${product.SuggestedRetailPrice.toFixed(
              2
            )}</span>`
          : ""
      }
      <span class="final-price">$${product.FinalPrice.toFixed(2)}</span>
    </p>
    <p class="product__color">${color}</p>
    <p class="product__description">${description}</p>
    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
    </div>
  `;
}

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    const target = document.querySelector(".product-detail");
    if (!target) return;

    target.innerHTML = `<div class="loading-spinner">Loading product details...</div>`;

    try {
      this.product = await this.dataSource.findProductById(this.productId);
      this.renderProductDetails();

      document
        .getElementById("addToCart")
        ?.addEventListener("click", this.addProductToCart.bind(this));
    } catch (error) {
      target.innerHTML =
        `<p class="error-message">Unable to load product at this time.</p>`;
      console.error(error);
    }
  }

  addProductToCart() {
    let cartItems = getLocalStorage("so-cart") || [];
    const existing = cartItems.find((i) => i.Id === this.product.Id);

    if (existing) {
      existing.quantity++;
    } else {
      cartItems.push({ ...this.product, quantity: 1 });
    }

    setLocalStorage("so-cart", cartItems);
    cartIcon();
  }

  renderProductDetails() {
    const target = document.querySelector(".product-detail");
    if (!this.product?.Id) {
      target.innerHTML = `<p class="error-message">Product not found.</p>`;
      return;
    }

    document.title = 
      `Sleep Outside | ${this.product.Brand.Name} ${this.product.NameWithoutBrand}`;
    target.innerHTML = productDetailsTemplate(this.product);
  }
}

