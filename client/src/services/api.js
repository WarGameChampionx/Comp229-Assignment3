const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Shared function for sending requests to the backend.
export async function apiRequest(endpoint, options = {}) {
    const token = sessionStorage.getItem("portfolioToken");

    const headers = {
        "Content-Type": "application/json",
        ...options.headers
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    let response;

    try {
        response = await fetch(`${API_URL}/api${endpoint}`, {
            ...options,
            headers
        });
    } catch {
        throw new Error("Cannot connect to the backend server.");
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || `Request failed (${response.status}).`);
    }

    return data;
}

// Authentication
export const signUp = (userData) =>
    apiRequest("/auth/signup", {
        method: "POST",
        body: JSON.stringify(userData)
    });

export const signIn = (credentials) =>
    apiRequest("/auth/signin", {
        method: "POST",
        body: JSON.stringify(credentials)
    });

// Projects
export const getProjects = () => apiRequest("/projects");

// Qualifications
export const getQualifications = () => apiRequest("/qualifications");

// Contacts
export const createContact = (contactData) =>
    apiRequest("/contacts", {
        method: "POST",
        body: JSON.stringify(contactData)
    });


/* Administrator CRUD operations */

// Projects
export const createProject = (data) =>
    apiRequest("/projects", {
        method: "POST",
        body: JSON.stringify(data)
    });

export const updateProject = (id, data) =>
    apiRequest(`/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify(data)
    });

export const deleteProject = (id) =>
    apiRequest(`/projects/${id}`, {
        method: "DELETE"
    });

// Qualifications
export const createQualification = (data) =>
    apiRequest("/qualifications", {
        method: "POST",
        body: JSON.stringify(data)
    });

export const updateQualification = (id, data) =>
    apiRequest(`/qualifications/${id}`, {
        method: "PUT",
        body: JSON.stringify(data)
    });

export const deleteQualification = (id) =>
    apiRequest(`/qualifications/${id}`, {
        method: "DELETE"
    });

// Contacts
export const getContacts = () =>
    apiRequest("/contacts");

export const updateContact = (id, data) =>
    apiRequest(`/contacts/${id}`, {
        method: "PUT",
        body: JSON.stringify(data)
    });

export const deleteContact = (id) =>
    apiRequest(`/contacts/${id}`, {
        method: "DELETE"
    });

// Authentication verification
export const getCurrentUser = () =>
    apiRequest("/auth/me");
