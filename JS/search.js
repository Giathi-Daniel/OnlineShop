const searchKey = decodeURI(location.pathname.split('/').pop());

const searchSpanElement = document.querySelector('#search-key');
searchSpanElement.innerHTML = searchKey;

if (typeof getProducts === 'function' && typeof createProductCards === 'function') {
    getProducts(searchKey).then(data => createProductCards(data, '.card-container'));
}
