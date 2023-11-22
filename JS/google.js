import { auth, app, GoogleAuthProvider,  signInWithRedirect, getRedirectResult, signInWithPopup } from "./FirebaseConfig.js";

const provider = new GoogleAuthProvider(app);
const googleLogin = document.querySelector(".googleLogin");
googleLogin.addEventListener("click", function(){
    signInWithPopup(auth, provider)
    .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        let user_details={
            accessToken:user.accessToken,
            username:user.displayName,
            email:user.email,
            emailVerified:user.emailVerified,
            phoneNumber:user.phoneNumber,
            photoURL:user.photoURL,
            userId:user.uid
        }

        sessionStorage.setItem('user_details',JSON.stringify(user_details))
        alert(`Welcome ${user.displayName}`);
        window.location.href="/index.html"
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);

        alert(`${errorCode}: ${errorMessage}`)
    });
})
