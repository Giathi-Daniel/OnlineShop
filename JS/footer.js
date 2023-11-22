const createFooter = () => {
    let footer = document.querySelector('.footer');

    footer.innerHTML = `
        <div class="box-container">
            <div class="box">
                <h3>find us here</h3>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo ad</p>
                <div class="share">
                    <a href="#" class="fab fa-facebook-f"></a>
                    <a href="#" class="fab fa-twitter"></a>
                    <a href="#" class="fab fa-instagram"></a>
                    <a href="#" class="fab fa-linkedin"></a>
                </div>
            </div>
            <div class="box">
                <h3>contact us</h3>
                <p>+254-716-738-500</p>
                <a href="#" class="link">giathidaniel252@gmail.com</a>
            </div>
            <div class="box">
                <h3>localization</h3>
                <p>112 street Ruiru Kenya</p>
            </div>
        </div>
        <div class="credit">created by <span>BlackShark</span> | all rights reserved!</div>`;
}

createFooter();