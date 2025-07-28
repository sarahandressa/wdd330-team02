import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  // 1. Pick the real URL
  const rawSrc =
    product.Images?.PrimaryMedium ||
    product.Image ||      // in case you have a local JSON version
    "";
  
  // 2. Normalize it (ensure it’s absolute or root-relative)
  const imgSrc = rawSrc.startsWith("http")
    ? rawSrc
    : `/${rawSrc.replace(/^\/+/, "")}`;

  const isDiscounted = product.FinalPrice < product.SuggestedRetailPrice;
  const discountPercent = isDiscounted
    ? Math.round(
        ((product.SuggestedRetailPrice - product.FinalPrice) /
          product.SuggestedRetailPrice) *
          100
      )
    : 0;
  
  return `
    <li class="product-card">
      <a href="/product_pages/index.html?product=${product.Id}">
        <div class="image-container">
          <img src="${imgSrc}" alt="Image of ${product.Name}" />
          ${
            isDiscounted
              ? `<div class="discount-badge">-${discountPercent}%</div>`
              : ""
          }
        </div>
        <h2 class="card__brand">${product.Brand.Name}</h2>
        <h3 class="card__name">${product.NameWithoutBrand}</h3>
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
      </a>
    </li>
  `;
}


export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    try {
      const list = await this.dataSource.getData(this.category);

      if (!Array.isArray(list)) {
        throw new Error("Expected an array of products");
      }

      // Render all products returned by the API
      this.renderList(list);
    } catch (err) {
      console.error("Error loading products:", err);
      this.listElement.innerHTML =
        `<li class="product-error">
           Failed to load products for "${this.category}"
         </li>`;
    }
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}
