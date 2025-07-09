const API_URL = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';

export async function fetchArticles() {
    const response = await fetch(`${API_URL}/api/articles?populate=*`);
    const data = await response.json();
    return data.data;
}

export async function fetchArticle(id) {
    const response = await fetch(`${API_URL}/api/articles/${id}?populate=*`);
    const data = await response.json();
    return data.data;
}