import { getLocalStorage, setLocalStorage, loadHeaderFooter } from './utils.mjs';

loadHeaderFooter();

const TAX_RATE = 0.06;
const FIRST_ITEM_SHIPPING = 10;
const ADDITIONAL_ITEM_SHIPPING = 2;

function formatCurrency(amount) {
  return amount.toFixed(2);
}

function calculateCartTotals() {
  const cartItems = getLocalStorage('so-cart') || [];
  const subtotal = cartItems.reduce((sum, item) => {
    const price = typeof item.FinalPrice === 'number' ? item.FinalPrice : 0;
    return sum + price;
  }, 0);
  
  const tax = subtotal * TAX_RATE;
  const shipping = cartItems.length === 0 
    ? 0 
    : FIRST_ITEM_SHIPPING + (cartItems.length - 1) * ADDITIONAL_ITEM_SHIPPING;
  const total = subtotal + tax + shipping;
  
  return { subtotal, tax, shipping, total };
}

function displayCartTotals() {
  const { subtotal, tax, shipping, total } = calculateCartTotals();
  
  const subtotalEl = document.getElementById('cart-subtotal');
  const taxEl = document.getElementById('cart-tax');
  const shippingEl = document.getElementById('cart-shipping');
  const totalEl = document.getElementById('cart-total');
  
  if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
  if (taxEl) taxEl.textContent = formatCurrency(tax);
  if (shippingEl) shippingEl.textContent = formatCurrency(shipping);
  if (totalEl) totalEl.textContent = formatCurrency(total);
}

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart') || [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector('.product-list').innerHTML = htmlItems.join('');
  displayCartTotals();
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <button class="cart-card__remove" data-id="${item.Id}" aria-label="Remove ${item.Name}">&#10005;</button>
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

function removeFromCart(id) {
  const cartItems = getLocalStorage('so-cart') || [];
  const updatedItems = cartItems.filter((item) => item.Id !== id);
  setLocalStorage('so-cart', updatedItems);
  renderCartContents();
}

function initRemoveButtons() {
  const productList = document.querySelector('.product-list');
  if (productList) {
    productList.addEventListener('click', (event) => {
      const removeButton = event.target.closest('.cart-card__remove');
      if (removeButton) {
        removeFromCart(removeButton.dataset.id);
      }
    });
  }
}

renderCartContents();
initRemoveButtons();
