document.addEventListener('DOMContentLoaded', function() {
     checkAdmin();
    
    function checkAdmin() {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        
        if (!userInfo.token) {
            showNotification('Трябва да влезете в профила си, за да достъпите админ панела', 'error');
            window.location.href = 'login.html';
            return;
        }
        
        if (!userInfo.isAdmin) {
            showNotification('Нямате достъп до админ панела', 'error');
            window.location.href = 'index.html';
            return;
        }
        
        showAdminContent();
    }
    
    function showAdminContent() {
        console.log('Админ панелът е зареден');
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
});