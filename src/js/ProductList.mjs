import { renderListWithTemplate, renderWithTemplate } from "./utils.mjs";

const sortList = `
  <div class="sort-buttons">
    <label for="sort-by">Sort by:</label>
    <select id="sort-by" name="sort-by">
      <option value="name">Name</option>
      <option value="price">Price</option>
      <option value="discount">Discount</option>
    </select>
  </div>
`;

function productCardTemplate(product) {
  const rawSrc =
    product.Images?.PrimaryMedium ||
    product.Image || "";
  
  const imgSrc = rawSrc.startsWith("http")
    ? rawSrc
    : `/${rawSrc.replace(/^\/+/, "")}`;

  const isDiscounted = product.FinalPrice < product.SuggestedRetailPrice;
  const discountPercent = isDiscounted
    ? Math.round(
        ((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100
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
              ? `<span class="old-price">$${product.SuggestedRetailPrice.toFixed(2)}</span>`
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

      this.renderSortUI();
      this.renderList(list);
      this.sortBy(list);
      
    } catch (err) {
      console.error("Error loading products:", err);
      this.listElement.innerHTML =
        `<li class="product-error">
           Failed to load products for "${this.category}"
         </li>`;
    }
  }

  renderSortUI() {
    this.listElement.innerHTML = sortList;
  }

  sortBy(originalList) {
    const select = document.getElementById("sort-by");
    if (!select) return;

    select.addEventListener("change", (event) => {
      const value = event.target.value;
      let sortedList = [...originalList];

      switch (value) {
        case "name":
          sortedList.sort((a, b) =>
            a.NameWithoutBrand.localeCompare(b.NameWithoutBrand)
          );
          break;
        case "price":
          sortedList.sort((a, b) => a.FinalPrice - b.FinalPrice);
          break;
        case "discount":
          sortedList.sort((a, b) => {
            const aDiscount = a.SuggestedRetailPrice - a.FinalPrice;
            const bDiscount = b.SuggestedRetailPrice - b.FinalPrice;
            return bDiscount - aDiscount;
          });
          break;
      }

      this.renderList(sortedList);
    });
  }

  renderList(list) {
    const oldList = this.listElement.querySelector("ul");
    if (oldList) oldList.remove();

    const productList = document.createElement("ul");
    productList.classList.add("product-list");
    renderListWithTemplate(productCardTemplate, productList, list);
    this.listElement.appendChild(productList);
  }
}
