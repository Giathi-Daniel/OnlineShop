import { getGalleryImages } from './firebaseStore.js';

const galleryContainer = document.querySelector('.gallery .gallery-container');

const renderGallery = async () => {
    if (!galleryContainer) return;

    galleryContainer.innerHTML = '<p style="font-size:18px;color:gray;">Loading gallery...</p>';
    const images = await getGalleryImages();

    galleryContainer.innerHTML = images.map((image) => `
        <a href="${image.src}" class="box">
            <img src="${image.src}" alt="${image.alt}">
            <div class="icon"><i class="fas fa-plus"></i></div>
        </a>
    `).join('');

    if (typeof lightGallery === 'function') {
        lightGallery(galleryContainer);
    }
};

renderGallery();
