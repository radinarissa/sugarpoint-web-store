document.addEventListener('DOMContentLoaded', function() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    
    if (!userInfo.token || !userInfo.isAdmin) {
        showNotification('Нямате достъп до админ панела', 'error');
        window.location.href = 'index.html';
        return;
    }
    
    const usersTableBody = document.getElementById('users-table-body');
    const userFormContainer = document.getElementById('user-form-container');
    const userForm = document.getElementById('user-form');
    const cancelUserBtn = document.getElementById('cancel-user-btn');
    
    const userIdField = document.getElementById('user-id');
    const userNameField = document.getElementById('user-name');
    const userEmailField = document.getElementById('user-email');
    const userPasswordField = document.getElementById('user-password');
    const userIsAdminField = document.getElementById('user-isAdmin');
    
    loadUsers();
    
    cancelUserBtn.addEventListener('click', function() {
        userFormContainer.style.display = 'none';
    });
    
    userForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const userId = userIdField.value;
        const userData = {
            name: userNameField.value,
            email: userEmailField.value,
            isAdmin: userIsAdminField.checked
        };
        
        if (userPasswordField.value) {
            userData.password = userPasswordField.value;
        }
        updateUser(userId, userData);
    });

    async function loadUsers() {
        try {
            const users = await window.api.getUsers(userInfo.token);
            usersTableBody.innerHTML = '';
            
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user._id.substring(0, 8)}...</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.isAdmin ? 'Да' : 'Не'}</td>
                    <td>${formatDate(user.createdAt)}</td>
                    <td class="table-actions">
                        <button class="edit-btn" data-id="${user._id}">Редактирай</button>
                        <button class="delete-btn" data-id="${user._id}">Изтрий</button>
                    </td>
                `;
                
                usersTableBody.appendChild(row);
                
                const editBtn = row.querySelector('.edit-btn');
                const deleteBtn = row.querySelector('.delete-btn');
                
                editBtn.addEventListener('click', function() {
                    editUser(user._id);
                });
                
                deleteBtn.addEventListener('click', function() {
                    deleteUser(user._id);
                });
            });
            
        } catch (error) {
            showNotification('Грешка при зареждане на потребителите: ' + error.message, 'error');
        }
    }
    
    async function editUser(userId) {
        try {
            const user = await window.api.getUserById(userId, userInfo.token);
            
            userIdField.value = user._id;
            userNameField.value = user.name;
            userEmailField.value = user.email;
            userPasswordField.value = ''; 
            userIsAdminField.checked = user.isAdmin;
            
            userFormContainer.style.display = 'block';
        } catch (error) {
            showNotification('Грешка при зареждане на потребител: ' + error.message, 'error');
        }
    }
    
    async function updateUser(userId, userData) {
        try {
            await window.api.updateUser(userId, userData, userInfo.token);
            
            showNotification('Потребителят е обновен успешно!', 'success');
            userFormContainer.style.display = 'none';
            loadUsers();
        } catch (error) {
            showNotification('Грешка при обновяване на потребител: ' + error.message, 'error');
        }
    }
    
    async function deleteUser(userId) {
        if (userId === userInfo._id) {
            showNotification('Не можете да изтриете собствения си профил!', 'error');
            return;
        }
        
        if (!confirm('Сигурни ли сте, че искате да изтриете този потребител?')) {
            return;
        }
        
        try {
            await window.api.deleteUser(userId, userInfo.token);
            
            showNotification('Потребителят е изтрит успешно!', 'success');
            loadUsers();
        } catch (error) {
            showNotification('Грешка при изтриване на потребител: ' + error.message, 'error');
        }
    }
    
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('bg-BG', options);
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