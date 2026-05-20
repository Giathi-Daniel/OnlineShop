const ensureToastRoot = () => {
    let root = document.querySelector('.toast-container');
    if (root) return root;

    root = document.createElement('div');
    root.className = 'toast-container';
    document.body.append(root);
    return root;
};

export const showToast = (message, type = 'success') => {
    const root = ensureToastRoot();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-dot"></span>
        <p>${message}</p>
        <button type="button" aria-label="Dismiss notification">&times;</button>
    `;

    root.append(toast);

    const dismiss = () => {
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 220);
    };

    toast.querySelector('button').addEventListener('click', dismiss);
    setTimeout(dismiss, 3600);
};
