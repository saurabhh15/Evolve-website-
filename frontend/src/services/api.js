import axios from 'axios';

// Dynamically choose the backend URL based on where the frontend is running
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = isLocalhost 
    ? 'http://localhost:5000/api' 
    : 'https://evolve-website.onrender.com/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Automatically attach JWT token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// PROJECTS API

export const projectAPI = {
    // Get all projects
    getAll: (params) => api.get('/projects', { params }),

    // Search/filter projects
    search: (params) => api.get('/projects/search', { params }),
    
    // Get user's own projects
    getMyProjects: () => api.get('/projects/my-projects'),

    // Get single project by ID
    getById: (id) => api.get(`/projects/${id}`),

    // Create new project
    create: (projectData) => api.post('/projects', projectData),

    // Update project
    update: (id, projectData) => api.put(`/projects/${id}`, projectData),

    // Delete project
    delete: (id) => api.delete(`/projects/${id}`),

    // Like/unlike project
    toggleLike: (id) => api.post(`/projects/${id}/like`),

    // Add team member
    addTeamMember: (projectId, userId) =>
        api.post(`/projects/${projectId}/team`, { userId }),

    // Remove team member
    removeTeamMember: (projectId, userId) =>
        api.delete(`/projects/${projectId}/team/${userId}`),
};


// USERS API

export const userAPI = {
    // Get user by ID
    getById: (id) => api.get(`/users/${id}`),

    // Update own profile
    updateProfile: (profileData) => api.put('/users/profile', profileData),

    // Search users
    search: (params) => api.get('/users/search', { params }),
    
    // Get mentors
    getMentors: (skill) => api.get('/users/mentors', { params: { skill } }),

    // Get user's projects
    getUserProjects: (userId) => api.get(`/users/${userId}/projects`),
};


// CONNECTIONS API

export const connectionAPI = {
    // Get all connections (with optional filters)
    getAll: (params) => api.get('/connections', { params }),
    
    // Get received requests
    getReceived: () => api.get('/connections/received'),

    // Get sent requests
    getSent: () => api.get('/connections/sent'),

    // Get network (accepted connections)
    getNetwork: () => api.get('/connections/network'),

    // Send connection request
    send: (data) => api.post('/connections', data),
    
    // Accept/reject request
    updateStatus: (id, status) => api.put(`/connections/${id}`, { status }),
    
    // Delete/cancel request
    delete: (id) => api.delete(`/connections/${id}`),
};


// MESSAGES API

export const messageAPI = {
    // Get all conversations
    getConversations: () => api.get('/messages/conversations'),

    // Get unread count
    getUnreadCount: () => api.get('/messages/unread-count'),

    // Get conversation with specific user
    getConversation: (userId) => api.get(`/messages/conversation/${userId}`),

    // Send message
    send: (recipientId, content) =>
        api.post('/messages', { recipient: recipientId, content }),

    // Mark message as read
    markAsRead: (messageId) => api.put(`/messages/${messageId}/read`),

    // Mark entire conversation as read
    markConversationAsRead: (userId) =>
        api.put(`/messages/conversation/${userId}/read`),

    // Delete message
    delete: (messageId) => api.delete(`/messages/${messageId}`),
};

// COMMENTS API
export const commentAPI = {
    // Get all comments for a project
    getAll: (projectId) => api.get(`/projects/${projectId}/comments`),

    // Add comment
    add: (projectId, content) => api.post(`/projects/${projectId}/comments`, { content }),

    edit: (projectId, commentId, content) => api.put(`/projects/${projectId}/comments/${commentId}`, { content }),
    
    delete: (projectId, commentId) => api.delete(`/projects/${projectId}/comments/${commentId}`),
};

// NOTIFICATIONS API

export const notificationAPI = {
    // Get all notifications
    getAll: () => api.get('/notifications'),

    // Mark single as read
    markAsRead: (id) => api.put(`/notifications/${id}/read`),

    // Mark all as read
    markAllAsRead: () => api.put('/notifications/read-all'),

    // Delete notification
    delete: (id) => api.delete(`/notifications/${id}`),
};


// LEARNING GOALS API

export const learningGoalAPI = {
    getAll: () => api.get('/learning-goals'),
    add: (skill, target) => api.post('/learning-goals', { skill, target }),
    delete: (id) => api.delete(`/learning-goals/${id}`),
};


// NOTES API

export const noteAPI = {
    getAll: (menteeId) => api.get(`/notes/${menteeId}`),
    add: (menteeId, content) => api.post(`/notes/${menteeId}`, { content }),
    edit: (id, content) => api.put(`/notes/${id}`, { content }),
    delete: (id) => api.delete(`/notes/${id}`),
};


// APPLICATIONS API

export const applicationAPI = {
  apply: (projectId, data) => api.post(`/projects/${projectId}/apply`, data),
  getApplications: (projectId) => api.get(`/projects/${projectId}/applications`),
  getMyApplications: () => api.get('/applications/my'),
  updateStatus: (id, status) => api.put(`/applications/${id}`, { status }),
};

// AUTH API
export const authAPI = {
    // Get current user
    getMe: () => api.get('/auth/me'),

    // Update onboarding
    completeOnboarding: (data) => api.patch('/auth/onboarding', data),

    // Change Password
    changePassword: (data) => api.put('/auth/change-password', data),
};

// ── AI Suggestions ──────────────────────────────────────────
export const suggestTeammates = (projectId) =>
  fetch(`/api/ai/suggest-teammates/${projectId}`, {
    method: "POST",
    credentials: "include",
  }).then((r) => r.json());

export const suggestMentors = (projectId) =>
  fetch(`/api/ai/suggest-mentors/${projectId}`, {
    method: "POST",
    credentials: "include",
  }).then((r) => r.json());

// Export the base api instance in case you need custom calls
export default api;