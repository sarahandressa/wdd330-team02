import { getLocalStorage, formDataToJSON } from './utils.mjs';
import ProductData from './ExternalServices.mjs'; // file still named ProductData
import { ensureCartQuantities } from './cart.js';

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
    ensureCartQuantities();
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal();
    this.calculateOrderTotal();
  }

  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce((sum, item) => sum + item.FinalPrice * item.quantity, 0);
    const itemCount = this.list.reduce((sum, item) => sum + item.quantity, 0);

    document.querySelector(`${this.outputSelector} #subtotal`).textContent = this.itemTotal.toFixed(2);
    document.querySelector(`${this.outputSelector} #item-count`).textContent = itemCount;
  }

  calculateOrderTotal() {
    const itemCount = this.list.reduce((sum, item) => sum + item.quantity, 0);
    this.tax = this.itemTotal * 0.06;
    this.shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    document.querySelector(`${this.outputSelector} #tax`).textContent = this.tax.toFixed(2);
    document.querySelector(`${this.outputSelector} #shipping`).textContent = this.shipping.toFixed(2);
    document.querySelector(`${this.outputSelector} #order-total`).textContent = this.orderTotal.toFixed(2);
  }

  packageItems(items) {
    return items.map(item => ({
      id: item.Id,
      name: item.Name,
      price: item.FinalPrice,
      quantity: item.quantity
    }));
  }

  async checkout(form) {
    const order = formDataToJSON(form);
    order.orderDate = new Date().toISOString();
    order.items = this.packageItems(this.list);
    order.tax = this.tax.toFixed(2);
    order.shipping = this.shipping;
    order.orderTotal = this.orderTotal.toFixed(2);

    try {
      const response = await new ProductData(import.meta.env.VITE_SERVER_URL).checkout(order);
      console.log('✅ Order submitted:', response);
      localStorage.removeItem(this.key);
      // Optionally redirect or show success message
    } catch (err) {
      console.error('❌ Checkout failed:', err);
    }
  }
}

