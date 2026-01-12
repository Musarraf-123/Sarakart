console.log("script.js LOADED");

// ============ PRODUCT DATA ============

// Electronics
// ============ PRODUCT DATA (with localStorage) ============

// 🔹 Default data – agar localStorage khali ho to yahi use hoga
const DEFAULT_ELECTRONICS = [
  {
    title: "Realme Narzo 70 5G (Blue, 6GB RAM, 128GB Storage)",
    price: "13,999",
    mrp: "17,999",
    discount: "22% off",
    tag: "Best Seller",
    image: "image/narzo.jpg",
  },
  {
    title: "boAt Rockerz 450 Bluetooth Headset",
    price: "1,199",
    mrp: "3,990",
    discount: "69% off",
    tag: "Top Rated",
    image: "image/boat450.jpg",
  },
  {
    title: "Lenovo 15.6 inch Laptop Backpack",
    price: "799",
    mrp: "1,999",
    discount: "60% off",
    tag: "Hot Deal",
    image: "image/lenovo-bag.jpg",
  },
  {
    title: "Samsung 80 cm (32 inch) HD Ready Smart TV",
    price: "12,499",
    mrp: "17,990",
    discount: "30% off",
    tag: "Limited Stock",
    image: "image/samsung-tv.jpg",
  },
  {
    title: "HP Wireless Keyboard and Mouse Combo",
    price: "999",
    mrp: "1,999",
    discount: "50% off",
    tag: "Daily Use",
    image: "image/hp-combo.jpg",
  },
];

const DEFAULT_FASHION = [
  {
    title: "Men's Regular Fit Printed T-Shirt",
    price: "499",
    mrp: "1,299",
    discount: "61% off",
    tag: "Trending",
    image: "image/tshirt.jpg",
  },
  {
    title: "Women's Anarkali Kurta with Dupatta",
    price: "899",
    mrp: "2,199",
    discount: "59% off",
    tag: "Best Seller",
    image: "image/kurta.jpg",
  },
  {
    title: "Casual Sneakers for Men",
    price: "999",
    mrp: "2,499",
    discount: "60% off",
    tag: "Hot Deal",
    image: "image/sneaker.jpg",
  },
  {
    title: "Silk Saree with Blouse Piece",
    price: "1,299",
    mrp: "3,999",
    discount: "67% off",
    tag: "Festive Offer",
    image: "image/saree.jpg",
  },
  {
    title: "Unisex Hoodie Sweatshirt",
    price: "799",
    mrp: "1,999",
    discount: "60% off",
    tag: "Winter Special",
    image: "image/Sweatshirt.jpg",
  },
];

// 🔹 Helper: localStorage se list laao, nahi ho to default use karo
function loadProductList(storageKey, defaultList) {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return defaultList.slice();   // copy
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.length) return defaultList.slice();
    return parsed;
  } catch (e) {
    console.warn("Error reading", storageKey, e);
    return defaultList.slice();
  }
}

// 🔹 Ye hi arrays poore site pe use honge
let electronicsProducts = loadProductList("electronicsProducts", DEFAULT_ELECTRONICS);
let fashionProducts     = loadProductList("fashionProducts", DEFAULT_FASHION);


// ============ CART LOGIC ============

let cartItems = [];

function loadCart() {
  try {
    const saved = localStorage.getItem("cartItems");
    cartItems = saved ? JSON.parse(saved) : [];
  } catch (e) {
    cartItems = [];
  }
  console.log("Cart loaded:", cartItems);
}

