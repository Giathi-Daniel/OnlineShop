const createFooter = () => {
    let footer = document.querySelector('.footer');

    footer.innerHTML = `
        <div class="box-container">
            <div class="box">
                <h3>find us here</h3>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo ad</p>
            </div>
            <div class="box">
                <h3>contact us</h3>
                <p>+254-700-111-000</p>
                <p>pizzaonline@gmail.com</p>
            </div>
            <div class="box">
                <h3>localization</h3>
                <p>112 Main Street</p>
            </div>
        </div>`;
}

createFooter();
