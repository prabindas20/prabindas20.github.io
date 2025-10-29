<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Prabin Store</title>
  <style>
    body {
      background: #f8f9fa;
      font-family: "Poppins", sans-serif;
      margin: 0;
      padding: 0;
      text-align: center;
    }
    header {
      background: #0077ff;
      color: white;
      padding: 20px;
      font-size: 24px;
      font-weight: bold;
    }
    .product-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 40px;
    }
    .product {
      background: white;
      width: 250px;
      margin: 15px;
      border-radius: 15px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      padding: 15px;
    }
    .product img {
      width: 100%;
      border-radius: 10px;
    }
    .product h3 {
      margin: 10px 0 5px;
    }
    .price {
      color: #0077ff;
      font-weight: bold;
      font-size: 18px;
    }
    .btn {
      background: #0077ff;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      margin-top: 10px;
    }
  </style>
</head>
<body>

  <header>🛍️ Prabin's Online Store</header>

  <div class="product-container">
    <div class="product">
      <img src="https://placekitten.com/250/250" alt="Product 1">
      <h3>Stylish T-Shirt</h3>
      <p class="price">₹499</p>
      <a href="https://rzp.io/l/yourlink" target="_blank"><button class="btn">Buy Now</button></a>
    </div>

    <div class="product">
      <img src="https://placehold.co/250x250" alt="Product 2">
      <h3>Handmade Bag</h3>
      <p class="price">₹899</p>
      <a href="https://rzp.io/l/yourlink" target="_blank"><button class="btn">Buy Now</button></a>
    </div>

    <div class="product">
      <img src="https://placehold.co/250x250?text=Item+3" alt="Product 3">
      <h3>Wooden Craft</h3>
      <p class="price">₹699</p>
      <a href="https://rzp.io/l/yourlink" target="_blank"><button class="btn">Buy Now</button></a>
    </div>
  </div>

</body> <script src="cart.js"></script>

</html>
