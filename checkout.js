// Enhancements to main.js
// Add this code to your existing main.js file or create a new file called checkout.js

// Function to display cart items on the cart page
function displayCartItems() {
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItemsContainer = document.getElementById('cart-items');
  const totalPriceElement = document.getElementById('total-price');
  
  if (!cartItemsContainer) return;
  
  cartItemsContainer.innerHTML = '';
  
  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty. <a href="MENU.html">Continue shopping</a></p>';
    totalPriceElement.textContent = '₱0.00';
    return;
  }
  
  let totalPrice = 0;
  
  cartItems.forEach(item => {
    const cartItemElement = document.createElement('div');
    cartItemElement.classList.add('cart-item');
    
    const itemPrice = parseFloat(item.price) * item.quantity;
    totalPrice += itemPrice;
    
    cartItemElement.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-details">
        <h3>${item.name}</h3>
        <p>₱${item.price} each</p>
        <div class="quantity-controls">
          <button class="quantity-btn decrease" data-id="${item.id}">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="quantity-btn increase" data-id="${item.id}">+</button>
        </div>
      </div>
      <div class="cart-item-price">
        <p>₱${itemPrice.toFixed(2)}</p>
        <button class="remove-btn" data-id="${item.id}">Remove</button>
      </div>
    `;
    
    cartItemsContainer.appendChild(cartItemElement);
  });
  
  totalPriceElement.textContent = `₱${totalPrice.toFixed(2)}`;
  
  // Add event listeners for quantity buttons and remove buttons
  const decreaseButtons = document.querySelectorAll('.quantity-btn.decrease');
  const increaseButtons = document.querySelectorAll('.quantity-btn.increase');
  const removeButtons = document.querySelectorAll('.remove-btn');
  
  decreaseButtons.forEach(button => {
    button.addEventListener('click', function() {
      const itemId = this.getAttribute('data-id');
      updateCartItemQuantity(itemId, 'decrease');
    });
  });
  
  increaseButtons.forEach(button => {
    button.addEventListener('click', function() {
      const itemId = this.getAttribute('data-id');
      updateCartItemQuantity(itemId, 'increase');
    });
  });
  
  removeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const itemId = this.getAttribute('data-id');
      removeCartItem(itemId);
    });
  });
}

// Function to update cart item quantity
function updateCartItemQuantity(itemId, action) {
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  const itemIndex = cartItems.findIndex(item => item.id === itemId);
  
  if (itemIndex !== -1) {
    if (action === 'increase') {
      cartItems[itemIndex].quantity += 1;
    } else if (action === 'decrease') {
      cartItems[itemIndex].quantity = Math.max(1, cartItems[itemIndex].quantity - 1);
    }
    
    localStorage.setItem('cart', JSON.stringify(cartItems));
    displayCartItems();
  }
}

// Function to remove cart item
function removeCartItem(itemId) {
  let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  cartItems = cartItems.filter(item => item.id !== itemId);
  localStorage.setItem('cart', JSON.stringify(cartItems));
  displayCartItems();
}

// Checkout functionality
function initializeCheckout() {
  const checkoutBtn = document.getElementById('checkout-btn');
  if (!checkoutBtn) return;
  
  checkoutBtn.addEventListener('click', function() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cartItems.length === 0) {
      document.getElementById('checkout-message').textContent = 'Your cart is empty.';
      return;
    }
    
    // Check if user is logged in
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    
    if (!loggedInUser) {
      document.getElementById('checkout-message').textContent = 'Please log in to continue with checkout.';
      document.getElementById('login-redirect').style.display = 'block';
      return;
    }
    
    // Proceed to checkout
    window.location.href = 'checkout.html';
  });
}

// Function to display items on the checkout page
function displayCheckoutItems() {
  const checkoutItemsContainer = document.getElementById('checkout-items');
  const subtotalElement = document.getElementById('subtotal');
  const totalElement = document.getElementById('checkout-total');
  
  if (!checkoutItemsContainer) return;
  
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  
  if (cartItems.length === 0) {
    window.location.href = 'CART.html';
    return;
  }
  
  checkoutItemsContainer.innerHTML = '';
  let subtotal = 0;
  
  cartItems.forEach(item => {
    const itemTotal = parseFloat(item.price) * item.quantity;
    subtotal += itemTotal;
    
    const itemElement = document.createElement('div');
    itemElement.classList.add('summary-item');
    itemElement.innerHTML = `
      <span>${item.name} x ${item.quantity}</span>
      <span>₱${itemTotal.toFixed(2)}</span>
    `;
    
    checkoutItemsContainer.appendChild(itemElement);
  });
  
  subtotalElement.textContent = `₱${subtotal.toFixed(2)}`;
  
  // Calculate total (subtotal + delivery fee)
  const deliveryFee = 50;
  const total = subtotal + deliveryFee;
  totalElement.textContent = `₱${total.toFixed(2)}`;
  
  // Handle order submission
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        deliveryDate: document.getElementById('delivery-date').value,
        paymentMethod: document.querySelector('input[name="payment"]:checked').value,
        items: cartItems,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: total
      };
      
      // Save order to localStorage
      const orders = JSON.parse(localStorage.getItem('orders')) || [];
      const orderId = `ORDER-${Date.now()}`;
      
      const newOrder = {
        id: orderId,
        date: new Date().toISOString(),
        ...formData,
        status: 'pending'
      };
      
      orders.push(newOrder);
      localStorage.setItem('orders', JSON.stringify(orders));
      
      // Clear cart
      localStorage.setItem('cart', JSON.stringify([]));
      
      // Redirect to order confirmation page
      alert(`Order placed successfully! Your order ID is: ${orderId}`);
      window.location.href = 'index.html';
    });
  }
}

// Initialize user data on page load
function initUserData() {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const userGreeting = document.getElementById('user-greeting');
  
  if (loggedInUser && userGreeting) {
    userGreeting.textContent = `Hello, ${loggedInUser.name}`;
    
    // Add logout link
    const logoutLink = document.createElement('a');
    logoutLink.href = '#';
    logoutLink.textContent = 'Logout';
    logoutLink.classList.add('logout-link');
    logoutLink.addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.removeItem('loggedInUser');
      window.location.reload();
    });
    
    userGreeting.appendChild(document.createElement('br'));
    userGreeting.appendChild(logoutLink);
  }
}

// Initialize everything when document is loaded
document.addEventListener('DOMContentLoaded', function() {
  displayCartItems();
  initializeCheckout();
  displayCheckoutItems();
  initUserData();
});

// Add styles for cart items
if (!document.querySelector('#cart-styles')) {
  const style = document.createElement('style');
  style.id = 'cart-styles';
  style.textContent = `
    .cart-section {
      max-width: 1000px;
      margin: 40px auto;
      padding: 20px;
    }
    
    .cart-items {
      margin-bottom: 30px;
    }
    
    .cart-item {
      display: flex;
      border-bottom: 1px solid #eee;
      padding: 15px 0;
      margin-bottom: 15px;
    }
    
    .cart-item-image {
      width: 100px;
      height: 100px;
      overflow: hidden;
      border-radius: 5px;
      margin-right: 20px;
    }
    
    .cart-item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .cart-item-details {
      flex: 1;
    }
    
    .cart-item-price {
      text-align: right;
      font-weight: bold;
    }
    
    .quantity-controls {
      display: flex;
      align-items: center;
      margin-top: 10px;
    }
    
    .quantity-btn {
      width: 30px;
      height: 30px;
      background: #f0f0f0;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      font-size: 16px;
    }
    
    .quantity {
      margin: 0 10px;
      font-weight: bold;
    }
    
    .remove-btn {
      background: none;
      border: none;
      color: #e74c3c;
      cursor: pointer;
      font-size: 14px;
      margin-top: 10px;
    }
    
    .cart-summary {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 5px;
    }
    
    .cart-summary h2 {
      margin-top: 0;
    }
    
    .checkout-button {
      background-color: #e98c46;
      color: white;
      border: none;
      padding: 12px 20px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 4px;
      cursor: pointer;
      width: 100%;
      margin-top: 10px;
    }
    
    .checkout-button:hover {
      background-color: #d67b35;
    }
  `;
  document.head.appendChild(style);
}