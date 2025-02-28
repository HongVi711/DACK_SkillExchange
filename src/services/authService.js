const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth';

// Hàm hỗ trợ xử lý response
const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Đã có lỗi xảy ra!');
    }
    return data;
};

// Đăng nhập
export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await handleResponse(response);

        // Lưu token vào localStorage
        localStorage.setItem('token', data.token);
        return data;
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        throw error;
    }
};

// Đăng ký
export const registerUser = async (fullName, email, password) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fullName, email, password })
        });

        return await handleResponse(response);
    } catch (error) {
        console.error('Lỗi đăng ký:', error);
        throw error;
    }
};

// Hàm xóa token khi logout
export const removeToken = () => {
    localStorage.removeItem('token');
};
