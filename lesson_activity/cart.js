let cart = [];

function addToCart(productName, price) {
    const item = {
        name: productName,
        price: price
    };
    cart.push(item);
    updateCartDisplay();
    alert(`${productName} added to cart!`);
}

function removeFromCart(index) {
    cart.splice(index, 1); // Remove the item at the specified index
    updateCartDisplay();
}

function openCartModal() {
    updateCartDisplay();
    const modal = document.getElementById('cartModal');
    modal.style.display = 'block';
}

function closeCartModal() {
    const modal = document.getElementById('cartModal');
    modal.style.display = 'none';
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
    cart.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} - ¥${item.price.toFixed(2)}`;
        
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = function () {
            removeFromCart(index);
        };

        listItem.appendChild(removeButton);
        cartItems.appendChild(listItem);
    });

    // Save the cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Retrieve cart from localStorage on page load
document.addEventListener('DOMContentLoaded', function () {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCartDisplay();
    }
});