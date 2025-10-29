// cart.js
let cart = [];

function addToCart(productName, price) {
  cart.push({ name: productName, price: price });
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(productName + " added to cart!");
}

function loadCart() {
  let cartData = JSON.parse(localStorage.getItem('cart')) || [];
  let container = document.getElementById('cart-items');
  let total = 0;

  cartData.forEach((item) => {
    let div = document.createElement('div');
    div.textContent = item.name + " - ₹" + item.price;
    container.appendChild(div);
    total += item.price;
  });

  document.getElementById('total').textContent = "Total: ₹" + total;
      }
