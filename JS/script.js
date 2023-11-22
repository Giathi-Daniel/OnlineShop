var swiper = new Swiper('.home-slider', {
  autoplay:{
    delay:7500,
    disableOnInteraction:false,
  },
  grabCursor:true,
  loop: true,
  centeredSlides:true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});


var swiper = new Swiper(".menu-slider", {
  grabCursor:true,
  loop: true,
  autoHeight:true,
  centeredSlides:true,
  spaceBetwwen:20,
  pagination: {
    el: '.swiper-pagination',
    clickable:true,
  },
});
  
  let previewContainer = document.querySelector('.menu-preview-container');
  let previewBox = previewContainer.querySelectorAll('.menu-preview');
  
  document.querySelectorAll('.menu .box').forEach(menu =>{
    menu.onclick = () =>{
      previewContainer.style.display = 'flex';
      let name = menu.getAttribute('data-name');
      previewBox.forEach(preview =>{
        let target = preview.getAttribute('data-target');
        if(name == target){
          preview.classList.add('active');
        }
      });
    };
  });
  
  previewContainer.querySelector('#close').onclick = () =>{
    previewContainer.style.display = 'none';
    previewBox.forEach(close =>{
      close.classList.remove('active');
    });
  };
  
  const setupSlidingEffect = () => {
      const productContainers = [...document.querySelectorAll('.product-container')];
      const nxtBtn = [...document.querySelectorAll('.nxt-btn')];
      const preBtn = [...document.querySelectorAll('.pre-btn')];
  
      productContainers.forEach((item, i) => {
        let containerDimensions = item.getBoundingClientRect();
        let containerWidth = containerDimensions.width;
  
        nxtBtn[i].addEventListener('click', () => {
          item.scrollLeft += containerWidth;
        })
  
        preBtn[i].addEventListener('click', () => {
          item.scrollLeft -= containerWidth;
        })
      })
  }
  
  //fetch product cards
  // const getProducts = (tag) => {
  //   return fetch('/get-products', {
  //     method: "post",
  //     headers: new Headers({'Content-Type': 'application/json'}),
  //     body: JSON.stringify({tag: tag})
  //   })
  //   .then(res => res.json())
  //   .then(data => {
  //     return data;
  //   })
  // }
  
  //create products slider
  // const createProductSlider = (data, parent, title) => {
  //   let slideContainer = document.querySelector(`${parent}`);
  
  //   slideContainer.innerHTML +=  `
  //   <section class="product">
  //     <h2 class="product-category">${title}</h2>
  //     <button class="pre-btn"><i class="fa fa-arrow-left"></i></button>
  //     <button class="nxt-btn"><i class="fa fa-arrow-right"></i></button>
  //     ${createProductCards(data)}
  //   </section>
  //   `
  //   setupSlidingEffect();
  // }
  
  //const createProductCards = (data, parent) => {
    //search product
  //   let start = '<div class="product-card">';
  //   let middle = '';//card html
  //   let end = '</div>';
  
  //   for(let i = 0; i < data.length; i++){
  //       if(data[i].id != decodeURI(location.pathname.split('/').pop())){
  //         middle += `
  //         <div class="product-card">
  //           <div class="product-image">
  //             <span class="discount-tag">${data[i].discount}% off</span>
  //             <img src="${data[i].images[0]}" class="product-thumb">
  //           </div>
  //           <div class="product-info" onclick="location.href='/products/${data[i].id}'">
  //               <h4 class="product-brand">${data[i].name}</h4>
  //               <p class="product-short-des">${data[i].shortDes}</p>
  //               <span class="price">Ksh${data[i].sellPrice}</span> <span class="actual-price">Ksh${data[i].actualPrice}</span>
  //           </div>
  //         </div>
  //         `
  //       }
  //   }
  
  //   if(parent){
  //     let cardContainer = document.querySelector(parent);
  //     cardContainer.innerHTML = start + middle + end;
  //   } else{
  //     return start + middle + end;
  //   }
  // }
  
  // const add_product_to_cart = (type, product) => {
  //   let data = JSON.parse(locationStorage.getItem(type));
  //   if(data == null){
  //     data = [];
  //   }
     
  //   product = {
  //     item: 1,
  //     name: product.name,
  //     sellPrice: product.sellPrice,
  //     size: size || null,
  //     shortDes: product.shortDes,
  //     image: product.images[0]
  //   }
  
  //   data.push(product);
  //   localStorage.setItem(type, JSON.stringify(data));
  //   return 'added';
  // }
  
  //seaarch box
  // const searchBtn = document.querySelector('.search-btn');
  // const searchBox = document.querySelector('.search-box');
  // searchBtn.addEventListener('click', () => {
  //   if(searchBox.value.length){
  //     location.href = `/search/${searchBox.value}`
  //   }
  // })