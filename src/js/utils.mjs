// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener('touchend', (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener('click', callback);
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = 'afterbegin',
  clear = false,
) {
  if (!parentElement) {
    throw new Error('Parent element is required to render a list.');
  }

  if (clear) {
    parentElement.innerHTML = '';
  }

  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(''));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  if (!parentElement) {
    throw new Error('Parent element is required to render a template.');
  }

  parentElement.innerHTML = template;

  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Failed to load template: ${path}`);
  }
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate('/partials/header.html');
  const footerTemplate = await loadTemplate('/partials/footer.html');

  const headerElement = document.querySelector('#main-header');
  const footerElement = document.querySelector('#main-footer');

  if (headerElement) {
    renderWithTemplate(headerTemplate, headerElement);
    updateCartBadge();
  }

  if (footerElement) {
    renderWithTemplate(footerTemplate, footerElement);
  }
}

export function updateCartBadge() {
  const cartItems = getLocalStorage('so-cart') || [];
  const cartBadge = document.getElementById('cart-count');
  if (cartBadge) {
    cartBadge.textContent = cartItems.length > 0 ? cartItems.length : '';
  }
}

export function alertMessage(message, scroll = true) {
  const alert = document.createElement('div');
  alert.classList.add('alert');
  alert.innerHTML = `<span>${message}</span><span class="alert__close">&times;</span>`;

  alert.addEventListener('click', function(e) {
    if (e.target.classList.contains('alert__close')) {
      main.removeChild(this);
    }
  });

  const main = document.querySelector('main');
  main.prepend(alert);

  if (scroll) {
    window.scrollTo(0, 0);
  }
}