function saveCart() {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

function updateCartCount() {
  const el = document.getElementById("cartCount");
  if (el) el.textContent = cartItems.length;
}

function addToCart(item) {
  cartItems.push(item);
  saveCart();
  updateCartCount();
  alert(`"${item.title}" cart me add ho gaya!`);
}

// ============ WISHLIST LOGIC ============

function getWishlist() {
  const saved = localStorage.getItem("wishlistItems");
  return saved ? JSON.parse(saved) : [];
}

function saveWishlist(items) {
  localStorage.setItem("wishlistItems", JSON.stringify(items));
}

function addToWishlist(item) {
  const list = getWishlist();
  const exists = list.some(
    (p) => p.title === item.title && p.section === item.section
  );
  if (exists) {
    alert(`"${item.title}" already wishlist me hai`);
    return;
  }
  list.push(item);
  saveWishlist(list);
  alert(`"${item.title}" wishlist me add ho gaya!`);
}

// ============ NAVBAR USER HANDLING ============

function setupNavbarUser() {
  const userBtn = document.getElementById("navUserButton");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!userBtn) return;

  const savedName = localStorage.getItem("userName");

  if (savedName) {
    const first = savedName.split(" ")[0];
    userBtn.textContent = "Hi, " + first;
    userBtn.onclick = () => (window.location.href = "index.html");

    if (logoutBtn) {
      logoutBtn.style.display = "inline-block";
      logoutBtn.onclick = () => {
        localStorage.removeItem("userName");
        alert("Logged out!");
        window.location.href = "login.html";
      };
    }
  } else {
    userBtn.textContent = "Login";
    userBtn.onclick = () => (window.location.href = "login.html");
    if (logoutBtn) logoutBtn.style.display = "none";
  }
}

// ============ RENDER PRODUCTS ============

function renderProducts(list, gridElement, sectionName) {
  if (!gridElement) return;

  gridElement.innerHTML = "";

  list.forEach((p, index) => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image"
           style="background-image:url('${p.image || ""}');
                  background-size:cover;
                  background-position:center;">
      </div>
      <div class="product-title">${p.title}</div>
      <div class="product-price">₹${p.price}</div>
      <div class="product-mrp">₹${p.mrp}</div>
      <div class="product-discount">${p.discount}</div>
      <div class="product-tag">${p.tag}</div>

      <div class="product-actions">
        <button class="product-btn add-cart-btn">Add to Cart</button>
        <button class="product-btn view-btn">View Details</button>
        <button class="product-btn wishlist-btn">♡ Wishlist</button>
      </div>
    `;

    const addBtn = card.querySelector(".add-cart-btn");
    const viewBtn = card.querySelector(".view-btn");
    const wishBtn = card.querySelector(".wishlist-btn");

    addBtn.addEventListener("click", () => {
      addToCart({ title: p.title, price: p.price, section: sectionName });
    });

    // ✅ NEW: selectedProduct localStorage me save karo
viewBtn.addEventListener("click", () => {
  const detailData = {
    ...p,                  // saare product ke fields (title, price, image, etc.)
    section: sectionName,  // Electronics / Fashion
  };

  // Browser me save
  localStorage.setItem("selectedProduct", JSON.stringify(detailData));

  // Simple redirect
  window.location.href = "product.html";
});


    wishBtn.addEventListener("click", () => {
      addToWishlist({ title: p.title, price: p.price, section: sectionName });
    });

    gridElement.appendChild(card);
  });
}

// ============ PROTECTED PAGES (login required) ============

function requireLoginForProtectedPages() {
  const path = window.location.pathname;
  const protectedPages = ["cart.html", "checkout.html", "orders.html"];
  const isProtected = protectedPages.some((p) => path.endsWith(p));
  if (!isProtected) return;

  const savedName = localStorage.getItem("userName");
  if (!savedName) {
    alert("Please login to access this page.");
    window.location.href = "login.html";
  }
}

// ============ INIT ============

document.addEventListener("DOMContentLoaded", () => {
  console.log("INIT DONE");
  loadCart();
  updateCartCount();
  setupNavbarUser();

  const electronicsGrid = document.getElementById("productGrid");
  const fashionGrid = document.getElementById("productGridFashion");
  const searchInput = document.getElementById("searchInput");

  if (electronicsGrid) {
    renderProducts(electronicsProducts, electronicsGrid, "Electronics");
  }
  if (fashionGrid) {
    renderProducts(fashionProducts, fashionGrid, "Fashion");
  }

  if (searchInput && electronicsGrid) {
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.toLowerCase();
      const filtered = electronicsProducts.filter((p) =>
        p.title.toLowerCase().includes(q)
      );
      renderProducts(filtered, electronicsGrid, "Electronics");
    });
  }

  requireLoginForProtectedPages();
});

console.log("INIT DONE");
