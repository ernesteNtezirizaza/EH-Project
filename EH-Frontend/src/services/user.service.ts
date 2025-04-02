import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

// Create a function to get the auth token
const getAuthHeaders = () => {
    const storedData = localStorage.getItem('user_data');
    if (!storedData) {
        console.error('No user data found in localStorage');
        throw new Error('Authentication token not found');
    }

    try {
        const userData = JSON.parse(storedData);
        const userToken = userData.userToken || userData.token; // Add fallback for token key

        if (!userToken) {
            console.error('No token found in user data', userData);
            throw new Error('Authentication token is missing');
        }

        return {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        };
    } catch (error) {
        console.error('Error parsing auth token:', error);
        throw new Error('Failed to retrieve authentication token');
    }
};

export const userService = {
    getUserStats: async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/v1/admin/user-stats`,
                getAuthHeaders()
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching user stats:', error);
            throw error;
        }
    },
}