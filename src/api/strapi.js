const API_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

/**
 * Fetches articles from Strapi API
 * @returns {Promise<Array>} Array of articles
 */
export async function fetchArticles() {
    try {
        const response = await fetch(`${API_URL}/api/articles?populate=*`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_STRAPI_TOKEN}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching articles:', error);
        return [];
    }
}

/**
 * Fetches a single article by ID from Strapi API
 * @param {string|number} id - Article ID
 * @returns {Promise<Object|null>} Article object or null if error
 */
export async function fetchArticle(id) {
    try {
        const response = await fetch(`${API_URL}/api/articles/${id}?populate=*`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_STRAPI_TOKEN}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching article:', error);
        return null;
    }
}