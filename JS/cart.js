console.log("Here 2")

let cart_item_ids=JSON.parse(localStorage.getItem(`ids`))
let total=0

const remove_item_from_ids=(item_id)=>{
    let updated_cart_item_ids=[]
    cart_item_ids.forEach((id)=>{
        if (id!=item_id) {
            updated_cart_item_ids.push(id)
        }
        if(cart_item_ids.length<2){
            localStorage.clear()
        }else{
            localStorage.setItem('ids',JSON.stringify(updated_cart_item_ids))
        }
        window.location.reload()
    })
}

function purchaseClicked(e) {
    var buttonClicked = document.getElementById(`item-${e.target.value}`);
    //redirect to the checkout page
    window.location.href = `checkout.html?item=${e.target.value}&total=${total}`;
}

function removeCartItem(e) {
    var buttonClicked = document.getElementById(`item-${e.target.value}`);
    localStorage.removeItem(`item-${e.target.value}`);
    remove_item_from_ids(e.target.value);
    updateCart(); // Add a function to update the entire cart display
}

function quantityChanged(e, discount_price, id) {
    var input = e.target.value;
    if (isNaN(input) || input <= 0) {
        input = 1;
    }
    updateCartTotal(input, discount_price, id);
}

if(!localStorage.getItem('ids')){
    var cartItems = document.getElementsByClassName('cart-items')[0]
    cartItems.innerHTML=`
        <div style="display: flex; justify-content: center; align-items: center; margin:100px auto;">
            <p style="font-weight:600; font-size:30px; color:gray;">No items in cart</p>
        </div>
    `
}else{
    cart_item_ids.forEach(id => {
        let cart_item=JSON.parse(localStorage.getItem(`item-${id}`))
    
        var cartRow = document.createElement('div')
        cartRow.classList.add('cart-row')
        var cartItems = document.getElementsByClassName('cart-items')[0]
        var cartRowContents = `
            <div class="cart-item cart-column">
                <img class="cart-item-image" src="${cart_item.image_url}" width="100" height="100">
                <span class="cart-item-title">${cart_item.title}</span>
            </div>
            <span class="cart-price cart-column">Ksh. ${cart_item.discount_price}</span>
            <div class="cart-quantity cart-column">
                <input class="cart-quantity-input" type="number" name="quantity">
            </div>
            <div class="cart-total" id='item-${cart_item.id}'>
                <strong>Total:</strong> <span class="cart-total-price" id="${cart_item.id}">Ksh. ${cart_item.discount_price}</span>
            </div>
            <button class="btn btn-danger" value='${cart_item.id}' type="button">REMOVE</button>
            <button class="btn btn-purchase" value='${cart_item.id}'>Purchase</button>
            `
        cartRow.innerHTML += cartRowContents
        cartItems.append(cartRow)
        cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
        cartRow.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
        cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change',(e)=> quantityChanged(e,cart_item.discount_price,cart_item.id))
    });
}
function updateCart() {
    var cartItems = document.getElementsByClassName('cart-items')[0];
    cartItems.innerHTML = '';

    if(!localStorage.getItem('ids')){
        var cartItems = document.getElementsByClassName('cart-items')[0]
        cartItems.innerHTML=`
            <div style="display: flex; justify-content: center; align-items: center; margin:100px auto;">
                <p style="font-weight:600; font-size:30px; color:gray;">No items in cart</p>
            </div>
        `
    }else{
        cart_item_ids.forEach(id => {
            let cart_item=JSON.parse(localStorage.getItem(`item-${id}`))
        
            var cartRow = document.createElement('div')
            cartRow.classList.add('cart-row')
            var cartItems = document.getElementsByClassName('cart-items')[0]
            var cartRowContents = `
                <div class="cart-item cart-column">
                    <img class="cart-item-image" src="${cart_item.image_url}" width="100" height="100">
                    <span class="cart-item-title">${cart_item.title}</span>
                </div>
                <span class="cart-price cart-column">Ksh. ${cart_item.discount_price}</span>
                <div class="cart-quantity cart-column">
                    <input class="cart-quantity-input" type="number" name="quantity">
                </div>
                <div class="cart-total" id='item-${cart_item.id}'>
                    <strong>Total:</strong> <span class="cart-total-price" id="${cart_item.id}">Ksh. ${cart_item.discount_price}</span>
                </div>
                <button class="btn btn-danger" value='${cart_item.id}' type="button">REMOVE</button>
                <button class="btn btn-purchase" value='${cart_item.id}'>Purchase</button>
                `
            cartRow.innerHTML += cartRowContents
            cartItems.append(cartRow)
            cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
            cartRow.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
            cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change',(e)=> quantityChanged(e,cart_item.discount_price,cart_item.id))
        });
    }
}


function updateCartTotal(input,discount_price,id) {
    total = input*discount_price
    document.getElementById(`${id}`).innerText = 'Ksh. ' + total
}