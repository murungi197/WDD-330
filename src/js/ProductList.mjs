import { renderListWithTemplate } from './utils.mjs';

function productCardTemplate(product) {
  const brandName = product.Brand?.Name || '';
  const productName = product.NameWithoutBrand || product.Name || '';
  const imageSrc = product.Image || '';
  const price =
    typeof product.FinalPrice === 'number'
      ? `$${product.FinalPrice.toFixed(2)}`
      : '';
  const productId = product.Id || '';

  return `<li class="product-card">
    <a href="product_pages/?product=${productId}">
      <img src="${imageSrc}" alt="Image of ${brandName} ${productName}" />
      <h3 class="card__brand">${brandName}</h3>
      <h2 class="card__name">${productName}</h2>
      <p class="product-card__price">${price}</p>
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

    const list = await this.dataSource.getData();
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
