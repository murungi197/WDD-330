import { alertMessage } from './utils.mjs';

export default class CheckoutProcess {
  constructor(dataSource) {
    this.dataSource = dataSource;
    this.TAX_RATE = 0.06;
    this.FIRST_ITEM_SHIPPING = 10;
    this.ADDITIONAL_ITEM_SHIPPING = 2;
  }

  getCartItems() {
    return JSON.parse(localStorage.getItem('so-cart')) || [];
  }

  displayCartTotals() {
    const cartItems = this.getCartItems();
    const subtotal = cartItems.reduce((sum, item) => {
      const price = typeof item.FinalPrice === 'number' ? item.FinalPrice : 0;
      return sum + price;
    }, 0);

    document.getElementById('checkout-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    this.displayOrderTotals();
    this.displayOrderItems(cartItems);
  }

  calculateTax(subtotal) {
    return subtotal * this.TAX_RATE;
  }

  calculateShipping(itemCount) {
    if (itemCount === 0) return 0;
    return this.FIRST_ITEM_SHIPPING + (itemCount - 1) * this.ADDITIONAL_ITEM_SHIPPING;
  }

  displayOrderTotals() {
    const cartItems = this.getCartItems();
    const subtotal = cartItems.reduce((sum, item) => {
      const price = typeof item.FinalPrice === 'number' ? item.FinalPrice : 0;
      return sum + price;
    }, 0);

    const tax = this.calculateTax(subtotal);
    const shipping = this.calculateShipping(cartItems.length);
    const total = subtotal + tax + shipping;

    document.getElementById('checkout-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('checkout-shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('checkout-total').textContent = `$${total.toFixed(2)}`;
  }

  displayOrderItems(cartItems) {
    const container = document.getElementById('checkout-items');
    if (!container) return;

    container.innerHTML = cartItems
      .map(
        (item) => `
          <li>
            <span>${item.Name}</span>
            <span>$${typeof item.FinalPrice === 'number' ? item.FinalPrice.toFixed(2) : '0.00'}</span>
          </li>
        `
      )
      .join('');
  }

  packageItems(items) {
    return items.map((item) => ({
      id: item.Id,
      name: item.Name,
      price: typeof item.FinalPrice === 'number' ? item.FinalPrice : 0,
      quantity: 1,
    }));
  }

  formDataToJSON(form) {
    const formData = new FormData(form);
    const json = {};
    formData.forEach((value, key) => {
      json[key] = value.trim();
    });
    return json;
  }

  async checkout(form) {
    const formData = this.formDataToJSON(form);
    const cartItems = this.getCartItems();

    const subtotal = cartItems.reduce((sum, item) => {
      const price = typeof item.FinalPrice === 'number' ? item.FinalPrice : 0;
      return sum + price;
    }, 0);

    const tax = this.calculateTax(subtotal);
    const shipping = this.calculateShipping(cartItems.length);
    const total = subtotal + tax + shipping;

    const order = {
      orderDate: new Date().toISOString(),
      fname: formData.fname,
      lname: formData.lname,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      cardNumber: formData.cardNumber,
      expiration: formData.expiration,
      code: formData.code,
      items: this.packageItems(cartItems),
      orderTotal: total.toFixed(2),
      shipping: shipping,
      tax: tax.toFixed(2),
    };

    try {
      const response = await this.dataSource.checkout(order);
      localStorage.removeItem('so-cart');
      window.location.href = 'success.html';
      return response;
    } catch (error) {
      const message = typeof error?.message === 'string' ? error.message : 'There was a problem processing your order. Please try again.';
      alertMessage(message);
    }
  }
}
