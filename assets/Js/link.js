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

function fetchData(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            callback(null, JSON.parse(xhr.responseText));
        } else {
            callback(xhr.statusText, null);
        }
    };
    xhr.onerror = function () {
        callback(xhr.statusText, null);
    };
    xhr.send();
}

function fetchAndPopulateTable(url){
    fetchData.call(this,url, (error,data) => {
        if(error){
            console.log('error occured in fetching the data');
        }
        populateTable(data)
    });
}

function populateTable(data) {
    const tableBody = document.querySelector('#comparison-table tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    // Display only 5 entries
    data.slice(0, 5).forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.title}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.description}</td>
            <td>${product.size || 'N/A'}</td>
            <td>${product.weight || 'N/A'}</td>
        `;
        tableBody.appendChild(row);
    });
}
document.addEventListener('DOMContentLoaded',()=>{
    fetchAndPopulateTable('https://fakestoreapi.com/products');
})
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