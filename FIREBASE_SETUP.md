# Firebase Setup

## Config

Replace the placeholder values in `JS/env.js` with the Firebase web app config from Project settings.

## Images

This demo uses local images from the `images/` folder so it can stay on the free Firebase plan.

Product documents should use local paths like:

- `images/pizza-3.png`
- `images/pizza-2.png`
- `images/pizza-1.png`
- `images/menu-2.png`
- `images/menu-3.png`

Gallery images also load from the local `images/` folder:

- `images/gallery1.jpg`
- `images/gallery2.jpg`
- `images/gallery3.jpg`
- `images/gallery4.jpg`
- `images/gallery5.jpg`
- `images/gallery6.jpg`
- `images/gallery7.jpg`
- `images/gallery8.jpg`
- `images/gallery9.jpg`

## Hosting

This is a static multi-page site. Keep `cleanUrls` disabled unless you also add explicit rewrites for every page.

Do not add a blanket rewrite like this:

```json
{ "source": "**", "destination": "/index.html" }
```

That rewrite is what makes pages like `gallery.html` appear to route back to the homepage.

## Checkout

The current checkout is cash-on-delivery. Orders are saved in Firestore under `orders`.

The cart and wishlist are saved per signed-in user:

- `carts/{userId}/items`
- `wishlists/{userId}/items`

For online payments, call a Firebase Cloud Function from the frontend. Keep M-Pesa, Stripe, or PayPal secrets in Cloud Functions environment config, never in browser JavaScript.

The starter function is in `functions/index.js`. It validates the signed-in user and order ownership before creating a payment request. Replace the placeholder response with the real provider call when adding M-Pesa, Stripe, or PayPal.
