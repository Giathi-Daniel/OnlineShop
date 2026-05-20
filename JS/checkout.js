import { auth, onAuthStateChanged } from './FirebaseConfig.js';
import { createOrder, getCartItems } from './firebaseStore.js';
import { showToast } from './toast.js';

const cartSection = document.querySelector('.cart-section');
const money = (value) => `Ksh. ${Number(value).toLocaleString('en-KE')}`;

const renderCheckout = async () => {
    const cartItems = await getCartItems();

    if (!cartItems.length) {
        cartSection.innerHTML = `
            <div class="checkout-empty">
                <h2>Your cart is empty</h2>
                <p>Add a pizza before continuing to checkout.</p>
                <a href="menu.html" class="btn">Go to Menu</a>
            </div>
        `;
        return;
    }

    const subtotal = cartItems.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
    const deliveryFee = subtotal > 0 ? 250 : 0;
    const total = subtotal + deliveryFee;

    cartSection.innerHTML = `
        <div class="product-list">
            <p class="section-heading">Order summary</p>
            ${cartItems.map((item) => `
                <div class="cart">
                    <div class="cart-item cart-column">
                        <img class="cart-item-image" src="${item.image_url}" alt="${item.title}">
                    </div>
                    <div>
                        <span>item: ${item.title}</span>
                        <p><span>Quantity: </span><span>${item.quantity}</span></p>
                        <p>Price: ${money(item.price)}</p>
                        <p>Total price: ${money(Number(item.price) * Number(item.quantity))}</p>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="checkout-section">
            <div class="checkout-box">
                <p class="text">your total bill</p>
                <div class="checkout-summary-line">
                    <span>Subtotal</span>
                    <strong>${money(subtotal)}</strong>
                </div>
                <div class="checkout-summary-line">
                    <span>Delivery</span>
                    <strong>${money(deliveryFee)}</strong>
                </div>
                <h2 class="bill">${money(total)}</h2>
                <button class="place-order-btn">place order</button>
            </div>
        </div>
    `;

    document.querySelector('.place-order-btn').addEventListener('click', placeOrder);
};

const getAddress = () => {
    let address = document.querySelector('#address').value.trim();
    let street = document.querySelector('#street').value.trim();
    let city = document.querySelector('#city').value.trim();
    let state = document.querySelector('#state').value.trim();
    let zipcode = document.querySelector('#zipcode').value.trim();
    let landmark = document.querySelector('#landmark').value.trim();

    if (!address.length || !street.length || !city.length || !state.length || !zipcode.length || !landmark.length) {
        showToast('Fill all delivery fields before placing the order.', 'error');
        return null;
    }

    return { address, street, city, state, zipcode, landmark };
};

const placeOrder = async () => {
    const address = getAddress();
    if (!address) return;

    try {
        const cartItems = await getCartItems();
        const subtotal = cartItems.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
        const deliveryFee = subtotal > 0 ? 250 : 0;
        const order = await createOrder({ address, deliveryFee });
        showToast(`Order placed successfully. Order ID: ${order.id}`);
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1200);
    } catch (error) {
        showToast(error.message, 'error');
    }
};

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    await renderCheckout();
});
