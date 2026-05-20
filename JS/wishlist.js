import { auth, onAuthStateChanged } from './FirebaseConfig.js';
import { addCartItem, getWishlistItems, removeWishlistItem } from './firebaseStore.js';
import { showToast } from './toast.js';

const grid = document.querySelector('.wishlist-grid');
const money = (value) => `Ksh. ${Number(value).toLocaleString('en-KE')}`;

const renderEmpty = () => {
    grid.innerHTML = `
        <div class="wishlist-empty">
            <i class="far fa-heart"></i>
            <h2>No favorites yet</h2>
            <p>Browse the menu and tap the heart on any pizza you want to save.</p>
            <a href="menu.html" class="btn">Browse Menu</a>
        </div>
    `;
};

const renderWishlist = async () => {
    const items = await getWishlistItems();

    if (!items.length) {
        renderEmpty();
        return;
    }

    grid.innerHTML = items.map((item) => `
        <article class="wishlist-card" data-product-id="${item.productId}">
            <button class="wishlist-remove" type="button" aria-label="Remove ${item.title}">
                <i class="fas fa-times"></i>
            </button>
            <img src="${item.image_url}" alt="${item.title}">
            <div class="wishlist-card-body">
                <h2>${item.title}</h2>
                <p>${item.description || 'Freshly prepared and ready for your next order.'}</p>
                <div class="wishlist-price">
                    <strong>${money(item.price)}</strong>
                    <span>${money(item.original_price || item.price)}</span>
                </div>
                <button class="btn wishlist-cart-btn" type="button">Add to Cart</button>
            </div>
        </article>
    `).join('');

    grid.querySelectorAll('.wishlist-card').forEach((card) => {
        const productId = card.dataset.productId;
        const item = items.find((entry) => entry.productId === productId);

        card.querySelector('.wishlist-remove').addEventListener('click', async () => {
            await removeWishlistItem(productId);
            showToast(`${item.title} removed from wishlist`, 'info');
            await renderWishlist();
        });

        card.querySelector('.wishlist-cart-btn').addEventListener('click', async () => {
            await addCartItem({
                id: item.productId,
                title: item.title,
                image_url: item.image_url,
                discount_price: item.price,
                original_price: item.original_price,
                description: item.description,
                categoryId: item.categoryId
            });
            await removeWishlistItem(productId);
            showToast(`${item.title} moved to cart`);
            await renderWishlist();
        });
    });
};

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    grid.innerHTML = '<p class="wishlist-loading">Loading wishlist...</p>';
    await renderWishlist();
});

window.addEventListener('wishlist-updated', renderWishlist);
