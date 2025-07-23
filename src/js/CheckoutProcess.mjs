import { getLocalStorage } from "./utils.mjs";
 
export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }
 
  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal();
  }
 
  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce((sum, item) => {
      return sum + item.FinalPrice * item.quantity;
    }, 0);
 
    const itemCount = this.list.reduce((count, item) => count + item.quantity, 0);
 
    // Display item subtotal and count
    const subtotalEl = document.querySelector(`${this.outputSelector} #subtotal`);
    const itemCountEl = document.querySelector(`${this.outputSelector} #item-count`);
 
    if (subtotalEl) subtotalEl.innerText = `$${this.itemTotal.toFixed(2)}`;
    if (itemCountEl) itemCountEl.innerText = itemCount;
  }
 
  calculateOrderTotal() {
    const itemCount = this.list.reduce((count, item) => count + item.quantity, 0);
 
    // Tax: 6% of subtotal
    this.tax = this.itemTotal * 0.06;
 
    // Shipping: $10 for first item, $2 for each additional
    this.shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;
 
    this.orderTotal = this.itemTotal + this.tax + this.shipping;
 
    this.displayOrderTotals();
  }
 
  displayOrderTotals() {
    const taxEl = document.querySelector(`${this.outputSelector} #tax`);
    const shippingEl = document.querySelector(`${this.outputSelector} #shipping`);
    const totalEl = document.querySelector(`${this.outputSelector} #order-total`);
 
    if (taxEl) taxEl.innerText = `$${this.tax.toFixed(2)}`;
    if (shippingEl) shippingEl.innerText = `$${this.shipping.toFixed(2)}`;
    if (totalEl) totalEl.innerText = `$${this.orderTotal.toFixed(2)}`;
  }
}