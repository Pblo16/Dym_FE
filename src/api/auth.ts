const API_URL = import.meta.env.VITE_STRAPI_URL;

// Type definitions
interface StrapiMedia {
    id: number;
    url: string;
    name: string;
    alternativeText?: string;
}

interface User {
    id: number;
    username: string;
    email: string;
    avatar?: StrapiMedia | number | string; // Can be populated object, ID, or URL
}

interface AuthResponse {
    jwt: string;
    user: User;
}

interface ApiError {
    error?: {
        message: string;
    };
}

interface RegisterData {
    username: string;
    email: string;
    password: string;
}

interface LoginCredentials {
    identifier: string;
    password: string;
}

interface UpdateProfileData {
    username?: string;
    email?: string;
    avatar?: number; // Strapi media ID
}

/**
 * Makes authenticated API request with error handling
 * @param url - API endpoint URL
 * @param options - Fetch options
 * @returns Promise with parsed JSON response
 */
async function makeApiRequest<T>(url: string, options: RequestInit): Promise<T> {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            const errorData: ApiError = await response.json();
            throw new Error(errorData.error?.message || `HTTP ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Network error occurred');
    }
}

/**
 * Creates standard POST request options
 * @param body - Request body data
 * @param token - Optional authorization token
 * @returns Request options object
 */
function createPostOptions(body: unknown, token?: string): RequestInit {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
    };
}

/**
 * Creates standard GET request options with authentication
 * @param token - Authorization token
 * @returns Request options object
 */
function createGetOptions(token: string): RequestInit {
    return {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
}

/**
 * Creates standard PUT request options
 * @param body - Request body data
 * @param token - Authorization token
 * @returns Request options object
 */
function createPutOptions(body: unknown, token: string): RequestInit {
    return {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    };
}

/**
 * Creates FormData for file upload
 * @param file - File to upload
 * @param fieldName - Form field name
 * @returns FormData object
 */
function createFileUploadOptions(file: File, fieldName: string = 'files'): FormData {
    const formData = new FormData();
    formData.append(fieldName, file);
    return formData;
}

/**
 * Creates file upload request options
 * @param formData - FormData with file
 * @param token - Authorization token
 * @returns Request options object
 */
function createFileUploadRequestOptions(formData: FormData, token: string): RequestInit {
    return {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    };
}

// API Token configuration (optional)
const API_TOKEN = import.meta.env.VITE_STRAPI_API_TOKEN;

/**
 * Creates file upload options with API token
 * @param formData - FormData with file
 * @returns Request options with API token
 */
function createApiTokenFileUploadOptions(formData: FormData): RequestInit {
    return {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
        },
        body: formData,
    };
}

/**
 * Registers a new user in Strapi
 * @param userData - User registration data
 * @returns User data and JWT token
 */
export async function registerUser(userData: RegisterData): Promise<AuthResponse> {
    const url = `${API_URL}/api/auth/local/register`;
    const options = createPostOptions(userData);

    return makeApiRequest<AuthResponse>(url, options);
}

/**
 * Authenticates a user with email/username and password
 * @param credentials - Login credentials
 * @returns User data and JWT token
 */
export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
    const url = `${API_URL}/api/auth/local`;
    const options = createPostOptions(credentials);

    return makeApiRequest<AuthResponse>(url, options);
}

/**
 * Builds full URL for Strapi media files
 * @param url - Relative or absolute URL from Strapi
 * @returns Full URL for the media file
 */
function buildMediaUrl(url: string): string {
    if (url.startsWith('http')) {
        return url; // Already absolute URL
    }
    return `${API_URL}${url}`; // Build absolute URL
}

/**
 * Validates if a JWT token is still valid
 * @param token - JWT token to validate
 * @returns Token validity status
 */
export async function validateToken(token: string): Promise<boolean> {
    try {
        await getCurrentUser(token);
        return true;
    } catch {
        return false;
    }
}

/**
 * Extracts avatar URL from user data with proper Strapi media handling
 * @param user - User object with potential avatar data
 * @returns Avatar URL or null if not available
 */
export function extractAvatarUrl(user: User | null): string | null {
    if (!user?.avatar) return null;

    // If avatar is a populated Strapi media object
    if (typeof user.avatar === 'object' && 'url' in user.avatar) {
        return buildMediaUrl(user.avatar.url);
    }

    // If avatar is already a URL string
    if (typeof user.avatar === 'string') {
        return user.avatar.startsWith('http') ? user.avatar : buildMediaUrl(user.avatar);
    }

    // If avatar is just an ID, we can't get the URL without another request
    return null;
}

/**
 * Gets current user data with populated avatar using JWT token
 * @param token - JWT token
 * @returns User data with populated avatar
 */
export async function getCurrentUser(token: string): Promise<User> {
    const url = `${API_URL}/api/users/me?populate[avatar][fields][0]=url&populate[avatar][fields][1]=name&populate[avatar][fields][2]=alternativeText`;
    const options = createGetOptions(token);

    return makeApiRequest<User>(url, options);
}

/**
 * Gets user by ID with populated avatar
 * @param userId - User ID
 * @param token - JWT token
 * @returns User data with populated avatar
 */
export async function getUserById(userId: number, token: string): Promise<User> {
    const url = `${API_URL}/api/users/${userId}?populate[avatar][fields][0]=url&populate[avatar][fields][1]=name&populate[avatar][fields][2]=alternativeText`;
    const options = createGetOptions(token);

    return makeApiRequest<User>(url, options);
}

/**
 * Updates user profile data and returns updated user with populated avatar
 * @param userId - User ID
 * @param profileData - Profile data to update
 * @param token - JWT token
 * @returns Updated user data with populated avatar
 */
export async function updateUserProfile(
    userId: number,
    profileData: UpdateProfileData,
    token: string
): Promise<User> {
    const url = `${API_URL}/api/users/${userId}`;
    const options = createPutOptions(profileData, token);

    // Update the user
    await makeApiRequest<User>(url, options);

    // Return updated user with populated avatar
    return getUserById(userId, token);
}

/**
 * Uploads file to Strapi media library
 * @param file - File to upload
 * @param token - JWT token
 * @returns Uploaded file data with ID
 */
export async function uploadFile(file: File, token: string): Promise<{ id: number; url: string }> {
    const url = `${API_URL}/api/upload`;
    const formData = createFileUploadOptions(file);
    const options = createFileUploadRequestOptions(formData, token);

    const response = await makeApiRequest<Array<{ id: number; url: string }>>(url, options);
    return response[0]; // Strapi returns array, we need first item
}

/**
 * Uploads avatar and updates user profile
 * @param file - Avatar image file
 * @param userId - User ID
 * @param token - JWT token
 * @returns Updated user data with new avatar
 */
export async function uploadAndUpdateAvatar(
    file: File,
    userId: number,
    token: string
): Promise<User> {
    // First upload the file
    const uploadedFile = await uploadFile(file, token);

    // Then update user profile with the uploaded file ID
    return updateUserProfile(userId, { avatar: uploadedFile.id }, token);
}

/**
 * Uploads file using API token (alternative method)
 * @param file - File to upload
 * @returns Uploaded file data
 */
export async function uploadFileWithApiToken(file: File): Promise<{ id: number; url: string }> {
    if (!API_TOKEN) {
        throw new Error('API token not configured');
    }

    const url = `${API_URL}/api/upload`;
    const formData = createFileUploadOptions(file);
    const options = createApiTokenFileUploadOptions(formData);

    const response = await makeApiRequest<Array<{ id: number; url: string }>>(url, options);
    return response[0];
}

/**
 * Hybrid upload: tries user token first, falls back to API token
 * @param file - Avatar image file
 * @param userId - User ID
 * @param userToken - User JWT token
 * @returns Updated user data with new avatar
 */
export async function uploadAndUpdateAvatarHybrid(
    file: File,
    userId: number,
    userToken: string
): Promise<User> {
    try {
        // Try with user token first
        return await uploadAndUpdateAvatar(file, userId, userToken);
    } catch (error) {
        console.warn('User token upload failed, trying API token:', error);

        if (!API_TOKEN) {
            throw error; // Re-throw original error if no API token
        }

        try {
            // Fallback to API token for file upload
            const uploadedFile = await uploadFileWithApiToken(file);
            // But still use user token for profile update (user can only update their own profile)
            return updateUserProfile(userId, { avatar: uploadedFile.id }, userToken);
        } catch (apiTokenError) {
            console.error('API token upload also failed:', apiTokenError);
            throw error; // Throw original error
        }
    }
}
