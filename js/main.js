document.addEventListener('DOMContentLoaded', function() {
    console.log('Страницата е заредена успешно!');
    
    const products = [
        {
            id: 1,
            name: 'Кроасан с ванилия',
            category: 'croissant',
            price: 4.50,
            image: 'vanilla.png',
            description: 'Хрупкав кроасан, пълен с вкусен ванилов крем.',
            featured: true
        },
        {
            id: 2,
            name: 'Кроасан с шоколад',
            category: 'croissant',
            price: 4.80,
            image: 'chocolate.png',
            description: 'Класически кроасан с богата шоколадова плънка.',
            featured: true
        },
        {
            id: 3,
            name: 'Кроасан с шам фъстък',
            category: 'croissant',
            price: 5.20,
            image: 'pistachio.png',
            description: 'Деликатен кроасан с крем от шам фъстък и хрупкави парченца.',
            featured: false
        },
        {
            id: 4,
            name: 'Кроасан с масло',
            category: 'croissant',
            price: 3.80,
            image: 'butter.png',
            description: 'Традиционен френски кроасан с чисто масло и многослойно тесто.',
            featured: false
        },
        {
            id: 5,
            name: 'New York Roll с карамел',
            category: 'new_york_roll',
            price: 5.50,
            image: 'new_york_roll_caramel.png',
            description: 'Пухкав New York Roll с карамелена глазура и кремообразна плънка.',
            featured: true
        },
        {
            id: 6,
            name: 'New York Roll с шам фъстък',
            category: 'new_york_roll',
            price: 5.80,
            image: 'new_york_roll_pistachio.png',
            description: 'Вкусен New York Roll с плънка от шам фъстък и глазура.',
            featured: false
        }
    ];
    
    let cart = [];
    
    const currentPage = getCurrentPage();
    
    loadCart();
    
    initPageFeatures(currentPage);
    
    setupCartButton();
    
    function getCurrentPage() {
        const path = window.location.pathname;
        const pageName = path.split('/').pop();
        
        console.log('Текуща страница:', pageName);
        
        if (pageName === 'products.html') {
             return 'products';
        } else if (pageName === 'about.html') {
            return 'about';
        } else if (pageName === 'contact.html') {
            return 'contact';
        } else if (pageName === 'cart.html') {
            return 'cart';
        } else {
            return 'home';
        }
    }
    
    function initPageFeatures(page) {
        console.log('Инициализиране на функционалности за страница:', page);
        
        switch (page) {
            case 'home':
                loadFeaturedProducts();
                break;
                
            case 'products':
                loadAllProducts();
                setupFilterButtons();
                break;
                
            case 'contact':
                setupContactForm();
                break;
                
            case 'about':
                break;
            
            case 'cart':
                loadCartPage();
                break;
                
            default:
                console.log('Неразпозната страница');
                break;
        }
    }
    
    async function loadFeaturedProducts() {
    const featuredList = document.getElementById('featured-products-list');
    if (!featuredList) {
        console.log('Не е намерен контейнерът за акцентирани продукти');
        return;
    }
    
    try {
        const allProducts = await window.api.getProducts();
        
        featuredList.innerHTML = '';
        
        const featuredProducts = allProducts.filter(product => product.featured);
        
        featuredProducts.forEach(product => {
            const productCard = createProductCard(product);
            featuredList.appendChild(productCard);
        });
        
        console.log('Акцентираните продукти са заредени:', featuredProducts.length);
    } catch (error) {
        console.error('Грешка при зареждане на акцентирани продукти:', error);
        featuredList.innerHTML = '<p class="error">Грешка при зареждане на продукти. Моля, опитайте по-късно.</p>';
    }
}
    
    async function loadAllProducts() {
    const allProductsList = document.getElementById('all-products-list');
    
    if (!allProductsList) {
        console.log('Не е намерен контейнерът за всички продукти');
        return;
    }
    
    try {
        const products = await window.api.getProducts();
        
        allProductsList.innerHTML = '';
        
        products.forEach(product => {
            const productCard = createProductCard(product);
            allProductsList.appendChild(productCard);
        });
        
        console.log('Всички продукти са заредени:', products.length);
    } catch (error) {
        console.error('Грешка при зареждане на продукти:', error);
        allProductsList.innerHTML = '<p class="error">Грешка при зареждане на продукти. Моля, опитайте по-късно.</p>';
    }
}
    
    function setupFilterButtons() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const allProductsList = document.getElementById('all-products-list');
        
        if (filterButtons.length === 0 || !allProductsList) {
            return;
        }
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                filterProducts(filterValue);
            });
        });
    }
    
   function filterProducts(category) {
    const allProductsList = document.getElementById('all-products-list');
    
    if (!allProductsList) {
        return;
    }
    
    allProductsList.innerHTML = '';
    
    if (typeof apiProducts !== 'undefined' && apiProducts.length > 0) {
        displayFilteredProducts(apiProducts, category, allProductsList);
    } else {
        loadAndFilterProducts(category, allProductsList);
    }
}

