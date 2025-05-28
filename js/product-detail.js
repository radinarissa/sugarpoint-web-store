document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (!productId) {
        showNotification('Невалиден продукт', 'error');
        window.location.href = 'products.html';
        return;
    }
    const productImage = document.getElementById('product-image');
    const productName = document.getElementById('product-name');
    const productCategory = document.getElementById('product-category');
    const productPrice = document.getElementById('product-price');
    const productDescription = document.getElementById('product-description');
    const productIngredients = document.getElementById('product-ingredients');
    const breadcrumbProductName = document.getElementById('breadcrumb-product-name');
    
    const quantityInput = document.getElementById('quantity-input');
    const decreaseQuantityBtn = document.getElementById('decrease-quantity');
    const increaseQuantityBtn = document.getElementById('increase-quantity');
    const addToCartBtn = document.getElementById('add-to-cart-btn');

    let currentProduct = null;
    
    loadProduct(productId);
    
    decreaseQuantityBtn.addEventListener('click', function() {
        let quantity = parseInt(quantityInput.value);
        if (quantity > 1) {
            quantityInput.value = quantity - 1;
        }
    });
    
    increaseQuantityBtn.addEventListener('click', function() {
        let quantity = parseInt(quantityInput.value);
        if (quantity < 10) {
            quantityInput.value = quantity + 1;
        }
    });
    addToCartBtn.addEventListener('click', function() {
        if (currentProduct) {
            const quantity = parseInt(quantityInput.value);
            addToCartMultiple(currentProduct, quantity);
        }
    });
    
    async function loadProduct(productId) {
        try {
            showLoadingState();
            
            const products = await window.api.getProducts();
            const product = products.find(p => p._id === productId);
            
            if (!product) {
                showNotification('Продуктът не е намерен', 'error');
                window.location.href = 'products.html';
                return;
            }
            currentProduct = product;
            populateProductData(product);
            
        } catch (error) {
            console.error('Грешка при зареждане на продукт:', error);
            showNotification('Грешка при зареждане на продукт: ' + error.message, 'error');
            window.location.href = 'products.html';
        }
    }

    function populateProductData(product) {
        productName.textContent = product.name;
        productCategory.textContent = getCategoryName(product.category);
        productPrice.textContent = product.price.toFixed(2);
        productDescription.textContent = product.description;
        if (product.ingredients && product.ingredients.trim()) {
            productIngredients.textContent = product.ingredients;
        } else {
            productIngredients.textContent = 'Информацията за състава ще бъде добавена скоро.';
        }
        productImage.src = `images/${product.image}`;
        productImage.alt = product.name;
        breadcrumbProductName.textContent = product.name;
        document.title = `${product.name} - Sugarpoint`;
        hideLoadingState();
    }
    
    function showLoadingState() {
        productName.textContent = 'Зареждане...';
        productCategory.textContent = '';
        productPrice.textContent = '0.00';
        productDescription.textContent = 'Зареждане на описанието...';
        productIngredients.textContent = 'Зареждане на състава...';
        addToCartBtn.disabled = true;
        addToCartBtn.textContent = 'Зареждане...';
    }
    
    function hideLoadingState() {
        addToCartBtn.disabled = false;
        addToCartBtn.textContent = 'Добави в кошницата';
    }
    function addToCartMultiple(product, quantity) {
        if (!product || quantity < 1) {
            return;
        }
        
        let cart = JSON.parse(localStorage.getItem('sugarpoint_cart') || '[]');
        
        const productId = product._id || product.id;
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }
        localStorage.setItem('sugarpoint_cart', JSON.stringify(cart));
        
        if (typeof updateCartUI === 'function') {
            updateCartUI();
        }
        
        const message = quantity === 1 
            ? `${product.name} добавен в кошницата!`
            : `${quantity} бр. ${product.name} добавени в кошницата!`;
        
        showNotification(message, 'success');
        quantityInput.value = 1;
    }
    
    function getCategoryName(category) {
        const categories = {
            'croissant': 'Кроасан',
            'new_york_roll': 'New York Roll'
        };
        
        return categories[category] || category;
    }
    
    function showNotification(message, type = 'success') {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
            return;
        }
        
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
            const cart = JSON.parse(localStorage.getItem('sugarpoint_cart') || '[]');
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            
            cartButton.innerHTML = `Кошница (${totalItems})`;
            
            if (totalItems > 0) {
                cartButton.classList.add('has-items');
            } else {
                cartButton.classList.remove('has-items');
            }
        }
    }
});