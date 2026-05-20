import { auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from './FirebaseConfig.js';
import { upsertUserProfile } from './firebaseStore.js';
import { showToast } from './toast.js';

let isSubmitting = false;

onAuthStateChanged(auth, (user) => {
    if (user && !isSubmitting) window.location.href = 'index.html';
});

const handleSubmit = document.querySelector('form');

handleSubmit.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.querySelector('#name');
    const email = document.querySelector('#email');
    const password = document.querySelector('#password');

    if (name) {
        if (name.value.trim().length < 3) {
            showToast('Name must be at least 3 letters long.', 'error');
            return;
        }

        if (!email.value.length) {
            showToast('Enter your email.', 'error');
            return;
        }

        if (password.value.length < 8) {
            showToast('Password should be at least 8 characters long.', 'error');
            return;
        }

        await registerNewUser({
            name: name.value.trim(),
            email: email.value.trim(),
            password: password.value
        });
        return;
    }

    if (!email.value.length || !password.value.length) {
        showToast('Fill all the inputs.', 'error');
        return;
    }

    await loginUser(email.value.trim(), password.value);
});

async function registerNewUser({ name, email, password }) {
    try {
        isSubmitting = true;
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        await upsertUserProfile(auth.currentUser);

        showToast(`Welcome ${auth.currentUser.email}`);
        window.location.href = 'index.html';
    } catch (error) {
        isSubmitting = false;
        showToast(`${error.code}: ${error.message}`, 'error');
    }
}

async function loginUser(email, password) {
    try {
        isSubmitting = true;
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await upsertUserProfile(userCredential.user);

        showToast(`Welcome ${userCredential.user.email}`);
        window.location.href = 'index.html';
    } catch (error) {
        isSubmitting = false;
        if (error.code.includes("invalid")) {
            showToast("You've entered invalid credentials, try again!", 'error');
        } else {
            showToast(`${error.code}: ${error.message}`, 'error');
        }
    }
}