function displayFilteredProducts(products, category, container) {
    let filteredProducts;
    if (category === 'all') {
        filteredProducts = products;
    } else {
        filteredProducts = products.filter(product => product.category === category);
    }
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product); 
        container.appendChild(productCard);
    });
}

async function loadAllProducts() {
    const allProductsList = document.getElementById('all-products-list');
    
    if (!allProductsList) {
        console.log('Не е намерен контейнерът за всички продукти');
        return;
    }
    
    try {
        const products = await window.api.getProducts();
        window.apiProducts = products;
        allProductsList.innerHTML = '';
        products.forEach(product => {
            const productCard = createProductCard(product);
            allProductsList.appendChild(productCard);
        });
        
        console.log('Всички продукти са заредени:', products.length);
    } catch (error) {
        console.error('Грешка при зареждане на продукти:', error);
        allProductsList.innerHTML = '<p class="error">Грешка при зареждане на продукти. Моля, опитайте по-късно.</p>';
    }
}
    
    function setupContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) {
            return;
        }
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = contactForm.querySelector('#name').value;
            const email = contactForm.querySelector('#email').value;
            const subject = contactForm.querySelector('#subject').value;
            const message = contactForm.querySelector('#message').value;
            
            if (!name || !email || !subject || !message) {
                showNotification('Моля, попълнете всички полета', 'error');
                return;
            }
            
            showNotification('Вашето съобщение беше изпратено успешно!', 'success');
            
            contactForm.reset();
        });
    }
    
    function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-category', product.category);
    
    const productId = product._id || product.id; 
    
    card.innerHTML = `
        <div class="product-image-container">
            <a href="product-detail.html?id=${productId}">
                <img src="images/${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'">
            </a>
        </div>
        <div class="product-info">
            <h4><a href="product-detail.html?id=${productId}">${product.name}</a></h4>
            <p class="description">${product.description}</p>
            <p class="price">${product.price.toFixed(2)} лв</p>
            <button class="add-to-cart">Добави в кошницата</button>
        </div>
    `;
    
    const button = card.querySelector('.add-to-cart');
    button.addEventListener('click', function() {
        addToCart(product);
    });
    
    return card;
}
    
    function addToCart(product) {
        if (product) {
        const existingItem = cart.find(item => item.id === product._id); 
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product._id, 
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        saveCart();
        updateCartUI();
        
        showNotification(`${product.name} добавен в кошницата!`, 'success');
    }
    }
    
    function saveCart() {
        localStorage.setItem('sugarpoint_cart', JSON.stringify(cart));
        
        if (getCurrentPage() === 'cart') {
            loadCartPage();
        }
    }
    
    function loadCart() {
        const savedCart = localStorage.getItem('sugarpoint_cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartUI();
        }
    }
    
    function showNotification(message, type = 'success') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            document.body.removeChild(existingNotification);
        }
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 500);
        }, 3000);
    }
    
    function updateCartUI() {
        const cartButton = document.querySelector('.shopping-cart');
        
        if (cartButton) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            
            cartButton.innerHTML = `Кошница (${totalItems})`;
            
            if (totalItems > 0) {
                cartButton.classList.add('has-items');
            } else {
                cartButton.classList.remove('has-items');
            }
        }
        
        if (getCurrentPage() === 'cart') {
            loadCartPage();
        }
    }
    
    function setupCartButton() {
        const cartButton = document.querySelector('.shopping-cart');
        
        if (cartButton) {
            updateCartUI();
        }
    }
     
    function loadCartPage() {
        console.log('Зареждане на страницата на кошницата');
    
    if (getCurrentPage() !== 'cart') {
        return;
    }
    
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const totalElement = document.getElementById('total');
    
    if (!cartItemsContainer) {
        console.error('Не намерих контейнера за елементи в кошницата!');
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        if (emptyCartMessage) {
            emptyCartMessage.style.display = 'block';
        }
        
        if (subtotalElement) subtotalElement.textContent = '0.00 лв';
        if (shippingElement) shippingElement.textContent = '3.00 лв';
        if (totalElement) totalElement.textContent = '3.00 лв';
        return;
    }
    
    if (emptyCartMessage) {
        emptyCartMessage.style.display = 'none';
    }
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="images/${item.image}" alt="${item.name}" onerror="this.src='images/placeholder.jpg'">
            </div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p class="price">${item.price.toFixed(2)} лв × ${item.quantity}</p>
            </div>
            <div class="cart-item-actions">
                <button class="decrease-quantity" data-id="${item.id}">−</button>
                <span class="quantity">${item.quantity}</span>
                <button class="increase-quantity" data-id="${item.id}">+</button>
                <button class="remove-item" data-id="${item.id}">×</button>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
        
        const decreaseButton = cartItem.querySelector('.decrease-quantity');
        const increaseButton = cartItem.querySelector('.increase-quantity');
        const removeButton = cartItem.querySelector('.remove-item');
        
        decreaseButton.addEventListener('click', () => decreaseQuantity(item.id));
        increaseButton.addEventListener('click', () => increaseQuantity(item.id));
        removeButton.addEventListener('click', () => removeFromCart(item.id));
    });
    
    const shipping = 3.00;
    const total = subtotal + shipping;
    
    if (subtotalElement) {
        subtotalElement.textContent = subtotal.toFixed(2) + ' лв';
    }
    
    if (shippingElement) {
        shippingElement.textContent = shipping.toFixed(2) + ' лв';
    }
    
    if (totalElement) {
        totalElement.textContent = total.toFixed(2) + ' лв';
    }
    
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
    
    const applyPromoBtn = document.getElementById('apply-promo');
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', applyPromoCode);
    }
}
    
    function increaseQuantity(productId) {
        const item = cart.find(item => item.id === productId);
        
        if (item) {
            item.quantity += 1;
            saveCart();
            updateCartUI();
        }
    }
    function decreaseQuantity(productId) {
    console.log('Намаляване на количеството за продукт:', productId);
    
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        if (item.quantity > 1) {
            console.log('Намаляване от', item.quantity, 'на', item.quantity - 1);
            item.quantity -= 1;
            saveCart();
            updateCartUI();
        } else {
            removeFromCart(productId);
        }
    } else {
        console.error('Не е намерен продукт с ID:', productId);
    }
}
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        
        saveCart();
        updateCartUI();
        
        showNotification('Продуктът е премахнат от кошницата', 'info');
    }
    
    function checkout() {
        
        if (cart.length === 0) {
        showNotification('Вашата кошница е празна', 'error');
        return;
        }
    
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    
        if (!userInfo.token) {
            showNotification('Трябва да влезете в профила си, за да направите поръчка', 'error');
            window.location.href = 'login.html';
            return;
        }
        
        window.location.href = 'checkout.html';
    }
    
    function applyPromoCode() {
        const promoInput = document.getElementById('promo-input');
        
        if (!promoInput || !promoInput.value) {
            showNotification('Моля, въведете промо код', 'error');
            return;
        }
        
        const promoCode = promoInput.value.trim().toUpperCase();
        let discount = 0;
        
        if (promoCode === 'WELCOME10') {
            discount = 0.1; 
        } else if (promoCode === 'SUMMER20') {
            discount = 0.2; 
        } else {
            showNotification('Невалиден промо код', 'error');
            return;
        }
        
        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
        });
        
        const discountAmount = subtotal * discount;
        const newSubtotal = subtotal - discountAmount;
        const shipping = 3.00;
        const total = newSubtotal + shipping;
        
        const subtotalElement = document.getElementById('subtotal');
        const totalElement = document.getElementById('total');
        
        if (subtotalElement) {
            subtotalElement.innerHTML = `${newSubtotal.toFixed(2)} лв <span class="discount">(-${discountAmount.toFixed(2)} лв)</span>`;
        }
        if (totalElement) {
            totalElement.textContent = total.toFixed(2) + ' лв';
        }
        
        showNotification(`Промо код приложен! Спестихте ${discountAmount.toFixed(2)} лв`, 'success');
    }
});