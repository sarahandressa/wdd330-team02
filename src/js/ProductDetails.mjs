import cartIcon, { getLocalStorage, setLocalStorage } from "./utils.mjs";

function productDetailsTemplate(product) {
  const fallbackImage = "/images/default-product.jpg";
  const imageSrc = product.Image || fallbackImage;
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
      ${isDiscounted ? `<div class="discount-badge">-${discountPercent}%</div>` : ""}
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
    console.log("ProductDetails init called");

    const target = document.querySelector(".product-detail");
    if (target) {
      target.innerHTML = `<div class="loading-spinner">Loading product details...</div>`;

      try {
        this.product = await this.dataSource.findProductById(this.productId);
        this.renderProductDetails();

        document
          .getElementById("addToCart")
          ?.addEventListener("click", this.addProductToCart.bind(this));
      } catch (error) {
        target.innerHTML = `<p class="error-message">Unable to load product at this time.</p>`;
        console.error(error);
      }
    }
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    
    if (!cartItems.some(product => product.Id === this.product.Id)) {
      this.product.Quantity = 1
      cartItems.push(this.product);
      setLocalStorage("so-cart", cartItems);
    } else {
      cartItems.find(product => product.Id === this.product.Id).Quantity += 1
      setLocalStorage("so-cart", cartItems);
    }
    cartIcon()
  }

  renderProductDetails() {
    const target = document.querySelector(".product-detail");

    if (!this.product || !this.product.Id) {
      target.innerHTML = `<p class="error-message">Product not found.</p>`;
      return;
    }

    document.title = `Sleep Outside | ${this.product.Brand.Name} ${this.product.NameWithoutBrand}`;
    target.innerHTML = productDetailsTemplate(this.product);
  }
}