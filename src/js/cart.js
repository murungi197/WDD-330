import { getLocalStorage, setLocalStorage, loadHeaderFooter } from './utils.mjs';

loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart') || [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector('.product-list').innerHTML = htmlItems.join('');
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
