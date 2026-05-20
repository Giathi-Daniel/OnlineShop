import { auth, app, GoogleAuthProvider, signInWithPopup } from "./FirebaseConfig.js";
import { upsertUserProfile } from "./firebaseStore.js";
import { showToast } from "./toast.js";

const provider = new GoogleAuthProvider(app);
const googleLogin = document.querySelector(".googleLogin");
googleLogin.addEventListener("click", function(){
    signInWithPopup(auth, provider)
    .then((result) => {
        return upsertUserProfile(result.user).then(() => result.user);
    }).then((user) => {
        showToast(`Welcome ${user.displayName || user.email}`);
        window.location.href = "index.html";
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        showToast(`${errorCode}: ${errorMessage}`, 'error')
    });
})
