document.addEventListener('DOMContentLoaded', function () {
    let productArray = [];
    fetch('product.json')
       
        .then(response => response.json())
        .then(data => {
            productArray = data;
            displayProduct(data)
           
        })
        .catch(error => console.error('Error fetching products:', error));

    function displayProduct(data){
        const productList = document.getElementById('product-list');
        productList.innerHTML='';
        data.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('col-lg-3', 'col-md-4', 'col-sm-6', 'mb-4'); // Adjusted column classes

            card.innerHTML = `
                <div class="card h-100" > 
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body"> 
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text font-weight-bold">$${product.price.toFixed(2)}</p>
                        <div class = "d-flex align-items-center">
                        <input type="number" class="quantity-input m-2 " value="1" min="1" style = "width:3rem;">
                        <a href="#" class="btn btn-primary add-to-cart" data-product="${JSON.stringify(product)}">Add to Cart</a>
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
                    const product = JSON.parse(event.target.getAttribute('data-product')); // Get product data
                    const quantityInput = event.target.previousElementSibling; // Get quantity input
                    console.log(quantityInput);
                    const quantity = parseInt(quantityInput.value); 
                   // Get quantity value
                    if (isNaN(quantity) || quantity <= 0) {
                        throw new Error('Invalid quantity.');
                    }
                    
                    addToCart(product, quantity); // Call function to add product to cart
                } catch (error) {
                    console.error('Error handling add-to-cart event:', error);
                    alert('Error adding product to cart. Please check the quantity and try again.');
                }
            });
        });
    }
    let renderCount = 0;
    let debouncedSearch =  _.debounce(handleSearch, 400);
    document.getElementById('search').addEventListener('input', debouncedSearch);
    document.getElementById('price-range').addEventListener('change',applyFliters);
        function handleSearch(event){
            ++renderCount;
           let filteredProducts = productArray.filter(product => 
                product.name.toLowerCase().includes(event.target.value.toLowerCase())
                             ||
                product.description.toLowerCase().includes(event.target.value.toLowerCase())
            )
            displayProduct(filteredProducts);
         console.log(renderCount);   
        }

        function applyFliters() {
            const query = document.getElementById('search').value.toLowerCase();
            const priceRange = document.getElementById('price-range').value;
            let min = 0;
            let max = Infinity;
            if(priceRange){
                [min, max] = priceRange.split('-');
                let filteredProducts = productArray.filter((product) => {
                    return (
                        product.price >= Number(min) && product.price <= Number(max) 
                    ) && 
                    (
                        product.name.toLowerCase().includes(query.toLowerCase())
                                                ||
                         product.description.toLowerCase().includes(query.toLowerCase()) 
                    )

                });
                
                displayProduct(filteredProducts);

            }

        
        }
});


function addToCart(product, quantity) {
    try {
        let cart = JSON.parse(localStorage.getItem('cart')) || []; // Get existing cart or initialize empty array
        const existingProduct = cart.find(item => item.name === product.name); // Check if product already in cart
    if (existingProduct) {
        existingProduct.quantity += quantity; // Update quantity if product exists
    } else {
        product.quantity = quantity; 
        console.log(cart);// Set quantity for new product
        cart.push(product); // Add new product to cart
    }
        localStorage.setItem('cart', JSON.stringify(cart)); // Save updated cart to local storage
        alert('Product added to cart!'); // Notify user
    } catch (error) {
        console.error('Error adding product to cart:', error);
        alert('Failed to add product to cart. Please try again.');
    }
}
