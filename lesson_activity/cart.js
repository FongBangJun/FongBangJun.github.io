let cart = [];

function addToCart(productName, price, quantity) {
    const existingItemIndex = cart.findIndex(item => item.name === productName);

    if (existingItemIndex !== -1) {
        // If the item already exists in the cart, update the quantity
        cart[existingItemIndex].quantity += parseInt(quantity, 10);
    } else {
        // If the item is not in the cart, add a new item
        const newItem = {
            name: productName,
            price: price,
            quantity: parseInt(quantity, 10)
        };
        cart.push(newItem);
    }

    updateCartDisplay();
    alert(`${quantity} ${productName}(s) added to cart`);
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

function calculateTotal() {
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
    });
    return total;
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
    cart.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} - ¥${item.price.toFixed(2)} - Quantity: ${item.quantity} - Total: ¥${(item.price * item.quantity).toFixed(2)}`;
        
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = function () {
            removeFromCart(index);
        };

        listItem.appendChild(removeButton);
        cartItems.appendChild(listItem);
    });

    const totalElement = document.getElementById('total');
    totalElement.textContent = `Total: ¥${calculateTotal().toFixed(2)}`;

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
