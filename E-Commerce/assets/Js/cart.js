
document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');

    // Function to load cart items from localStorage and display them in the cart
    function loadCartItems() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length > 0) {
            cartItemsContainer.innerHTML = ''; // Clear any existing items

            cart.forEach((product, index) => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';

                cartItem.innerHTML = `
                    
                    <div class="cart-item-details">
                        <img src="${product.image}" alt="${product.name}">
                        <h3 class="cart-item-title">${product.name}</h3>
                        <p class="cart-item-price">$${product.price}</p>
                        <div class="cart-item-actions">
                            <input type="number" value="${product.quantity}" min="1" class="quantity-input">
                            <button class="remove-button">Remove</button>
                        </div>
                    </div>
                `;

                cartItemsContainer.appendChild(cartItem);

                // Add event listeners
                const removeButton = cartItem.querySelector('.remove-button');
                const quantityInput = cartItem.querySelector('.quantity-input');

                removeButton.addEventListener('click', () => {
                    cart.splice(index, 1);// delete the card from product array which was taken from the local storage named as cart
                    localStorage.setItem('cart', JSON.stringify(cart)); // vales must be reflect into local storage in real time
                    loadCartItems();
                });

                quantityInput.addEventListener('change', (event) => {
                    product.quantity = parseInt(event.target.value); // replaces the qunatity of the product array which was taken from the local storage named as cart
                    localStorage.setItem('cart', JSON.stringify(cart)); // vales must be reflect into local storage in real time
                    updateCartTotal();
                });
            });

            
        } else {
            cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        }
    }
    function updateCartTotal() {
        let total = 0;
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.forEach(item => {
            total += item.price * item.quantity;
        });
        cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
      
    }
    // Initialize cart items
    loadCartItems();

    // Handle checkout button click
    checkoutButton.addEventListener('click', () => {
        alert(`Proceeding to checkout`);
    });
});