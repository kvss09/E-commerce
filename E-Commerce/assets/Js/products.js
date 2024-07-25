document.addEventListener('DOMContentLoaded', function () {
    let productArray = [];
    fetch('product.json')
        .then(response => response.json())
        .then(data => {
            productArray = data;
            displayProduct(data);
        })
        .catch(error => console.error('Error fetching products:', error));

    function displayProduct(data){
        const productList = document.getElementById('product-list');
        productList.innerHTML='';
        data.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('col-lg-3', 'col-md-4', 'col-sm-6', 'mb-4');

            card.innerHTML = `
                <div class="card h-100">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text font-weight-bold">$${product.price.toFixed(2)}</p>
                        <div class="d-flex align-items-center">
                            <input type="number" class="quantity-input m-2" value="1" min="1" style="width:3rem;">
                            <a href="#" class="btn btn-primary add-to-cart" data-product="${encodeURIComponent(JSON.stringify(product))}">Add to Cart</a>
                        </div>
                    </div>
                </div>
            `;
            productList.append(card);
        });

        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                try {
                    const product = JSON.parse(decodeURIComponent(event.target.getAttribute('data-product')));
                    const quantityInput = event.target.previousElementSibling;
                    const quantity = parseInt(quantityInput.value);
                    if (isNaN(quantity) || quantity <= 0) {
                        throw new Error('Invalid quantity.');
                    }
                    addToCart(product, quantity);
                } catch (error) {
                    console.error('Error handling add-to-cart event:', error);
                    alert('Error adding product to cart. Please check the quantity and try again.');
                }
            });
        });
    }

    let renderCount = 0;
    let debouncedSearch = _.debounce(handleSearch, 400);
    document.getElementById('search').addEventListener('input', debouncedSearch);
    document.getElementById('price-range').addEventListener('change', applyFilters);

    function handleSearch(event) {
        renderCount++;
        const filteredProducts = productArray.filter(product => 
            product.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
            product.description.toLowerCase().includes(event.target.value.toLowerCase())
        );
        displayProduct(filteredProducts);
        console.log(renderCount);
    }

    function applyFilters() {
        const query = document.getElementById('search').value.toLowerCase();
        const priceRange = document.getElementById('price-range').value;
        let [min, max] = priceRange ? priceRange.split('-').map(Number) : [0, Infinity];

        const filteredProducts = productArray.filter(product => 
            product.price >= min && product.price <= max && 
            (product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query))
        );
        displayProduct(filteredProducts);
    }

    function addToCart(product, quantity) {
        try {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingProduct = cart.find(item => item.name === product.name);
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                product.quantity = quantity;
                cart.push(product);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            alert('Product added to cart!');
        } catch (error) {
            console.error('Error adding product to cart:', error);
            alert('Failed to add product to cart. Please try again.');
        }
    }
});
