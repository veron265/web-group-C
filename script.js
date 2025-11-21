// Sample product data array/
const products = [
    { id: 1, name: "Floral Summer Dress", price: 85000, gender: "women", image: "images/floral.webp", category: "Dresses", onSale: true },
    { id: 2, name: "Classic White Shirt", price: 45000, gender: "men", image: "images/shirt.jpg", category: "Shirts", onSale: false },
    { id: 3, name: "Denim Jacket", price: 120000, gender: "unisex", image: "images/denim.jpg", category: "Jackets", onSale: true },
    { id: 4, name: "Running Sneakers", price: 150000, gender: "unisex", image: "images/sneaker.jpg", category: "Shoes", onSale: false },
    { id: 5, name: "Elegant Evening Gown", price: 250000, gender: "women", image: "images/shirt.jpg", category: "Dresses", onSale: true },
    { id: 6, name: "Casual T-Shirt", price: 30000, gender: "men", image: "images/shirt.jpg", category: "Tops", onSale: false },
    { id: 7, name: "Leather Handbag", price: 180000, gender: "women", image: "images/shirt.jpg", category: "Accessories", onSale: true },
    { id: 8, name: "Formal Trousers", price: 75000, gender: "men", image: "images/shirt.jpg", category: "Bottoms", onSale: false },
    { id: 9, name: "Knit Sweater", price: 95000, gender: "unisex", image: "images/shirt.jpg", category: "Tops", onSale: true },
    { id: 10, name: "Sports Shorts", price: 35000, gender: "unisex", image: "images/shirt.jpg", category: "Bottoms", onSale: false },
    { id: 11, name: "Designer Sunglasses", price: 65000, gender: "unisex", image: "images/shirt.jpg", category: "Accessories", onSale: true },
    { id: 12, name: "Winter Coat", price: 200000, gender: "women", image: "images/shirt.jpg", category: "Outerwear", onSale: false }
];

// Shopping cart and wishlist
let cart = [];
let wishlist = [];
let currentPage = 1;
const productsPerPage = 6;
let filteredProducts = [...products];

// Format price in UGX
function formatPrice(price) {
    return `UGX ${price.toLocaleString()}`;
}

// Render products
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    if (productsToShow.length === 0) {
        productsGrid.innerHTML = '<div class="col-12 text-center"><p>No products found matching your criteria.</p></div>';
        return;
    }
    
    productsToShow.forEach(product => {
        const isInWishlist = wishlist.some(item => item.id === product.id);
        
        const productCard = `
            <div class="col-md-6 col-lg-4">
                <div class="card">
                    ${product.onSale ? '<div class="flash-sale">FLASH SALE</div>' : ''}
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text text-muted">${product.category}</p>
                        <p class="price">${formatPrice(product.price)}</p>
                        <div class="product-actions">
                            <button class="btn btn-pink btn-sm add-to-cart" data-id="${product.id}">
                                <i class="fas fa-shopping-cart me-1"></i> Add to Cart
                            </button>
                            <button class="btn btn-outline-secondary btn-sm wishlist-btn ${isInWishlist ? 'active' : ''}" data-id="${product.id}">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        productsGrid.innerHTML += productCard;
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
    
    document.querySelectorAll('.wishlist-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            toggleWishlist(productId);
        });
    });
    
    renderPagination();
}

// Render pagination
function renderPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    if (totalPages <= 1) return;
    
    // Previous button
    const prevButton = `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
        </li>
    `;
    pagination.innerHTML += prevButton;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageItem = `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
        pagination.innerHTML += pageItem;
    }
    
    // Next button
    const nextButton = `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
        </li>
    `;
    pagination.innerHTML += nextButton;
    
    // Add event listeners to pagination links
    document.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = parseInt(this.getAttribute('data-page'));
            if (page && page !== currentPage) {
                currentPage = page;
                renderProducts();
            }
        });
    });
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
}

// Toggle wishlist
function toggleWishlist(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingIndex = wishlist.findIndex(item => item.id === productId);
    
    if (existingIndex !== -1) {
        wishlist.splice(existingIndex, 1);
        showNotification(`${product.name} removed from wishlist`);
    } else {
        wishlist.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image
        });
        showNotification(`${product.name} added to wishlist!`);
    }
    
    updateWishlistCount();
    renderProducts();
}

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Update wishlist count
function updateWishlistCount() {
    const wishlistCount = document.getElementById('wishlistCount');
    wishlistCount.textContent = wishlist.length;
}

