import { auth, app,TwitterAuthProvider,signInWithPopup } from "./FirebaseConfig.js";

const provider = new TwitterAuthProvider(app);

const twitterLogin = document.querySelector(".twitterLogin");
twitterLogin.addEventListener("click", function(){
    signInWithPopup(auth, provider)
    .then((result) => {
        // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
        // You can use these server side with your app's credentials to access the Twitter API.
        const credential = TwitterAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // const secret = credential.secret;

        // The signed-in user info.
        const user = result.user;
        alert(`Welcome ${user.displayName}`);
        window.location.href="/index.html"
        // let user_details = {
        //     accessToken: user.accessToken,
        //     username: user.displayName,
        //     email: user.email,
        //     emailVerified: user.emailVerified,
        //     phoneNumber: user.phoneNumber,
        //     photoUrl: user.photoUrl,
        //     userId: user.uid
        // }

        // sessionStorage.setItem('user_details',JSON.stringify(user_details))
        
        
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = TwitterAuthProvider.credentialFromError(error);
        
        alert(`${errorCode}: ${errorMessage}`)
    });
})


