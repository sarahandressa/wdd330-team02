import { getLocalStorage, setLocalStorage } from "./utils.mjs";

// This is the product detail template generator
function productDetailsTemplate(product) {
  const fallbackImage = "/images/default-product.jpg";
  const imageSrc = product.Image || fallbackImage;
  const color = product.Colors?.[0]?.ColorName || "Color not specified";
  const description = product.DescriptionHtmlSimple || "No description available";

  return `
    <h2>${product.Brand.Name}</h2>
    <h3 class="divider">${product.NameWithoutBrand}</h3>
    <img
      src="${imageSrc}"
      alt="${product.NameWithoutBrand}"
      class="divider"
    />
    <p class="product-card__price">$${product.FinalPrice}</p>
    <p class="product__color">${color}</p>
    <p class="product__description">${description}</p>
    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
    </div>
  `;
}

//  Main class
export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    const target = document.querySelector(".product-detail");
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

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
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
