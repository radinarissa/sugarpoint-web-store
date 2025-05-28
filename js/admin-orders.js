document.addEventListener('DOMContentLoaded', function() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    
    if (!userInfo.token || !userInfo.isAdmin) {
        showNotification('Нямате достъп до админ панела', 'error');
        window.location.href = 'index.html';
        return;
    }
    
    const ordersTableBody = document.getElementById('orders-table-body');
    const orderDetailsContainer = document.getElementById('order-details-container');
    const orderIdDisplay = document.getElementById('order-id-display');
    const orderDate = document.getElementById('order-date');
    const orderTotal = document.getElementById('order-total');
    const orderPaymentMethod = document.getElementById('order-payment-method');
    const orderPaymentStatus = document.getElementById('order-payment-status');
    const orderDeliveryStatus = document.getElementById('order-delivery-status');
    const orderAddress = document.getElementById('order-address');
    const orderCity = document.getElementById('order-city');
    const orderPostalCode = document.getElementById('order-postal-code');
    const orderCountry = document.getElementById('order-country');
    const orderItemsBody = document.getElementById('order-items-body');
    const markAsPaidBtn = document.getElementById('mark-as-paid-btn');
    const markAsDeliveredBtn = document.getElementById('mark-as-delivered-btn');
    const closeOrderDetailsBtn = document.getElementById('close-order-details-btn');
    
    let currentOrder = null;
    
    loadOrders();
    
    closeOrderDetailsBtn.addEventListener('click', function() {
        orderDetailsContainer.style.display = 'none';
    });
    
    markAsPaidBtn.addEventListener('click', function() {
        if (currentOrder) {
            markOrderAsPaid(currentOrder._id);
        }
    });
    
    markAsDeliveredBtn.addEventListener('click', function() {
        if (currentOrder) {
            markOrderAsDelivered(currentOrder._id);
        }
    });
    
    async function loadOrders() {
        try {
            const orders = await window.api.getOrders(userInfo.token);
            ordersTableBody.innerHTML = '';
            
            orders.forEach(order => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${order._id.substring(0, 8)}...</td>
                    <td>${order.user ? order.user.name : 'Неизвестен'}</td>
                    <td>${formatDate(order.createdAt)}</td>
                    <td>${order.totalPrice.toFixed(2)} лв</td>
                    <td>${order.isPaid ? 'Да' : 'Не'}</td>
                    <td>${order.isDelivered ? 'Да' : 'Не'}</td>
                    <td class="table-actions">
                        <button class="view-btn" data-id="${order._id}">Детайли</button>
                    </td>
                `;
                
                ordersTableBody.appendChild(row);
                
                const viewBtn = row.querySelector('.view-btn');
                
                viewBtn.addEventListener('click', function() {
                    viewOrderDetails(order._id);
                });
            });
            
        } catch (error) {
            showNotification('Грешка при зареждане на поръчките: ' + error.message, 'error');
        }
    }
    
    
    async function viewOrderDetails(orderId) {
        try {
            const order = await window.api.getOrderById(orderId, userInfo.token);
            
            currentOrder = order;
            
           
            orderIdDisplay.textContent = order._id;
            orderDate.textContent = formatDate(order.createdAt);
            orderTotal.textContent = order.totalPrice.toFixed(2) + ' лв';
            orderPaymentMethod.textContent = getPaymentMethodName(order.paymentMethod);
            orderPaymentStatus.textContent = order.isPaid ? 'Платена' : 'Неплатена';
            orderDeliveryStatus.textContent = order.isDelivered ? 'Доставена' : 'Недоставена';
            
            orderAddress.textContent = order.shippingAddress.address;
            orderCity.textContent = order.shippingAddress.city;
            orderPostalCode.textContent = order.shippingAddress.postalCode;
            orderCountry.textContent = order.shippingAddress.country;
            
            orderItemsBody.innerHTML = '';
            
            order.orderItems.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price.toFixed(2)} лв</td>
                    <td>${(item.price * item.quantity).toFixed(2)} лв</td>
                `;
                
                orderItemsBody.appendChild(row);
            });
            
            markAsPaidBtn.style.display = order.isPaid ? 'none' : 'inline-block';
            markAsDeliveredBtn.style.display = order.isDelivered ? 'none' : 'inline-block';
            
            orderDetailsContainer.style.display = 'block';
            
        } catch (error) {
            showNotification('Грешка при зареждане на детайли за поръчка: ' + error.message, 'error');
        }
    }
    
    async function markOrderAsPaid(orderId) {
        try {
            await window.api.updateOrderToPaid(orderId, userInfo.token);
            
            showNotification('Поръчката е маркирана като платена!', 'success');

            viewOrderDetails(orderId);
            loadOrders();
        } catch (error) {
            showNotification('Грешка при маркиране на поръчка като платена: ' + error.message, 'error');
        }
    }
    
    async function markOrderAsDelivered(orderId) {
        try {
            await window.api.updateOrderToDelivered(orderId, userInfo.token);
            
            showNotification('Поръчката е маркирана като доставена!', 'success');
            
            viewOrderDetails(orderId);
            loadOrders();
        } catch (error) {
            showNotification('Грешка при маркиране на поръчка като доставена: ' + error.message, 'error');
        }
    }
    
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('bg-BG', options);
    }
    
    function getPaymentMethodName(method) {
        const methods = {
            'cash': 'Наложен платеж',
            'card': 'Кредитна/Дебитна карта'
        };
        
        return methods[method] || method;
    }
    
    function showNotification(message, type = 'success') {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
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
    }
});