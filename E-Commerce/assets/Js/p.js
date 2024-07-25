
        document.addEventListener('DOMContentLoaded', function () {
            // Define the base class for a product
            class Product {
                constructor(name, price, description, image) {
                    this.name = name;
                    this.price = price;
                    this.description = description;
                    this.image = image;
                }

                display() {
                    return `
                        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                            <div class="card h-100">
                                <img src="${this.image}" class="card-img-top" alt="${this.name}">
                                <div class="card-body">
                                    <h5 class="card-title">${this.name}</h5>
                                    <p class="card-text">${this.description}</p>
                                    <p class="card-text font-weight-bold">$${this.price.toFixed(2)}</p>
                                    <div class="d-flex align-items-center">
                                        <input type="number" class="quantity-input" value="1" min="1">
                                        <a href="#" class="btn btn-primary add-to-cart" data-product='${JSON.stringify(this)}'>Add to Cart</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }
            }

            // Define the derived class for a discounted product
            class DiscountedProduct extends Product {
                constructor(name, price, description, image, discount) {
                    super(name, price, description, image);
                    this.discount = discount;
                }

                display() {
                    const discountedPrice = this.price - (this.price * (this.discount / 100));
                    return `
                        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                            <div class="card h-100">
                                <img src="${this.image}" class="card-img-top" alt="${this.name}">
                                <div class="card-body">
                                    <h5 class="card-title">${this.name}</h5>
                                    <p class="card-text">${this.description}</p>
                                    <p class="card-text font-weight-bold">$${discountedPrice.toFixed(2)}
                                    <span class="badge badge-danger">${this.discount}% OFF</span></p>
                                    <div class="d-flex align-items-center">
                                        <input type="number" class="quantity-input" value="1" min="1">
                                        <a href="#" class="btn btn-primary add-to-cart" data-product='${JSON.stringify(this)}'>Add to Cart</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }
            }

            // Example dummy discounted product with a similar image
            const discountedProduct = new DiscountedProduct(
                "Dummy Discounted Product",
                40.00,
                "This is a dummy discounted product.",
                "https://via.placeholder.com/400x300?text=Discounted+Product",
                30 // 30% discount
            );

            // Fetch products from products.json and display them
            fetch('products.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok.');
                    }
                    return response.json();
                })
                .then(data => {
                    window.products = data; // Store products globally for filtering
                    displayProducts(data); // Display all products initially

                    // Also display the dummy discounted product for inheritance demonstration
                    const productList = document.getElementById('product-list');
                    productList.innerHTML += discountedProduct.display();

                    // Attach event listeners after products have been added
                    attachEventListeners();
                })
                .catch(error => {
                    console.error('Error fetching products:', error);
                    document.getElementById('error-message').textContent = 'Failed to load products. Please try again later.';
                });

            // Function to display products on the page
            function displayProducts(products) {
                const productList = document.getElementById('product-list'); // Get the container for product cards
                productList.innerHTML = ''; // Clear existing product cards

                products.forEach(product => {
                    // Create a new card element for each product
                    const card = document.createElement('div');
                    card.classList.add('col-lg-3', 'col-md-4', 'col-sm-6', 'mb-4'); // Responsive column classes

                    // Set the inner HTML for the card
                    card.innerHTML = `
                        <div class="card h-100"> <!-- Ensure cards are of equal height -->
                            <img src="${product.image}" class="card-img-top" alt="${product.name}">
                            <div class="card-body"> <!-- Use flexbox for vertical alignment -->
                                <h5 class="card-title">${product.name}</h5>
                                <p class="card-text">${product.description}</p>
                                <p class="card-text font-weight-bold">$${product.price.toFixed(2)}</p>
                                <div class="d-flex align-items-center">
                                    <input type="number" class="quantity-input" value="1" min="1">
                                    <a href="#" class="btn btn-primary add-to-cart" data-product='${JSON.stringify(product)}'>Add to Cart</a>
                                </div>
                            </div>
                        </div>
                    `;

                    // Append the card to the product list container
                    productList.appendChild(card);
                });

                // Attach event listeners after products have been added
                attachEventListeners();
            }

            // Function to add a product to the cart (Create and Update Operation)
            function addToCart(product, quantity) {
                try {
                    let cart = JSON.parse(localStorage.getItem('cart')) || []; // Get existing cart or initialize empty array
                    const existingProduct = cart.find(item => item.name === product.name); // Check if product already in cart
                    if (existingProduct) {
                        existingProduct.quantity += quantity; // Update quantity if product exists
                    } else {
                        product.quantity = quantity; // Set quantity for new product
                        cart.push(product); // Add new product to cart
                    }
                    localStorage.setItem('cart', JSON.stringify(cart)); // Save updated cart to local storage
                    alert('Product added to cart!'); // Notify user
                } catch (error) {
                    console.error('Error adding product to cart:', error);
                    alert('Failed to add product to cart. Please try again.');
                }
            }

            // Function to handle search
            function handleSearch(query) {
                try {
                    const filteredProducts = window.products.filter(product =>
                        product.name.toLowerCase().includes(query.toLowerCase()) ||
                        product.description.toLowerCase().includes(query.toLowerCase())
                    );
                    displayProducts(filteredProducts); // Display only the filtered products
                } catch (error) {
                    console.error('Error handling search:', error);
                    document.getElementById('error-message').textContent = 'Error processing search. Please try again.';
                }
            }

            // Debounce function
            function debounce(func, delay) {
                let timerId;
                return function (...args) {
                    clearTimeout(timerId);
                    timerId = setTimeout(() => func.apply(this, args), delay);
                };
            }

            // Throttle function
            function throttle(func, limit) {
                let lastFunc;
                let lastRan = 0;
                return function (...args) {
                    const context = this;
                    const now = Date.now();
                    if (now - lastRan >= limit) {
                        func.apply(context, args);
                        lastRan = now;
                    } else {
                        clearTimeout(lastFunc);
                        lastFunc = setTimeout(function () {
                            func.apply(context, args);
                            lastRan = now;
                        }, limit - (now - lastRan));
                    }
                };
            }

            // Get the search input element
            const searchInput = document.getElementById('search');

            // Attach debounced search function to input event
            searchInput.addEventListener('input', debounce(function () {
                handleSearch(this.value);
            }, 300)); // Debounce delay of 300ms

            // Uncomment to use throttling instead of debouncing
            // searchInput.addEventListener('input', throttle(function () {
            //     handleSearch(this.value);
            // }, 300)); // Throttle limit of 300ms

            // Function to attach event listeners to add-to-cart buttons
            function attachEventListeners() {
                document.querySelectorAll('.add-to-cart').forEach(button => {
                    button.addEventListener('click', (event) => {
                        event.preventDefault(); // Prevent default link behavior
                        try {
                            const product = JSON.parse(event.target.getAttribute('data-product')); // Get product data
                            const quantityInput = event.target.previousElementSibling; // Get quantity input
                            const quantity = parseInt(quantityInput.value); // Get quantity value
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

            function applyFilters() {
                const query = document.getElementById('search').value.toLowerCase();
                const priceRange = document.getElementById('price-range').value;

                let minPrice = 0;
                let maxPrice = Infinity;

                if (priceRange) {
                    [minPrice, maxPrice] = priceRange.split('-').map(Number);
                }

                // Filter products based on query and price range
                const filteredProducts = window.products.filter(product => {
                    const isNameMatch = product.name.toLowerCase().includes(query);
                    const isDescriptionMatch = product.description.toLowerCase().includes(query);
                    const isPriceMatch = product.price >= minPrice && product.price <= maxPrice;

                    return (isNameMatch || isDescriptionMatch) && isPriceMatch;
                });

                displayProducts(filteredProducts); // Update displayed products
            }
            // Attach event listeners to price range
            document.getElementById('price-range').addEventListener('change', applyFilters);
        });
