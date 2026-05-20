import {
    auth,
    db,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    increment,
    limit,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
    writeBatch
} from './FirebaseConfig.js';

export const demoCategories = [
    { id: 'pizza', name: 'Pizza', slug: 'pizza', sortOrder: 1 },
    { id: 'pasta', name: 'Pasta', slug: 'pasta', sortOrder: 2 },
    { id: 'dessert', name: 'Dessert', slug: 'dessert', sortOrder: 3 },
    { id: 'drinks', name: 'Drinks', slug: 'drinks', sortOrder: 4 }
];

export const demoProducts = [
    {
        id: 'margherita-pizza',
        title: 'Margherita Pizza',
        categoryId: 'pizza',
        image_url: 'images/pizza-3.png',
        description: 'Classic tomato, mozzarella, basil, and olive oil.',
        discount_price: 2000,
        original_price: 2500,
        inStock: true,
        featured: true
    },
    {
        id: 'pepperoni-pizza',
        title: 'Pepperoni Pizza',
        categoryId: 'pizza',
        image_url: 'images/pizza-2.png',
        description: 'Crispy pepperoni, melted cheese, and rich pizza sauce.',
        discount_price: 3100,
        original_price: 3500,
        inStock: true,
        featured: true
    },
    {
        id: 'veggie-pizza',
        title: 'Veggie Pizza',
        categoryId: 'pizza',
        image_url: 'images/pizza-1.png',
        description: 'Fresh peppers, onions, olives, tomato, and mozzarella.',
        discount_price: 1500,
        original_price: 2000,
        inStock: true,
        featured: true
    },
    {
        id: 'creamy-pasta',
        title: 'Creamy Pasta',
        categoryId: 'pasta',
        image_url: 'images/menu-2.png',
        description: 'Creamy pasta with herbs, cheese, and house seasoning.',
        discount_price: 2500,
        original_price: 2800,
        inStock: true,
        featured: false
    },
    {
        id: 'sweet-dessert',
        title: 'Sweet Dessert',
        categoryId: 'dessert',
        image_url: 'images/menu-3.png',
        description: 'A light dessert to finish your meal.',
        discount_price: 1800,
        original_price: 2100,
        inStock: true,
        featured: false
    }
];

export const demoGalleryImages = [
    { src: 'images/gallery1.jpg', alt: 'Pizza gallery image 1' },
    { src: 'images/gallery2.jpg', alt: 'Pizza gallery image 2' },
    { src: 'images/gallery3.jpg', alt: 'Pizza gallery image 3' },
    { src: 'images/gallery4.jpg', alt: 'Pizza gallery image 4' },
    { src: 'images/gallery5.jpg', alt: 'Pizza gallery image 5' },
    { src: 'images/gallery6.jpg', alt: 'Pizza gallery image 6' },
    { src: 'images/gallery7.jpg', alt: 'Pizza gallery image 7' },
    { src: 'images/gallery8.jpg', alt: 'Pizza gallery image 8' },
    { src: 'images/gallery9.jpg', alt: 'Pizza gallery image 9' }
];

const serializeDoc = (snapshot) => ({ id: snapshot.id, ...snapshot.data() });

const withLocalProductImages = (products) => products.map((product) => ({
    ...product,
    image_url: product.image_url || 'images/pizza-1.png'
}));

export const getUserDetails = (user) => user ? {
    uid: user.uid,
    username: user.displayName || user.email,
    email: user.email,
    emailVerified: user.emailVerified,
    phoneNumber: user.phoneNumber,
    photoURL: user.photoURL
} : null;

export const upsertUserProfile = async (user) => {
    if (!user) return null;

    const userRef = doc(db, 'users', user.uid);
    const details = getUserDetails(user);
    const existingUser = await getDoc(userRef);

    await setDoc(userRef, {
        ...details,
        updatedAt: serverTimestamp(),
        createdAt: existingUser.exists() ? existingUser.data().createdAt : serverTimestamp()
    }, { merge: true });

    return details;
};

export const ensureDemoCatalog = async () => {
    const productsSnapshot = await getDocs(query(collection(db, 'products'), limit(1)));
    if (!productsSnapshot.empty) return;

    const batch = writeBatch(db);

    demoCategories.forEach((category) => {
        batch.set(doc(db, 'categories', category.id), {
            ...category,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        }, { merge: true });
    });

    demoProducts.forEach((product, index) => {
        batch.set(doc(db, 'products', product.id), {
            ...product,
            sortOrder: index + 1,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        }, { merge: true });
    });

    await batch.commit();
};

export const getCategories = async () => {
    try {
        await ensureDemoCatalog();
        const snapshot = await getDocs(query(collection(db, 'categories'), orderBy('sortOrder')));
        return snapshot.docs.map(serializeDoc);
    } catch (error) {
        console.warn('Using demo categories fallback:', error);
        return demoCategories;
    }
};

