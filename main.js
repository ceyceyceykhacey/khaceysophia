// Toggle hamburger menu
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger?.addEventListener('click', () => {
    nav.classList.toggle('active');
});

// Add to cart animation and functionality
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', e => {
        const product = e.target.closest('.product');
        const name = product.dataset.name;
        const price = parseFloat(product.dataset.price || 0);
        const imgElement = product.querySelector('img');
        const imageSrc = imgElement ? imgElement.src : '';

        // Animation
        if (imgElement) {
            const flyImage = imgElement.cloneNode(true);
            flyImage.classList.add('fly-image');
            document.body.appendChild(flyImage);

            const imgRect = imgElement.getBoundingClientRect();
            const cartIcon = document.querySelector('.icon-button img');
            
            if (cartIcon) {
                const cartRect = cartIcon.getBoundingClientRect();

                flyImage.style.left = `${imgRect.left}px`;
                flyImage.style.top = `${imgRect.top}px`;

                requestAnimationFrame(() => {
                    flyImage.style.transform = `translate(${cartRect.left - imgRect.left}px, ${cartRect.top - imgRect.top}px) scale(0.2)`;
                    flyImage.style.opacity = '0';
                });

                setTimeout(() => {
                    flyImage.remove();
                }, 400);
            }
        }

        // Update cart
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existing = cart.find(item => item.name === name);
        
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ 
                name: name, 
                price: price, 
                image: imageSrc, 
                quantity: 1 
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));

        // Update cart count
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        localStorage.setItem('cartCount', count);
        updateCartCount();
        
        // Provide feedback
        alert(`${name} added to cart!`);
    });
});

// Update cart item count in header
function updateCartCount() {
    const count = localStorage.getItem('cartCount') || '0';
    let countEl = document.querySelector('.cart-count');

    if (!countEl) {
        const iconButton = document.querySelector('.icon-button');
        countEl = document.createElement('div');
        countEl.className = 'cart-count';
        iconButton.appendChild(countEl);
    }

    countEl.textContent = count;
}

// Show welcome message with username (after login)
function showWelcomeMessage() {
    const email = localStorage.getItem('userEmail');
    if (email) {
        const container = document.querySelector('.auth-buttons');
        const welcome = document.createElement('span');
        welcome.className = 'welcome-user';
        container?.appendChild(welcome);
    }
}

// Smooth page transitions
document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('mailto:')) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            document.body.classList.add('fade-out');
            setTimeout(() => {
                window.location.href = this.href;
            }, 300);
        });
    }
});

// Show header username and hide login button
document.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";
    const email = localStorage.getItem("userEmail");

    if (isLoggedIn && email) {
        const greetingElement = document.getElementById("user-greeting");
        if (greetingElement) greetingElement.innerHTML = `WELCOME, ${email}`;

        const loginButton = document.querySelector("a[href='LOGIN.html']");
        if (loginButton) loginButton.style.display = "none";
    }

    updateCartCount();
    showWelcomeMessage();
});

// Login/signup/reset handling
const users = [
    { email: "test@example.com", password: "password123" },
];

function toggleLogin() {
    document.getElementById("login-form").style.display = "block";
    document.getElementById("forgot-password-form").style.display = "none";
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("account-info").style.display = "none";
}

function toggleForgotPassword() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("forgot-password-form").style.display = "block";
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("account-info").style.display = "none";
}

function toggleSignUp() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("forgot-password-form").style.display = "none";
    document.getElementById("signup-form").style.display = "block";
    document.getElementById("account-info").style.display = "none";
}

function loginUser(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem("userLoggedIn", "true");
        localStorage.setItem("userEmail", email);
        window.location.href = "index.html";
    } else {
        document.getElementById("error-message").style.display = "block";
    }
}

function signUpUser(event) {
    event.preventDefault();
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }

    users.push({ email, password });
    localStorage.setItem("userLoggedIn", "true");
    localStorage.setItem("userEmail", email);
    window.location.href = "index.html";
}

function resetPassword(event) {
    event.preventDefault();
    alert("If this was a real site, a password reset link would be sent.");
    toggleLogin();
}

function togglePassword() {
    const passwordField = document.getElementById("password");
    passwordField.type = document.getElementById("show-password").checked ? "text" : "password";
}

function toggleSignUpPassword() {
    const passwordField = document.getElementById("signup-password");
    passwordField.type = document.getElementById("show-signup-password").checked ? "text" : "password";
}

