window.user_details = null;

const protectedPages = ['cart.html', 'checkout.html'];
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

const createNav = () => {
    let nav = document.querySelector('.navbar');
    if (!nav) return;

    nav.innerHTML = `
        <div class="nav">
            <a href="index.html" class="logo"> <i class="fas fa-pizza-slice"></i> pizza</a>
            <div class="nav-items">
                <div class="search">
                    <input type="text" class="search-box" placeholder="search pizza">
                    <button class="search-btn">Search</button>
                </div>
                <a>
                    <img src="images/user.jpeg" id="user-img" alt="user image"/>
                    <div class="login-logout-popup hide">
                        <p class="account-info">log in to place order</p>
                        <button class="btn" id="user-btn">log in</button>
                    </div>
                </a>
                <a href="wishlist.html" class="nav-icon wishlist-nav hide" aria-label="Wishlist">
                    <i class="fas fa-heart"></i>
                </a>
                <a href="cart.html" class="nav-icon cart-nav Cart hide" aria-label="Cart">
                    <i class="fas fa-shopping-cart"></i>
                    <span class="cart-count">0</span>
                </a>
            </div>
        </div>
        <ul class="links-container">
            <li class="link-item"><a href="index.html" class="link">home</a></li>
            <li class="link-item"><a href="about.html" class="link">about</a></li>
            <li class="link-item"><a href="menu.html" class="link">menu</a></li>
            <li class="link-item"><a href="gallery.html" class="link">gallery</a></li>
            <li class="link-item"><a href="contact.html" class="link">contact</a></li>
        </ul>
    `;
};

createNav();

const userImageButton = document.querySelector('#user-img');
const userPopup = document.querySelector('.login-logout-popup');
const popuptext = document.querySelector('.account-info');
const actionBtn = document.querySelector('#user-btn');
const cartLink = document.querySelector('.Cart');
const wishlistLink = document.querySelector('.wishlist-nav');
const cartCount = document.querySelector('.cart-count');
const searchBtn = document.querySelector('.search-btn');
const searchBox = document.querySelector('.search-box');

userImageButton?.addEventListener('click', () => {
    userPopup?.classList.toggle('hide');
});

searchBtn?.addEventListener('click', () => {
    const searchTerm = searchBox.value.trim();
    if (searchTerm.length) {
        window.location.href = `search.html?q=${encodeURIComponent(searchTerm)}`;
    }
});

const setLoggedOutNav = () => {
    window.user_details = null;
    window.dispatchEvent(new CustomEvent('auth-ready', { detail: null }));

    userImageButton.src = 'images/user.jpeg';
    cartLink?.classList.add('hide');
    wishlistLink?.classList.add('hide');
    if (cartCount) cartCount.innerHTML = '0';
    popuptext.innerHTML = 'log in to place order';
    actionBtn.innerHTML = 'log in';
    actionBtn.onclick = () => {
        window.location.href = 'login.html';
    };
};

setLoggedOutNav();

const setupFirebaseAuthNav = async () => {
    try {
        const [{ auth, onAuthStateChanged, signOut }, { getCartCount, getUserDetails, upsertUserProfile }] = await Promise.all([
            import('./FirebaseConfig.js'),
            import('./firebaseStore.js')
        ]);

        const updateCartBadge = async () => {
            if (!auth.currentUser || !cartCount) return;

            try {
                const count = await getCartCount();
                cartCount.innerHTML = count;
                cartCount.classList.toggle('is-empty', count === 0);
            } catch (error) {
                console.warn('Could not update cart count:', error);
            }
        };

        window.addEventListener('cart-updated', updateCartBadge);

        onAuthStateChanged(auth, async (user) => {
            window.user_details = getUserDetails(user);
            window.dispatchEvent(new CustomEvent('auth-ready', { detail: window.user_details }));

            if (user) {
                try {
                    await upsertUserProfile(user);
                } catch (error) {
                    console.warn('Could not update user profile:', error);
                }

                if (user.photoURL) userImageButton.src = user.photoURL;
                popuptext.innerHTML = `logged in as <p style="font-size:13px;color:purple;">${user.displayName || user.email}</p>`;
                actionBtn.innerHTML = 'log out';
                cartLink?.classList.remove('hide');
                wishlistLink?.classList.remove('hide');
                await updateCartBadge();
                actionBtn.onclick = async () => {
                    await signOut(auth);
                    window.location.href = 'index.html';
                };
                return;
            }

            if (protectedPages.includes(currentPage)) {
                window.location.href = 'login.html';
                return;
            }

            setLoggedOutNav();
        });
    } catch (error) {
        console.warn('Firebase auth navigation is not ready yet:', error);
        if (protectedPages.includes(currentPage)) {
            actionBtn.onclick = () => {
                window.location.href = 'login.html';
            };
        }
    }
};

setupFirebaseAuthNav();
