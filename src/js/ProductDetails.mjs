import { getLocalStorage, setLocalStorage, updateCartBadge, alertMessage } from './utils.mjs';
export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    if (!this.productId) {
      throw new Error('Product ID is required to load product details.');
    }

    this.product = await this.dataSource.findProductById(this.productId);
    if (!this.product) {
      throw new Error(`Product not found: ${this.productId}`);
    }

    this.renderProductDetails();
    const addToCartButton = document.getElementById('addToCart');
    if (addToCartButton) {
      addToCartButton.addEventListener(
        'click',
        this.addProductToCart.bind(this),
      );
    }
  }

  addProductToCart() {
    const cartItems = getLocalStorage('so-cart') || [];
    cartItems.push(this.product);
    setLocalStorage('so-cart', cartItems);
    updateCartBadge();
    alertMessage('Product added to cart!', false);
  }

  renderProductDetails() {
    const productDetail = document.querySelector('.product-detail');
    if (!productDetail) {
      throw new Error('Unable to find product detail container in the page.');
    }

    const {
      Brand,
      NameWithoutBrand,
      Images,
      FinalPrice,
      Colors,
      DescriptionHtmlSimple,
      Id,
    } = this.product;
    const brandName = Brand?.Name || '';
    const colorName = Colors?.[0]?.ColorName || '';
    const price =
      typeof FinalPrice === 'number' ? `$${FinalPrice.toFixed(2)}` : '';
    const imageSrc =
      Images?.PrimaryLarge || Images?.PrimaryMedium || this.product.Image || '';

    productDetail.innerHTML = `
      <h3>${brandName}</h3>
      <h2 class="divider">${NameWithoutBrand}</h2>
      <img class="divider" src="${imageSrc}" alt="${brandName} ${NameWithoutBrand}" />
      <p class="product-card__price">${price}</p>
      <p class="product__color">${colorName}</p>
      <p class="product__description">${DescriptionHtmlSimple}</p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${Id}">Add to Cart</button>
      </div>
    `;
  }
}
