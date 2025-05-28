const API_URL = 'http://localhost:5000/api';

async function getProducts() {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error('Грешка при извличане на продукти');
    }
    return await response.json();
  } catch (error) {
    console.error('Грешка:', error);
    throw error;
  }
}

async function registerUser(userData) {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error('Грешка при регистрация');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Грешка:', error);
    throw error;
  }
}

async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      throw new Error('Грешка при вход');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Грешка:', error);
    throw error;
  }
}

async function createOrder(orderData, token) {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
      throw new Error('Грешка при създаване на поръчка');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Грешка:', error);
    throw error;
  }
}
async function getProductById(id, token) {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Грешка при извличане на продукт');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Грешка:', error);
    throw error;
  }
}

async function createProduct(productData, token) {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    
    if (!response.ok) {
      throw new Error('Грешка при създаване на продукт');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Грешка:', error);
    throw error;
  }
}

async function updateProduct(id, productData, token) {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    
    if (!response.ok) {
      throw new Error('Грешка при обновяване на продукт');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Грешка:', error);
    throw error;
  }
}

async function deleteProduct(id, token) {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Грешка при изтриване на продукт');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Грешка:', error);
    throw error;
  }
}

async function getOrders(token) {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Грешка при извличане на поръчки');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Грешка:', error);
    throw error;
  }
}

async function getOrderById(id, token) {
  try {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Грешка при извличане на поръчка');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Грешка:', error);
    throw error;
  }
}

async function updateOrderToPaid(id, token) {
  try {
    const response = await fetch(`${API_URL}/orders/${id}/pay`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Грешка при маркиране на поръчка като платена');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Грешка:', error);
    throw error;
  }
}

async function updateOrderToDelivered(id, token) {
  try {
    const response = await fetch(`${API_URL}/orders/${id}/deliver`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Грешка при маркиране на поръчка като доставена');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Грешка:', error);
    throw error;
  }
}

async function getUsers(token) {
  try {
    const response = await fetch(`${API_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Грешка при извличане на потребители');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Грешка:', error);
    throw error;
  }
}

async function getUserById(id, token) {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Грешка при извличане на потребител');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Грешка:', error);
    throw error;
  }
}

async function updateUser(id, userData, token) {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      throw new Error('Грешка при обновяване на потребител');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Грешка:', error);
    throw error;
  }
}

async function deleteUser(id, token) {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Грешка при изтриване на потребител');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Грешка:', error);
    throw error;
  }
}

window.api = {
  API_URL,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  registerUser,
  loginUser,
  createOrder,
  getOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};