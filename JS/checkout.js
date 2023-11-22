const queryString=window.location.search
const urlParams = new URLSearchParams(queryString)
const product_to_be_purchase=urlParams.get('item')
const cartDataString = localStorage.getItem(`item-${product_to_be_purchase}`);
const cartData = JSON.parse(cartDataString);
const total_price=urlParams.get('total')==0?cartData.discount_price:urlParams.get('total')
let cart_item_ids=JSON.parse(localStorage.getItem(`ids`))
let orderData;

const cart_section=document.querySelector('.cart-section')
cart_section.innerHTML=`
    <div class="product-list">
        <p class="section-heading">${cartData.title}</p>
        <div class="cart">
            <div class="cart-item cart-column">
                <img class="cart-item-image" src="${cartData.image_url}" width="100" height="100">
            </div>
            <div style="font-size:15px;">
                <span>item: ${cartData.title}</span>
                <p><span>Quantity: </span><span>${total_price/cartData.discount_price}</span></p>
                <p>Price: Ksh. ${cartData.discount_price}</p>
                <p>Total price: Ksh. ${total_price}</p>
            </div>
        </div>
    </div>
    <div class="checkout-section">
        <div class="checkout-box">
            <p class="text">your total bill</p>
            <h2 class="bill">Ksh. ${total_price}</h2>
            <button class="place-order-btn">place order</button>
        </div>
    </div>
`

const placeOrderBtn = document.querySelector('.place-order-btn');
placeOrderBtn.addEventListener('click', () => {
    // Get address from the checkout form
    let address = getAddress();

    console.log(address)
    // Check if address is available
    if (address) {
        // Fetch cart data from local storage

        // Check if cart data is available
        if (!cartDataString) {
            console.error('Cart data is missing or undefined.');
            // Handle the error or display an appropriate message
        } else {
            try {
                // Proceed with the rest of your code
                orderData = {
                    order: cartData,
                    add: address,
                };

                // Save order data to local storage (simulate server-side storage)
                localStorage.setItem('order', JSON.stringify(orderData));

                // Display success alert
                alert('Order placed successfully', 'success');

                //remote the items and redirects to /index.html
                remove_item_from_localStorage(product_to_be_purchase)
            } catch (error) {
                console.error('Error parsing JSON:', error);
                // Handle the JSON parsing error or display an appropriate message
            }
        }
    }
});

const remove_item_from_localStorage=(item_id)=>{
    let updated_cart_item_ids=[]
    localStorage.removeItem(`item-${product_to_be_purchase}`);
    cart_item_ids.forEach((id)=>{
        if (id!=item_id) {
            updated_cart_item_ids.push(id)
        }
        if(cart_item_ids.length<2&&!localStorage.getItem('order')){
            localStorage.clear()
        }else if(cart_item_ids.length<2&&localStorage.getItem('order')){
            localStorage.removeItem('ids')
        }else{
            localStorage.setItem('ids',JSON.stringify(updated_cart_item_ids))
        }
        // Redirect to the index page
        window.location.href = 'index.html';
    })
}


const getAddress = () => {
    //validation
    let address = document.querySelector('#address').value;
    let street = document.querySelector('#street').value;
    let city = document.querySelector('#city').value;
    let state = document.querySelector('#state').value;
    let zipcode = document.querySelector('#zipcode').value;
    let landmark = document.querySelector('#landmark').value;

    if(!address.length || !street.length || !city.length || !state.length || !zipcode.length || !landmark.length){
        return alert('fill all the inputs first');
    } else {
        return { address, street, city, state, zipcode, landmark};
    }
}