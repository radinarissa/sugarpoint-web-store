document.addEventListener('DOMContentLoaded', function() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    
    if (!userInfo.token) {
        showNotification('Трябва да влезете в профила си, за да направите поръчка', 'error');
        window.location.href = 'login.html';
        return;
    }
    
    const cart = JSON.parse(localStorage.getItem('sugarpoint_cart') || '[]');
    
    if (cart.length === 0) {
        showNotification('Вашата кошница е празна', 'error');
        window.location.href = 'cart.html';
        return;
    }
    
    loadOrderSummary(cart);
    
    const checkoutForm = document.getElementById('checkout-form');
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const address = document.getElementById('address').value;
            const city = document.getElementById('city').value;
            const postalCode = document.getElementById('postalCode').value;
            const country = document.getElementById('country').value;
            const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
            
            let totalPrice = 0;
            const orderItems = cart.map(item => {
                const itemTotal = item.price * item.quantity;
                totalPrice += itemTotal;
                
                return {
                    name: item.name,
                    quantity: item.quantity,
                    image: item.image,
                    price: item.price,
                    product: item.id
                };
            });
            
            const shipping = 5.00;
            totalPrice += shipping;
            
            const orderData = {
                orderItems,
                shippingAddress: {
                    address,
                    city,
                    postalCode,
                    country
                },
                paymentMethod,
                totalPrice
            };
            
            createOrder(orderData, userInfo.token);
        });
    }
    
    function loadOrderSummary(cart) {
        const orderItemsContainer = document.getElementById('order-items');
        const subtotalElement = document.getElementById('checkout-subtotal');
        const shippingElement = document.getElementById('checkout-shipping');
        const totalElement = document.getElementById('checkout-total');
        
        if (!orderItemsContainer) return;
        
        orderItemsContainer.innerHTML = '';
        
        let subtotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <div class="order-item-name">${item.name} × ${item.quantity}</div>
                <div class="order-item-price">${itemTotal.toFixed(2)} лв</div>
            `;
            
            orderItemsContainer.appendChild(orderItem);
        });
        
        const shipping = 5.00;
        const total = subtotal + shipping;
        
        if (subtotalElement) subtotalElement.textContent = subtotal.toFixed(2) + ' лв';
        if (shippingElement) shippingElement.textContent = shipping.toFixed(2) + ' лв';
        if (totalElement) totalElement.textContent = total.toFixed(2) + ' лв';
    }
    
    async function createOrder(orderData, token) {
        try {
            const response = await window.api.createOrder(orderData, token);
            
            localStorage.removeItem('sugarpoint_cart');
            
            showNotification('Поръчката е приета успешно!', 'success');
            
            window.location.href = `order-success.html?order=${response._id}`;
        } catch (error) {
            showNotification('Грешка при създаване на поръчка: ' + error.message, 'error');
        }
    }
});