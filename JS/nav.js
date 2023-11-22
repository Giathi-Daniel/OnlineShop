let user_details=sessionStorage.getItem('user_details')?JSON.parse(sessionStorage.getItem('user_details')):null
const createNav = () => {
    let nav = document.querySelector('.navbar');
    nav.innerHTML = `
        <div class="nav">
            <a href="index.html" class="logo"> <i class="fas fa-pizza-slice"></i> pizza</a>
            <div class="nav-items">
                <div class="search">
                    <input type="text" class="search-box" placeholder="search pizza">
                    <button class="search-btn">Search</button>
                </div>
                <a>
                    ${user_details?`<img alt='user image' src='${user_details.photoURL===null?'images/user.jpeg':user_details.photoURL}' id='user-img'/>`:("<img src='images/user.jpeg' id='user-img'/>")}
                    <div class="login-logout-popup hide">
                        <p class="account-info">Log in as, name</p>
                        <button class="btn" id="user-btn">Log out</button>
                    </div>
                </a>
                ${user_details?`<a href="cart.html" class="fas fa-shopping-cart Cart" style="inline-size: 30px; font-size: 30px;"></a>`:''}
            </div>
        </div>
        <!-- <hr style="inline-size: 100%;"> -->
        <ul class="links-container">
            <li class="link-item"><a href="index.html" class="link">home</a></li>
            <li class="link-item"><a href="about.html" class="link">about</a></li>
            <li class="link-item"><a href="menu.html" class="link">menu</a></li>
            <li class="link-item"><a href="gallery.html" class="link">gallery</a></li>
            <li class="link-item"><a href="contact.html" class="link">contact</a></li>
        </ul>
    `;
}

createNav();

//nav popup
const userImageButton = document.querySelector('#user-img');
const userPopup = document.querySelector('.login-logout-popup');
const popuptext = document.querySelector('.account-info');
const actionBtn = document.querySelector('#user-btn');

userImageButton.addEventListener('click', () => {
  userPopup.classList.toggle('hide');
})

console.log(window.location.pathname)
window.onload = () => {
  if(user_details){
    //means user logged in
    popuptext.innerHTML = `logged in as <p style="font-size:13px;color:purple;">${user_details.username}</p>`;
    actionBtn.innerHTML = 'log out';
    actionBtn.addEventListener('click', () => {
      sessionStorage.clear();
      location.reload();
    })
  } else if(window.location.pathname!=="/index.html"&&user_details===null){
    window.location.href="/index.html"
  }else {
    //user logged out
    popuptext.innerHTML = 'log in to place order';
    actionBtn.innerHTML = 'log in';
    actionBtn.addEventListener('click', () => {
      location.href = '/login.html';
    })
  }
}