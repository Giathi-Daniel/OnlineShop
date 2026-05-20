import { auth, onAuthStateChanged } from './FirebaseConfig.js';
import { getCartItems, removeCartItem, setCartItemQuantity } from './firebaseStore.js';
import { showToast } from './toast.js';

let cartItems = [];

const money = (value) => `Ksh. ${Number(value).toLocaleString('en-KE')}`;
const cartItemsContainer = document.getElementsByClassName('cart-items')[0];

const renderEmptyCart = () => {
    cartItemsContainer.innerHTML = `
        <div class="cart-empty">
            <i class="fas fa-shopping-cart"></i>
            <h3>Your cart is empty</h3>
            <p>Add something from the menu to start an order.</p>
            <a href="menu.html" class="btn">Browse Menu</a>
        </div>
    `;
};

const renderCart = () => {
    cartItemsContainer.innerHTML = '';

    if (!cartItems.length) {
        renderEmptyCart();
        return;
    }

    cartItems.forEach((item) => {
        const itemTotal = Number(item.price) * Number(item.quantity);
        const cartRow = document.createElement('div');
        cartRow.classList.add('cart-row');
        cartRow.innerHTML = `
            <div class="cart-product">
                <img class="cart-item-image" src="${item.image_url}" alt="${item.title}">
                <div>
                    <h3 class="cart-item-title">${item.title}</h3>
                    <p>${money(item.price)} each</p>
                </div>
            </div>
            <div class="cart-quantity">
                <span>Qty</span>
                <input class="cart-quantity-input" type="number" min="1" value="${item.quantity}">
            </div>
            <div class="cart-line-total" id="item-${item.id}">
                <span>Total</span>
                <strong>${money(itemTotal)}</strong>
            </div>
            <button class="btn-danger" value="${item.id}" type="button">
                <i class="fas fa-trash-alt"></i>
                Remove
            </button>
        `;

        cartItemsContainer.append(cartRow);
        cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', async () => {
            await removeCartItem(item.id);
            showToast(`${item.title} removed from cart`, 'info');
            await loadCart();
        });
        cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', async (e) => {
            const quantity = Math.max(1, Number(e.target.value) || 1);
            await setCartItemQuantity(item.id, quantity);
            showToast('Cart quantity updated');
            await loadCart();
        });
    });

    const total = cartItems.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
    const summary = document.createElement('aside');
    summary.classList.add('cart-summary');
    summary.innerHTML = `
        <div>
            <span>Cart Total</span>
            <strong>${money(total)}</strong>
        </div>
        <button class="btn-purchase" type="button">Checkout</button>
    `;
    cartItemsContainer.append(summary);
    summary.getElementsByClassName('btn-purchase')[0].addEventListener('click', () => {
        window.location.href = 'checkout.html';
    });
};

async function loadCart() {
    cartItems = await getCartItems();
    renderCart();
}

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    await loadCart();
});
