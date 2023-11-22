import { app, auth, FacebookAuthProvider,  signInWithPopup } from "./FirebaseConfig.js";

const provider = new FacebookAuthProvider(app);

const facebookLogin = document.querySelector(".facebookLogin");
facebookLogin.addEventListener("click", function(){
    signInWithPopup(auth, provider)
    .then((result) => {
        // The signed-in user info.
        const user = result.user;

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;

       
    })
    .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = FacebookAuthProvider.credentialFromError(error);

        // ...
    });
})


//         let user_details={
//             accessToken:user.accessToken,
//             username:user.displayName,
//             email:user.email,
//             emailVerified:user.emailVerified,
//             phoneNumber:user.phoneNumber,
//             photoURL:user.photoURL,
//             userId:user.uid
//         }

//         sessionStorage.setItem('user_details',JSON.stringify(user_details))
//         alert(`Welcome ${user.displayName}`);
//         window.location.href="/index.html"


// alert(`${errorCode}: ${errorMessage}`)