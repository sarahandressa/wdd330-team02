import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const isDiscounted = product.FinalPrice < product.SuggestedRetailPrice;
  const discountPercent = isDiscounted
    ? Math.round(((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100)
    : 0;
  return `
    <li class="product-card">
      <a href="../../product_pages/?product=${product.Id}">
        <div class="image-container">
          <img src="${product.Image}" alt="Image of ${product.Name}">
          ${isDiscounted ? `<div class="discount-badge">-${discountPercent}%</div>` : ""}
        </div>  
        <h2 class="card__brand">${product.Brand}</h2>
        <h3 class="card__name">${product.Name}</h3>
        <p class="product-card__price">
        ${isDiscounted ? `<span class="old-price">$${product.SuggestedRetailPrice.toFixed(2)}</span>` : ""}
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
    const list = await this.dataSource.getData();
    this.renderList(list);
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}

