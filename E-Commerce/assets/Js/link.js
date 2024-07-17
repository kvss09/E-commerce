async function fetchDataAsync(url) {
    try {
        const response = await fetch(url); // Await the fetch request
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json(); // Await the response conversion to JSON
        return data;
    } catch (error) {
        console.error('Error fetching products with async/await:', error);
        throw error;
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    const featuredProductsContainer = document.getElementById('cardMain');
    const apiUrl = 'https://fakestoreapi.com/products'; // Example API URL

    try {
        
        const data = await fetchDataAsync(apiUrl); // Await the async function
        if (data.length > 0) {
            featuredProductsContainer.innerHTML = ''; // Clear any existing items
            data.slice(0, 10).forEach(product => {
                const productElement = document.createElement('div');
                productElement.className = 'card';
                productElement.innerHTML = `
                    <img src="${product.image}" alt="${product.title}">
                    <h3>${product.title}</h3>
                    <p>$${product.price.toFixed(2)}</p>
                `;
                featuredProductsContainer.appendChild(productElement);
            });
        } else {
            featuredProductsContainer.innerHTML
            featuredProductsContainer.innerHTML = '<p>No products available</p>';
        }
    } catch (error) {
        console.error('Error displaying products:', error);
    }
});