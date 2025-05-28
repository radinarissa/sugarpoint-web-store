document.addEventListener('DOMContentLoaded', function() {
    if (window.api) {
        window.api.registerUser = async function(userData) {
            try {
                const response = await fetch(`${window.api.API_URL}/users`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Грешка при регистрация');
                }
                
                return await response.json();
            } catch (error) {
                console.error('Грешка при регистрация:', error);
                throw error;
            }
        };

        window.api.loginUser = async function(email, password) {
            try {
                const response = await fetch(`${window.api.API_URL}/users/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Грешка при вход');
                }
                
                return await response.json();
            } catch (error) {
                console.error('Грешка при вход:', error);
                throw error;
            }
        };
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (password !== confirmPassword) {
                showNotification('Паролите не съвпадат', 'error');
                return;
            }
            
            try {
                const data = await window.api.registerUser({ name, email, password });
                localStorage.setItem('userInfo', JSON.stringify(data));
                showNotification('Регистрацията е успешна!', 'success');
                window.location.href = 'index.html';
            } catch (error) {
                showNotification('Грешка при регистрация: ' + error.message, 'error');
            }
        });
    }
    
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                const data = await window.api.loginUser(email, password);
                localStorage.setItem('userInfo', JSON.stringify(data));
                showNotification('Входът е успешен!', 'success');
                window.location.href = 'index.html';
            } catch (error) {
                showNotification('Грешка при вход: ' + error.message, 'error');
            }
        });
    }
    
    function updateUserUI() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userNavElement = document.getElementById('user-nav');
    
    if (userNavElement) {
        if (userInfo.token) {
            let adminLink = '';
            
            if (userInfo.isAdmin) {
                adminLink = '<li><a href="admin.html">Админ панел</a></li>';
            }
            
            userNavElement.innerHTML = `
                <li><span>Здравей, ${userInfo.name}</span></li>
                ${adminLink}
                <li><a href="#" id="logout-link">Изход</a></li>
            `;
            
            const logoutLink = document.getElementById('logout-link');
            if (logoutLink) {
                logoutLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    localStorage.removeItem('userInfo');
                    showNotification('Излязохте успешно', 'success');
                    window.location.reload();
                });
            }
        } else {
            userNavElement.innerHTML = `
                <li><a href="login.html" ${window.location.pathname.includes('login.html') ? 'class="active"' : ''}>Вход</a></li>
                <li><a href="register.html" ${window.location.pathname.includes('register.html') ? 'class="active"' : ''}>Регистрация</a></li>
            `;
        }
    }
}
    
    if (typeof showNotification !== 'function') {
        window.showNotification = function(message, type = 'success') {
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
        };
    }
    updateUserUI();
});