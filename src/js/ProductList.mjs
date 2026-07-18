import { renderListWithTemplate } from './utils.mjs';

function productCardTemplate(product) {
  const brandName = product.Brand?.Name || '';
  const productName = product.NameWithoutBrand || product.Name || '';
  const imageSrc = product.Images?.PrimaryMedium || product.Image || '';
  const finalPrice =
    typeof product.FinalPrice === 'number' ? product.FinalPrice : null;
  const suggestedPrice =
    typeof product.SuggestedRetailPrice === 'number'
      ? product.SuggestedRetailPrice
      : null;
  const isDiscounted =
    finalPrice !== null &&
    suggestedPrice !== null &&
    finalPrice < suggestedPrice;

  const discountBadge = isDiscounted
    ? `<span class="product-card__discount">Discount</span>`
    : '';
  const suggestedPriceLine =
    isDiscounted
      ? `<p class="product-card__suggested">$${suggestedPrice.toFixed(2)}</p>`
      : '';
  const price =
    finalPrice !== null ? `$${finalPrice.toFixed(2)}` : '';
  const productId = product.Id || '';

  return `<li class="product-card${isDiscounted ? ' product-card--discounted' : ''}">
    <a href="/product_pages/index.html?product=${productId}">
      ${discountBadge}
      <img src="${imageSrc}" alt="Image of ${brandName} ${productName}" />
      <h3 class="card__brand">${brandName}</h3>
      <h2 class="card__name">${productName}</h2>
      <p class="product-card__price">${price}</p>
      ${suggestedPriceLine}
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    if (!this.listElement) {
      throw new Error('Product list element is required.');
    }

    const list = await this.dataSource.getData(this.category);
    this.renderList(list);
  }

  renderList(list) {
    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      list,
      'afterbegin',
      true,
    );
  }
}