// Show notification
function showNotification(message) {
    const toast = document.createElement('div');
    toast.className = 'position-fixed bottom-0 end-0 p-3';
    toast.style.zIndex = '11';
    
    toast.innerHTML = `
        <div class="toast show" role="alert">
            <div class="toast-header">
                <strong class="me-auto">FashionHub</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        document.body.removeChild(toast);
    }, 3000);
}

// Apply filters
function applyFilters() {
    const genderFilters = [];
    if (document.getElementById('filterWomen').checked) genderFilters.push('women');
    if (document.getElementById('filterMen').checked) genderFilters.push('men');
    if (document.getElementById('filterUnisex').checked) genderFilters.push('unisex');
    
    const minPrice = parseInt(document.getElementById('priceMin').value);
    const maxPrice = parseInt(document.getElementById('priceMax').value);
    
    filteredProducts = products.filter(product => {
        const genderMatch = genderFilters.includes(product.gender);
        const priceMatch = product.price >= minPrice && product.price <= maxPrice;
        return genderMatch && priceMatch;
    });
    
    // Apply search filter if there's a search term
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply sorting
    const sortValue = document.getElementById('sortSelect').value;
    if (sortValue === 'price-low') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price-high') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortValue === 'name') {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    currentPage = 1;
    renderProducts();
}

// Render cart items in modal
function renderCartItems() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center">Your cart is empty</p>';
        document.getElementById('cartTotal').textContent = 'UGX 0';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = `
            <div class="checkout-item d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover;" class="me-3">
                    <div>
                        <h6 class="mb-0">${item.name}</h6>
                        <small class="text-muted">${formatPrice(item.price)}</small>
                    </div>
                </div>
                <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-outline-secondary decrease-quantity" data-id="${item.id}">-</button>
                    <span class="mx-2">${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-secondary increase-quantity" data-id="${item.id}">+</button>
                    <button class="btn btn-sm btn-outline-danger ms-2 remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="text-end">
                    <strong>${formatPrice(itemTotal)}</strong>
                </div>
            </div>
        `;
        cartItems.innerHTML += cartItem;
    });
    
    document.getElementById('cartTotal').textContent = formatPrice(total);
    
    // Add event listeners to cart buttons
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const item = cart.find(item => item.id === productId);
            if (item) {
                item.quantity += 1;
                renderCartItems();
                updateCartCount();
            }
        });
    });
    
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const itemIndex = cart.findIndex(item => item.id === productId);
            if (itemIndex !== -1) {
                if (cart[itemIndex].quantity > 1) {
                    cart[itemIndex].quantity -= 1;
                } else {
                    cart.splice(itemIndex, 1);
                }
                renderCartItems();
                updateCartCount();
            }
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const itemIndex = cart.findIndex(item => item.id === productId);
            if (itemIndex !== -1) {
                cart.splice(itemIndex, 1);
                renderCartItems();
                updateCartCount();
            }
        });
    });
}

// Render checkout items
function renderCheckoutItems() {
    const checkoutItems = document.getElementById('checkoutItems');
    checkoutItems.innerHTML = '';
    
    if (cart.length === 0) {
        checkoutItems.innerHTML = '<p class="text-center">Your cart is empty</p>';
        document.getElementById('checkoutTotal').textContent = 'UGX 0';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const checkoutItem = `
            <div class="d-flex justify-content-between mb-2">
                <div>
                    <span>${item.name}</span>
                    <small class="text-muted d-block">Qty: ${item.quantity}</small>
                </div>
                <div>${formatPrice(itemTotal)}</div>
            </div>
        `;
        checkoutItems.innerHTML += checkoutItem;
    });
    
    document.getElementById('checkoutTotal').textContent = formatPrice(total);
}

// Initialize the page
function init() {
    renderProducts();
    updateCartCount();
    updateWishlistCount();
    
    // Set up event listeners
    document.getElementById('applyFilters').addEventListener('click', applyFilters);
    document.getElementById('searchBtn').addEventListener('click', applyFilters);
    document.getElementById('searchInput').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            applyFilters();
        }
    });
    document.getElementById('sortSelect').addEventListener('change', applyFilters);
    
    // Price range sliders
    document.getElementById('priceMin').addEventListener('input', function() {
        document.getElementById('priceMinValue').textContent = formatPrice(parseInt(this.value));
    });
    
    document.getElementById('priceMax').addEventListener('input', function() {
        document.getElementById('priceMaxValue').textContent = formatPrice(parseInt(this.value));
    });
    
    // Cart modal
    document.getElementById('cartModal').addEventListener('show.bs.modal', function() {
        renderCartItems();
    });
    
    // Checkout button
    document.getElementById('checkoutBtn').addEventListener('click', function() {
        if (cart.length === 0) {
            showNotification('Your cart is empty!');
            return;
        }
        
        const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
        cartModal.hide();
        
        renderCheckoutItems();
        const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
        checkoutModal.show();
    });
    
    // Place order button
    document.getElementById('placeOrderBtn').addEventListener('click', function() {
        showNotification('Order placed successfully! Thank you for shopping with us.');
        cart = [];
        updateCartCount();
        
        const checkoutModal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
        checkoutModal.hide();
    });
    
    // Countdown timer for flash sale
    let countdownTime = 24 * 60 * 60;
    const countdownElement = document.getElementById('countdown');
    
    function updateCountdown() {
        const hours = Math.floor(countdownTime / 3600);
        const minutes = Math.floor((countdownTime % 3600) / 60);
        const seconds = countdownTime % 60;
        
        countdownElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (countdownTime > 0) {
            countdownTime--;
        } else {
            clearInterval(countdownInterval);
        }
    }
    
    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();
}


document.addEventListener('DOMContentLoaded', init);