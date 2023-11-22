import {auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from './FirebaseConfig.js'

//redirect to homeomepage if user logged in
let user_details={}
window.onload = () => {
    if(sessionStorage.getItem("user_details")){
        user_details = JSON.parse(sessionStorage.getItem("user_details"));
        if(user_details.accessToken){
            window.location.href="index.html"
        }
    }
}

const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const handleSubmit = document.querySelector('form');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

handleSubmit.addEventListener('submit', (e) => {
    e.preventDefault()
    const name = document.querySelector('#name') || null;
    const email = document.querySelector('#email');
    const password = document.querySelector('#password');
    if(name != null){
        if(name.value.length < 3){
            alert('name must be 3 letters long');
        } else if(!email.value.length){
            alert('enter your email')
        } else if(password.value.length < 8){
            alert('password should be 8 letters long');
        } else{
            registerNewUser({
                name: name.value,
                email: email.value,
                password: password.value,
                seller: false
            })
        }
    } else{
        if(!email.value.length || !password.value.length){
            alert('fill all the inputs')
        } else{
            loginUser(email.value,password.value)
        }
    }
})

function registerNewUser({name,email,password,seller}) {
    createUserWithEmailAndPassword(auth, email, password, name, seller)
    .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        console.log(user)
        let user_details={
            accessToken:user.accessToken,
            username:user.displayName===null?user.email:user.displayName,
            email:user.email,
            emailVerified:user.emailVerified,
            phoneNumber:user.phoneNumber,
            photoURL:user.photoURL,
            userId:user.uid
        }

        sessionStorage.setItem('user_details',JSON.stringify(user_details))
        alert(`Welcome ${user.email}`);
        window.location.href="index.html";
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        alert(`${errorCode}: ${errorMessage}`)
    });
}

function loginUser(email,password) {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user)
        let user_details={
            accessToken:user.accessToken,
            username:user.displayName===null?user.email:user.displayName,
            email:user.email,
            emailVerified:user.emailVerified,
            phoneNumber:user.phoneNumber,
            photoURL:user.photoURL,
            userId:user.uid
        }

        sessionStorage.setItem('user_details',JSON.stringify(user_details))
        alert(`Welcome ${user.email}`);
        window.location.href="/index.html"
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if(errorCode.includes("invalid")){
            alert("You've enter invalid credentials, try again!")
        }else{
            alert(`${errorCode}`)
        }
    });
}