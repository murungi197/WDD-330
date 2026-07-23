import { loadHeaderFooter } from './utils.mjs';
import CheckoutProcess from './CheckoutProcess.mjs';
import ExternalServices from './ExternalServices.mjs';

loadHeaderFooter();

const externalServices = new ExternalServices();
const checkoutProcess = new CheckoutProcess(externalServices);

const form = document.getElementById('checkout-form');
if (form) {
  checkoutProcess.displayCartTotals();

  const zipInput = document.getElementById('zip');
  if (zipInput) {
    zipInput.addEventListener('input', () => {
      checkoutProcess.displayOrderTotals();
    });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const submitButton = document.getElementById('checkout-submit');
    submitButton.disabled = true;
    submitButton.textContent = 'Processing...';

    await checkoutProcess.checkout(form);

    submitButton.disabled = false;
    submitButton.textContent = 'Place Order';
  });
}