export const getProducts = async ({ categoryId, featured, searchTerm } = {}) => {
    try {
        await ensureDemoCatalog();
        const snapshot = await getDocs(query(collection(db, 'products'), orderBy('sortOrder')));
        let products = snapshot.docs.map(serializeDoc);

        if (categoryId) {
            products = products.filter((product) => product.categoryId === categoryId);
        }

        if (featured !== undefined) {
            products = products.filter((product) => product.featured === featured);
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            products = products.filter((product) => (
                product.title.toLowerCase().includes(term) ||
                product.description.toLowerCase().includes(term) ||
                product.categoryId.toLowerCase().includes(term)
            ));
        }

        return withLocalProductImages(products);
    } catch (error) {
        console.warn('Using demo products fallback:', error);
        const products = demoProducts.filter((product) => {
            if (categoryId && product.categoryId !== categoryId) return false;
            if (featured !== undefined && product.featured !== featured) return false;
            if (!searchTerm) return true;

            const term = searchTerm.toLowerCase();
            return product.title.toLowerCase().includes(term) ||
                product.description.toLowerCase().includes(term) ||
                product.categoryId.toLowerCase().includes(term);
        });

        return withLocalProductImages(products);
    }
};

export const getGalleryImages = async () => {
    return demoGalleryImages;
};

export const addCartItem = async (product, quantity = 1) => {
    const user = auth.currentUser;
    if (!user) {
        window.location.href = 'login.html';
        throw new Error('Please log in to add items to your cart.');
    }

    const itemRef = doc(db, 'carts', user.uid, 'items', product.id);
    const itemSnapshot = await getDoc(itemRef);

    if (itemSnapshot.exists()) {
        await updateDoc(itemRef, {
            quantity: increment(quantity),
            updatedAt: serverTimestamp()
        });
        window.dispatchEvent(new CustomEvent('cart-updated'));
        return;
    }

    await setDoc(itemRef, {
        productId: product.id,
        title: product.title,
        image_url: product.image_url,
        price: Number(product.discount_price),
        original_price: Number(product.original_price || product.discount_price),
        quantity,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
    window.dispatchEvent(new CustomEvent('cart-updated'));
};

export const getCartItems = async () => {
    const user = auth.currentUser;
    if (!user) return [];

    const snapshot = await getDocs(query(collection(db, 'carts', user.uid, 'items'), orderBy('createdAt')));
    return snapshot.docs.map(serializeDoc);
};

export const setCartItemQuantity = async (itemId, quantity) => {
    const user = auth.currentUser;
    if (!user) return;

    await updateDoc(doc(db, 'carts', user.uid, 'items', itemId), {
        quantity: Number(quantity),
        updatedAt: serverTimestamp()
    });
    window.dispatchEvent(new CustomEvent('cart-updated'));
};

export const removeCartItem = async (itemId) => {
    const user = auth.currentUser;
    if (!user) return;

    await deleteDoc(doc(db, 'carts', user.uid, 'items', itemId));
    window.dispatchEvent(new CustomEvent('cart-updated'));
};

export const getCartCount = async () => {
    const items = await getCartItems();
    return items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
};

export const addWishlistItem = async (product) => {
    const user = auth.currentUser;
    if (!user) {
        window.location.href = 'login.html';
        throw new Error('Please log in to use your wishlist.');
    }

    await setDoc(doc(db, 'wishlists', user.uid, 'items', product.id), {
        productId: product.id,
        title: product.title,
        image_url: product.image_url,
        price: Number(product.discount_price),
        original_price: Number(product.original_price || product.discount_price),
        description: product.description,
        categoryId: product.categoryId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    }, { merge: true });

    window.dispatchEvent(new CustomEvent('wishlist-updated'));
};

export const removeWishlistItem = async (productId) => {
    const user = auth.currentUser;
    if (!user) return;

    await deleteDoc(doc(db, 'wishlists', user.uid, 'items', productId));
    window.dispatchEvent(new CustomEvent('wishlist-updated'));
};

export const getWishlistItems = async () => {
    const user = auth.currentUser;
    if (!user) return [];

    const snapshot = await getDocs(query(collection(db, 'wishlists', user.uid, 'items'), orderBy('createdAt')));
    return snapshot.docs.map(serializeDoc);
};

export const getWishlistIds = async () => {
    const items = await getWishlistItems();
    return new Set(items.map((item) => item.productId || item.id));
};

export const createOrder = async ({ address, deliveryFee = 0 }) => {
    const user = auth.currentUser;
    if (!user) {
        window.location.href = 'login.html';
        throw new Error('Please log in before checkout.');
    }

    const items = await getCartItems();
    if (!items.length) throw new Error('Your cart is empty.');

    const subtotal = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
    const total = subtotal + Number(deliveryFee);
    const orderRef = doc(collection(db, 'orders'));
    const batch = writeBatch(db);

    batch.set(orderRef, {
        userId: user.uid,
        customer: getUserDetails(user),
        items,
        address,
        subtotal,
        deliveryFee: Number(deliveryFee),
        total,
        status: 'pending',
        paymentStatus: 'demo-pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });

    items.forEach((item) => {
        batch.delete(doc(db, 'carts', user.uid, 'items', item.id));
    });

    await batch.commit();
    window.dispatchEvent(new CustomEvent('cart-updated'));
    return { id: orderRef.id, total };
};
