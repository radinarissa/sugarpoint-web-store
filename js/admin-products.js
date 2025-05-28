document.addEventListener('DOMContentLoaded', function() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    
    if (!userInfo.token || !userInfo.isAdmin) {
        showNotification('Нямате достъп до админ панела', 'error');
        window.location.href = 'index.html';
        return;
    }
    
    const productsTableBody = document.getElementById('products-table-body');
    const addProductBtn = document.getElementById('add-product-btn');
    const productFormContainer = document.getElementById('product-form-container');
    const productForm = document.getElementById('product-form');
    const cancelProductBtn = document.getElementById('cancel-product-btn');
    
    const productIdField = document.getElementById('product-id');
    const productNameField = document.getElementById('product-name');
    const productPriceField = document.getElementById('product-price');
    const productImageField = document.getElementById('product-image');
    const productCategoryField = document.getElementById('product-category');
    const productDescriptionField = document.getElementById('product-description');
    const productFeaturedField = document.getElementById('product-featured');
    
    loadProducts();
    
    addProductBtn.addEventListener('click', function() { 
        resetForm();
        productFormContainer.style.display = 'block';
    });
    
    cancelProductBtn.addEventListener('click', function() {
        productFormContainer.style.display = 'none';
    });
    
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const productId = productIdField.value;
        const productData = {
            name: productNameField.value,
            price: Number(productPriceField.value),
            image: productImageField.value,
            category: productCategoryField.value,
            description: productDescriptionField.value,
            featured: productFeaturedField.checked
        };
        
        if (productId) {
            updateProduct(productId, productData);
        } else {
            createProduct(productData);
        }
    });
    
    async function loadProducts() {
        try {
            const products = await window.api.getProducts();
            
            productsTableBody.innerHTML = '';
            
            products.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><img src="images/${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'"></td>
                    <td>${product.name}</td>
                    <td>${product.price.toFixed(2)} лв</td>
                    <td>${getCategoryName(product.category)}</td>
                    <td>${product.featured ? 'Да' : 'Не'}</td>
                    <td class="table-actions">
                        <button class="edit-btn" data-id="${product._id}">Редактирай</button>
                        <button class="delete-btn" data-id="${product._id}">Изтрий</button>
                    </td>
                `;
                
                productsTableBody.appendChild(row);
                
                const editBtn = row.querySelector('.edit-btn');
                const deleteBtn = row.querySelector('.delete-btn');
                
                editBtn.addEventListener('click', function() {
                    editProduct(product._id);
                });
                
                deleteBtn.addEventListener('click', function() {
                    deleteProduct(product._id);
                });
            });
            
        } catch (error) {
            showNotification('Грешка при зареждане на продуктите: ' + error.message, 'error');
        }
    }
    
    async function createProduct(productData) {
        try {
            await window.api.createProduct(productData, userInfo.token);
            
            showNotification('Продуктът е създаден успешно!', 'success');
            
            productFormContainer.style.display = 'none';
            
            loadProducts();
        } catch (error) {
            showNotification('Грешка при създаване на продукт: ' + error.message, 'error');
        }
    }
    
    async function editProduct(productId) {
        try {
            const product = await window.api.getProductById(productId, userInfo.token);
            
            productIdField.value = product._id;
            productNameField.value = product.name;
            productPriceField.value = product.price;
            productImageField.value = product.image;
            productCategoryField.value = product.category;
            productDescriptionField.value = product.description;
            productFeaturedField.checked = product.featured;
            
            productFormContainer.style.display = 'block';
        } catch (error) {
            showNotification('Грешка при зареждане на продукт: ' + error.message, 'error');
        }
    }
    
    async function updateProduct(productId, productData) {
        try {
            await window.api.updateProduct(productId, productData, userInfo.token);
            
            showNotification('Продуктът е обновен успешно!', 'success');
            
            productFormContainer.style.display = 'none';
            
            loadProducts();
        } catch (error) {
            showNotification('Грешка при обновяване на продукт: ' + error.message, 'error');
        }
    }
    
    async function deleteProduct(productId) {
        if (!confirm('Сигурни ли сте, че искате да изтриете този продукт?')) {
            return;
        }
        
        try {
            await window.api.deleteProduct(productId, userInfo.token);
            
            showNotification('Продуктът е изтрит успешно!', 'success');
            
            loadProducts();
        } catch (error) {
            showNotification('Грешка при изтриване на продукт: ' + error.message, 'error');
        }
    }
    
    function resetForm() {
        productIdField.value = '';
        productNameField.value = '';
        productPriceField.value = '';
        productImageField.value = '';
        productCategoryField.value = 'croissant';
        productDescriptionField.value = '';
        productFeaturedField.checked = false;
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