import { addCartItem, addWishlistItem, getCategories, getProducts, getWishlistIds, removeWishlistItem } from './firebaseStore.js';
import { showToast } from './toast.js';

const money = (value) => `Ksh. ${Number(value).toLocaleString('en-KE')}`;

const productCard = (product) => `
    <div class="box shop-item" id="${product.id}">
        <button class="wishlist-toggle" type="button" data-product-id="${product.id}" aria-label="Add ${product.title} to wishlist">
            <i class="far fa-heart"></i>
        </button>
        <img src="${product.image_url}" class="shop-item-image" alt="${product.title}">
        <h3 class="shop-item-title">${product.title}</h3>
        <p>${product.description}</p>
        <div class="stars">
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star-half-alt"></i>
        </div>
        <div class="price shop-item-price">${money(product.discount_price)} <span>${money(product.original_price)}</span></div>
        <button class="btn shop-item-button add-to-cart" data-product-id="${product.id}">Add to Cart</button>
    </div>
`;

const bindCartButtons = (products) => {
    document.querySelectorAll('.add-to-cart').forEach((button) => {
        button.addEventListener('click', async () => {
            const product = products.find((item) => item.id === button.dataset.productId);
            if (!product) return;

            try {
                await addCartItem(product);
                showToast(`${product.title} added to cart`);
            } catch (error) {
                showToast(error.message, 'error');
            }
        });
    });
};

const bindWishlistButtons = async (products) => {
    let wishlistIds = new Set();

    try {
        wishlistIds = await getWishlistIds();
    } catch (error) {
        wishlistIds = new Set();
    }

    document.querySelectorAll('.wishlist-toggle').forEach((button) => {
        const icon = button.querySelector('i');
        const productId = button.dataset.productId;

        if (wishlistIds.has(productId)) {
            button.classList.add('active');
            icon.className = 'fas fa-heart';
        }

        button.addEventListener('click', async () => {
            const product = products.find((item) => item.id === productId);
            if (!product) return;

            try {
                if (button.classList.contains('active')) {
                    await removeWishlistItem(product.id);
                    button.classList.remove('active');
                    icon.className = 'far fa-heart';
                    showToast(`${product.title} removed from wishlist`, 'info');
                    return;
                }

                await addWishlistItem(product);
                button.classList.add('active');
                icon.className = 'fas fa-heart';
                showToast(`${product.title} added to wishlist`);
            } catch (error) {
                showToast(error.message, 'error');
            }
        });
    });
};

const renderProducts = (container, products) => {
    container.innerHTML = products.length
        ? products.map(productCard).join('')
        : '<p style="font-size:18px;color:gray;">No products found.</p>';

    bindCartButtons(products);
    bindWishlistButtons(products);
};

const renderHomeProducts = async () => {
    const container = document.querySelector('#box-container');
    if (!container) return;

    container.innerHTML = '<p style="font-size:18px;color:gray;">Loading products...</p>';
    const products = await getProducts({ featured: true });
    renderProducts(container, products);
};

const renderMenuProducts = async () => {
    const menuSection = document.querySelector('.menu');
    if (!menuSection) return;

    const categories = await getCategories();
    const allProducts = await getProducts();

    menuSection.innerHTML = categories.map((category) => {
        const products = allProducts.filter((product) => product.categoryId === category.id);

        return `
            <section class="shop pizzas menu-category-section">
                <div class="menu-category-heading">
                    <span>${category.slug}</span>
                    <h3>${category.name}</h3>
                </div>
                <div class="box-container">
                    ${products.length ? products.map(productCard).join('') : '<p style="font-size:18px;color:gray;">No products in this category.</p>'}
                </div>
            </section>
        `;
    }).join('');

    bindCartButtons(allProducts);
};

const renderSearchProducts = async () => {
    const container = document.querySelector('.card-container');
    const searchSpanElement = document.querySelector('#search-key');
    if (!container || !searchSpanElement) return;

    const params = new URLSearchParams(window.location.search);
    const searchTerm = params.get('q') || '';

    searchSpanElement.innerHTML = searchTerm;
    container.innerHTML = '<p style="font-size:18px;color:gray;">Searching...</p>';

    const products = await getProducts({ searchTerm });
    renderProducts(container, products);
};

renderHomeProducts();
renderMenuProducts();
renderSearchProducts();
