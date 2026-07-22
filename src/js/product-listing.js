import ExternalServices from './ExternalServices.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter, getParam } from './utils.mjs';

loadHeaderFooter();

const category = getParam('category') || 'tents';
const categoryDisplayName = category
  .split('-')
  .map((word) => word[0].toUpperCase() + word.slice(1))
  .join(' ');

const pageTitle = document.querySelector('.page-title');
if (pageTitle) {
  pageTitle.textContent = `Top Products: ${categoryDisplayName}`;
}

const dataSource = new ExternalServices();
const listElement = document.querySelector('.product-list');
const productList = new ProductList(category, dataSource, listElement);
productList.init();