function showAccountInfo(email) {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("forgot-password-form").style.display = "none";
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("error-message").style.display = "none";
    document.getElementById("account-info").style.display = "block";
    document.getElementById("account-info").innerHTML = `
        <h4>Welcome, ${email}!</h4>
        <p>You are currently logged in.</p>
        <button onclick="logoutUser()">Logout</button>
    `;
}

function logoutUser() {
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("userEmail");
    toggleLogin();
}

// Load cart page
document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");
    const checkoutBtn = document.getElementById("checkout-btn");
    const loginRedirect = document.getElementById("login-redirect");
    const checkoutMessage = document.getElementById("checkout-message");

    // Only run this code if we're on the cart page
    if (!cartItemsContainer) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function updateCartDisplay() {
        cartItemsContainer.innerHTML = "";
        let total = 0;
    
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
            if (totalPriceElement) totalPriceElement.textContent = "₱0.00";
            localStorage.setItem("cartCount", "0");
            updateCartCount();
            return;
        }
    
        cart.forEach((item, index) => {
            // Check if price is a valid number and has a value
            const itemPrice = (item.price && !isNaN(item.price)) ? parseFloat(item.price) : 0;
            const itemTotal = itemPrice * item.quantity;
            total += itemTotal;
    
            const itemElement = document.createElement("div");
            itemElement.className = "cart-item";
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>₱${itemPrice.toFixed(2)} each</p>
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <button class="minus-btn" data-index="${index}">−</button>
                            <span>${item.quantity}</span>
                            <button class="plus-btn" data-index="${index}">+</button>
                        </div>
                        <button class="remove-btn" data-index="${index}">Remove</button>
                    </div>
                </div>
                <div>
                    <strong>₱${itemTotal.toFixed(2)}</strong>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    
        if (totalPriceElement) totalPriceElement.textContent = `₱${total.toFixed(2)}`;
        localStorage.setItem("cartCount", cart.reduce((sum, item) => sum + item.quantity, 0));
        updateCartCount();
    }

    // Add button functionality
    cartItemsContainer.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('plus-btn')) {
            const index = parseInt(target.dataset.index);
            cart[index].quantity += 1;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
        } else if (target.classList.contains('minus-btn')) {
            const index = parseInt(target.dataset.index);
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartDisplay();
            }
        } else if (target.classList.contains('remove-btn')) {
            const index = parseInt(target.dataset.index);
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
        }
    });

    // Handle checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
            
            if (!isLoggedIn) {
                if (checkoutMessage) checkoutMessage.textContent = 'Please log in to complete your purchase.';
                if (loginRedirect) loginRedirect.style.display = 'block';
                return;
            }
            
            // Process checkout
            alert('Thank you for your order!');
            // Clear cart after successful checkout
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            localStorage.setItem('cartCount', '0');
            updateCartDisplay();
            updateCartCount();
        });
    }

    // Initialize cart display
    updateCartDisplay();
});




// Add logout button to all pages when logged in
document.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";
    const email = localStorage.getItem("userEmail");

    if (isLoggedIn && email) {
        // Update user greeting if element exists
        const greetingElement = document.getElementById("user-greeting");
        if (greetingElement) greetingElement.innerHTML = `WELCOME, ${email}`;

        // Hide login button
        const loginButton = document.querySelector("a[href='LOGIN.html']");
        if (loginButton) loginButton.style.display = "none";
        
        // Add logout button to the navbar/header
        const navElement = document.querySelector("nav ul, .nav-links, header .auth-buttons, #nav");
        
        if (navElement) {
            // Check if logout button already exists to avoid duplicates
            const existingLogout = document.getElementById("logout-button");
            if (!existingLogout) {
                // Create the logout button
                const logoutItem = document.createElement("li");
                logoutItem.className = "nav-item";
                
                const logoutButton = document.createElement("a");
                logoutButton.id = "logout-button";
                logoutButton.href = "#";
                logoutButton.className = "btn btn-logout";
                logoutButton.textContent = "Logout";
                
                // Add logout functionality
                logoutButton.addEventListener("click", (e) => {
                    e.preventDefault();
                    localStorage.removeItem("userLoggedIn");
                    localStorage.removeItem("userEmail");
                    alert("You have been logged out successfully!");
                    window.location.reload();
                });
                
                logoutItem.appendChild(logoutButton);
                navElement.appendChild(logoutItem);
            }
        }
    }
    
    updateCartCount();
    showWelcomeMessage();
});

