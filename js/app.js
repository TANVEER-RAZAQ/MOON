const products = {
    saffron: {
        title: "Red Jewel.",
        subtitle: "The world's most precious spice.",
        theme: "saffron",
        color: "#E53935",
        desc: "Hand-picked from the autumn fields of Pampore. Each strand is a testament to patience and purity, bringing vibrant color and aroma.",
        price: "₹850",
        details: "Mongra A++<br>Deep Red Stigmas"
    },
    honey: {
        title: "Liquid Gold.",
        subtitle: "Vitamin-packed purity from the Sidr valleys.",
        theme: "honey",
        color: "#FFB347",
        desc: "Our Sidr Honey is harvested from the sacred Lote trees of Yemen. Known for potent antimicrobial properties and rich, caramel-like taste.",
        price: "₹1500",
        details: "Top Grade Sidr<br>100% Organic"
    },
    shilajit: {
        title: "Mountain Strength.",
        subtitle: "Pure Himalayan Resin.",
        theme: "shilajit",
        color: "#1a1a1a",
        desc: "Sourced from high-altitude rocks of the Himalayas. Rich in fulvic acid and trace minerals, boosting energy, immunity, and focus naturally.",
        price: "₹1999",
        details: "Gold Grade Resin<br>High Potency"
    }
};

const productKeys = Object.keys(products);
let currentIndex = 0;

// Elements
const heroSection = document.getElementById('hero');
const heroTitle = document.getElementById('hero-title');
const heroSubtitle = document.getElementById('hero-subtitle');
const heroImage = document.getElementById('hero-image');
const pillBtns = document.querySelectorAll('.pill-btn');

// Detail Section Elements
const detailTitle = document.getElementById('detail-title');
const detailDesc = document.getElementById('detail-desc');
const detailPrice = document.getElementById('detail-price');
const detailCardContent = document.getElementById('detail-card-content');
const headingColor = document.querySelector('.section-heading');

// Cart State
let cart = [];
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeCartBtn = document.querySelector('.close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.querySelector('.checkout-btn');

// Initialize
updateView(productKeys[0]);

// --- Event Listeners ---

// Pill Navigation
pillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const key = btn.dataset.product;
        currentIndex = productKeys.indexOf(key);
        updateView(key);
    });
});

// Arrow Navigation
document.getElementById('prev-btn').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + productKeys.length) % productKeys.length;
    updateView(productKeys[currentIndex]);
});

document.getElementById('next-btn').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % productKeys.length;
    updateView(productKeys[currentIndex]);
});

// Cart Interactions
cartBtn.addEventListener('click', toggleCart);
closeCartBtn.addEventListener('click', toggleCart);
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) toggleCart();
});

document.querySelectorAll('.add-btn, .purchase-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const cardBody = e.target.closest('.product-card') || e.target.closest('.text-side');
        let title, price;

        if (cardBody && cardBody.classList.contains('product-card')) {
            title = cardBody.querySelector('h3').textContent;
            price = parseInt(cardBody.querySelector('.price').textContent.replace('₹', ''));
        } else {
            // Main hero product add
            title = document.getElementById('detail-title').textContent;
            price = parseInt(document.getElementById('detail-price').textContent.replace('₹', ''));
        }

        addToCart({ title, price });

        // Button Feedback
        const originalText = e.target.textContent;
        e.target.textContent = "Added!";
        e.target.style.background = "#4CAF50";
        setTimeout(() => {
            e.target.textContent = originalText;
            e.target.style.background = "";
        }, 1500);
    });
});

checkoutBtn.addEventListener('click', () => {
    if (cart.length > 0) {
        alert('Thank you for your order! This is a demo.');
        cart = [];
        updateCartUI();
        toggleCart();
    } else {
        alert('Your cart is empty.');
    }
});


// --- Functions ---

function updateView(key) {
    const product = products[key];

    // 1. Update Global Theme
    document.body.dataset.theme = product.theme;

    // Ensure hero bg inherits transparency or correct color if needed, 
    // but typically the theme change on body handles it via CSS vars.

    // Animate Text
    heroTitle.style.animation = 'none';
    heroTitle.offsetHeight; // reflow
    heroTitle.style.animation = 'slideUpFade 0.6s forwards';
    heroTitle.textContent = product.title;

    heroSubtitle.style.animation = 'none';
    heroSubtitle.offsetHeight;
    heroSubtitle.style.animation = 'slideUpFade 0.6s 0.1s forwards';
    heroSubtitle.textContent = product.subtitle;

    // 2. Update Visuals (Storytelling for all products)
    const storyCanvas = document.getElementById('story-frame-canvas');
    const visualContainer = document.getElementById('hero-visual-container');

    if (key === 'honey' || key === 'saffron' || key === 'shilajit') {
        if (storyCanvas) storyCanvas.style.display = 'block';
        if (visualContainer) visualContainer.style.display = 'none';

        if (window.storytellingEngine) {
            window.storytellingEngine.setProduct(key);
        }
    } else {
        if (storyCanvas) storyCanvas.style.display = 'none';
        if (visualContainer) visualContainer.style.display = 'block';

        // Visual Placeholder (Original Theme Logic for other products)
        let gradientStyle = "";
        heroImage.innerHTML = `
            <div style="
                width: 350px; height: 350px;
                background: ${gradientStyle};
                border-radius: 50%;
                box-shadow: 0 20px 50px rgba(0,0,0,0.3), inset 0 0 60px rgba(0,0,0,0.2);
                display: flex; justify-content: center; align-items: center;
                font-size: 2rem; font-weight: 800; color: rgba(255,255,255,0.2);
                text-transform: uppercase;
                animation: float 4s ease-in-out infinite;
                text-shadow: 0 2px 10px rgba(0,0,0,0.2);
            ">
                ${key}
            </div>
        `;
    }

    // 3. Update Pills
    pillBtns.forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-product="${key}"]`)?.classList.add('active');

    // 3. Update Detail Section
    detailTitle.textContent = product.title;
    detailDesc.textContent = product.desc;
    detailPrice.textContent = product.price;
    detailCardContent.innerHTML = product.details;

    if (headingColor) headingColor.style.color = product.color;

    // Update Arrow Colors
    document.querySelectorAll('.nav-arrow').forEach(btn => {
        btn.style.backgroundColor = product.color;
        btn.style.filter = "brightness(0.8)";
    });
}

function addToCart(item) {
    cart.push(item);
    updateCartUI();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function toggleCart() {
    cartModal.classList.toggle('hidden');
}

function updateCartUI() {
    cartBtn.textContent = `Cart (${cart.length})`;

    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
        cartTotal.textContent = '₹0';
        return;
    }

    cart.forEach((item, index) => {
        total += item.price;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div>
                <h4>${item.title}</h4>
                <small>₹${item.price}</small>
            </div>
            <button onclick="removeFromCart(${index})" style="background:none;border:none;color:red;cursor:pointer;">&times;</button>
        `;
        cartItemsContainer.appendChild(div);
    });

    cartTotal.textContent = `₹${total}`;
}

// Make global so onclick works
window.removeFromCart = removeFromCart;
