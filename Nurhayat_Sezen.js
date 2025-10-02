/**
 * Ebebek Product Carousel - Complete Implementation
 * This code creates a horizontal scrolling product carousel for ebebek homepage
 * Features: favorites, responsive design, discount calculation, and smooth animations
 */

// First, clean up any existing carousel to avoid duplicates
const existingCarousel = document.querySelector(".ebebek-case-carousel");
if (existingCarousel) {
  existingCarousel.remove();
}

const existingStyle = document.querySelector("style");
if (existingStyle && existingStyle.textContent.includes("ebebek-case")) {
  existingStyle.remove();
}

/**
 * CSS Styles for the carousel
 * I designed this to match ebebek's visual identity exactly
 * The key aspects are proper flexbox setup for horizontal scrolling
 */
const carouselStyles = `
.ebebek-case-carousel {
    max-width: 1200px;
    margin: 30px auto;
    padding: 0 16px;
    font-family: 'Segoe UI', Arial, sans-serif;
}

.ebebek-case-title {
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin-bottom: 16px;
    padding-left: 8px;
}

.ebebek-case-hero {
    background: linear-gradient(90deg, #fff8f0 0%, #fff 100%);
    border-radius: 12px;
    padding: 20px 24px;
    margin-bottom: 20px;
    border: 1px solid #ffe8d6;
}

.ebebek-case-hero-content h3 {
    margin: 0 0 8px 0;
    font-size: 18px;
    font-weight: 700;
    color: #333;
}

.ebebek-case-hero-content p {
    margin: 0;
    font-size: 14px;
    color: #666;
}

/* Main scrolling container - this enables horizontal scrolling */
.ebebek-case-products-wrapper {
    width: 100%;
    position: relative;
}

.ebebek-case-products {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-behavior: smooth;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding: 8px 4px 16px;
    width: 100%;
}

.ebebek-case-products::-webkit-scrollbar {
    display: none;
}

/* Individual product cards - fixed width prevents flex shrinking */
.ebebek-case-product {
    flex: 0 0 auto;
    width: 220px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    border: 1px solid #f0f0f0;
    cursor: pointer;
    transition: all 0.3s ease;
}

.ebebek-case-product:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
    transform: translateY(-2px);
}

.ebebek-case-image {
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background: #fafafa;
    border-radius: 12px 12px 0 0;
    position: relative;
}

.ebebek-case-image img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.ebebek-case-favorite {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 32px;
    height: 32px;
    border: none;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    cursor: pointer;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.ebebek-case-favorite.favorited {
    color: #ff7a00;
}

.ebebek-case-info {
    padding: 12px;
}

.ebebek-case-name {
    font-size: 14px;
    line-height: 1.4;
    color: #333;
    margin-bottom: 8px;
    height: 40px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.ebebek-case-price-container {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
    flex-wrap: wrap;
}

.ebebek-case-current-price {
    font-size: 16px;
    font-weight: 700;
    color: #333;
}

.ebebek-case-original-price {
    font-size: 13px;
    color: #999;
    text-decoration: line-through;
}

.ebebek-case-discount {
    background: #fff8e1;
    color: #ff7a00;
    font-size: 12px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 10px;
    margin-left: auto;
}

.ebebek-case-button {
    width: 100%;
    background: #ff7a00;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;
}

.ebebek-case-button:hover {
    background: #e66a00;
}

.ebebek-case-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    z-index: 10;
}

.ebebek-case-prev {
    left: -20px;
}

.ebebek-case-next {
    right: -20px;
}

.ebebek-case-nav:hover {
    background: #f5f5f5;
}

@media (max-width: 768px) {
    .ebebek-case-product {
        width: 200px;
    }
    
    .ebebek-case-hero {
        padding: 16px 20px;
    }
    
    .ebebek-case-hero-content h3 {
        font-size: 16px;
    }
    
    .ebebek-case-nav {
        display: none;
    }
    
    .ebebek-case-products {
        padding: 8px 0 16px;
    }
}
`;

// Add the CSS to the page
const styleElement = document.createElement("style");
styleElement.textContent = carouselStyles;
document.head.appendChild(styleElement);

/**
 * Build the HTML structure for the carousel
 * I'm creating all elements dynamically to work on any page
 */
const carouselContainer = document.createElement("div");
carouselContainer.className = "ebebek-case-carousel";
carouselContainer.innerHTML = `
    <div class="ebebek-case-title">Beğenebileceğinizi Düşündüklerimiz</div>
    
    <div class="ebebek-case-hero">
        <div class="ebebek-case-hero-content">
            <h3>Haftanın Öne Çıkan Ürünleri</h3>
            <p>Size özel fırsatlar ve beğenebileceğiniz ürünler</p>
        </div>
    </div>
    
    <div class="ebebek-case-products-wrapper">
        <div class="ebebek-case-products" id="ebebek-products">
            <div class="ebebek-case-product">Ürünler yükleniyor...</div>
        </div>
    </div>
`;

// Add the carousel to the top of the page
document.body.prepend(carouselContainer);

console.log("Carousel HTML structure created successfully");

/**
 * Favorites Management System
 * I used localStorage to remember user preferences between page visits
 */
const FAVORITES_STORAGE_KEY = "ebebek-favorites";

// Get current favorites from localStorage
function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY)) || [];
  } catch (error) {
    console.log("Error reading favorites, starting with empty list");
    return [];
  }
}

// Toggle favorite status for a product
function toggleFavorite(productId, button) {
  const favorites = getFavorites();
  const index = favorites.indexOf(productId);

  if (index > -1) {
    // Remove from favorites
    favorites.splice(index, 1);
    button.classList.remove("favorited");
    button.innerHTML = "♡";
    console.log("Removed product from favorites:", productId);
  } else {
    // Add to favorites
    favorites.push(productId);
    button.classList.add("favorited");
    button.innerHTML = "♥";
    console.log("Added product to favorites:", productId);
  }

  // Save updated list
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
}

/**
 * Utility Functions
 * These helper functions format prices and calculate discounts
 */

// Format price as Turkish Lira
function formatPrice(price) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(price);
}

// Calculate discount percentage between original and current price
function calculateDiscount(originalPrice, currentPrice) {
  if (originalPrice && originalPrice > currentPrice) {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }
  return null;
}

/**
 * Navigation System
 * I added arrow buttons for better user experience
 */
function addNavigation() {
  const wrapper = document.querySelector(".ebebek-case-products-wrapper");
  const products = document.getElementById("ebebek-products");

  // Create previous button
  const prevBtn = document.createElement("button");
  prevBtn.className = "ebebek-case-nav ebebek-case-prev";
  prevBtn.innerHTML = "‹";
  prevBtn.setAttribute("aria-label", "Previous products");

  // Create next button
  const nextBtn = document.createElement("button");
  nextBtn.className = "ebebek-case-nav ebebek-case-next";
  nextBtn.innerHTML = "›";
  nextBtn.setAttribute("aria-label", "Next products");

  // Add click handlers for smooth scrolling
  prevBtn.addEventListener("click", () => {
    products.scrollBy({ left: -300, behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    products.scrollBy({ left: 300, behavior: "smooth" });
  });

  // Add buttons to the page
  wrapper.appendChild(prevBtn);
  wrapper.appendChild(nextBtn);

  console.log("Navigation arrows added");
}

/**
 * Product Loading and Display
 * This is the main function that fetches and displays products
 */
const PRODUCTS_API_URL =
  "https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json";

async function loadProducts() {
  try {
    console.log("Starting to load products from API...");

    const response = await fetch(PRODUCTS_API_URL);
    const data = await response.json();

    // Handle different possible data structures from API
    let products = [];
    if (Array.isArray(data)) {
      products = data;
    } else if (data.products) {
      products = data.products;
    } else {
      products = Object.values(data);
    }

    const container = document.getElementById("ebebek-products");
    container.innerHTML = "";

    const favorites = getFavorites();

    console.log(`Loaded ${products.length} products from API`);

    // Create product cards for first 10 products
    products.slice(0, 10).forEach((product) => {
      const productCard = document.createElement("div");
      productCard.className = "ebebek-case-product";

      // Extract product data with safety checks
      const title =
        product.name || product.title || "Product name not available";
      const price = product.price || product.currentPrice || 0;
      const originalPrice = product.originalPrice || product.oldPrice || null;
      const image =
        product.img ||
        product.image ||
        "https://via.placeholder.com/200x200?text=No+Image";
      const productId = product.id || Math.random();
      const isFavorited = favorites.includes(productId);
      const discount = calculateDiscount(originalPrice, price);

      // Build the product card HTML
      productCard.innerHTML = `
                <div class="ebebek-case-image">
                    <img src="${image}" alt="${title}" 
                         onerror="this.src='https://via.placeholder.com/200x200?text=No+Image'">
                    <button class="ebebek-case-favorite ${
                      isFavorited ? "favorited" : ""
                    }" 
                            data-id="${productId}">
                        ${isFavorited ? "♥" : "♡"}
                    </button>
                </div>
                <div class="ebebek-case-info">
                    <div class="ebebek-case-name">${title}</div>
                    <div class="ebebek-case-price-container">
                        <div class="ebebek-case-current-price">
                            ${formatPrice(price)}
                        </div>
                        ${
                          originalPrice && originalPrice > price
                            ? `<div class="ebebek-case-original-price">
                                ${formatPrice(originalPrice)}
                            </div>`
                            : ""
                        }
                        ${
                          discount
                            ? `<div class="ebebek-case-discount">%${discount}</div>`
                            : ""
                        }
                    </div>
                    <button class="ebebek-case-button" data-id="${productId}">
                        Sepete Ekle
                    </button>
                </div>
            `;

      // Add event listeners for interactivity
      const favoriteBtn = productCard.querySelector(".ebebek-case-favorite");
      const addToCartBtn = productCard.querySelector(".ebebek-case-button");

      // Handle favorite button clicks
      favoriteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFavorite(productId, favoriteBtn);
      });

      // Handle add to cart button clicks
      addToCartBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        console.log("Product added to cart:", productId);
        alert("Ürün sepete eklendi: " + title);
      });

      // Handle clicking on the product card
      productCard.addEventListener("click", () => {
        const productUrl =
          product.url ||
          `https://www.e-bebek.com/search?q=${encodeURIComponent(title)}`;
        window.open(productUrl, "_blank");
      });

      container.appendChild(productCard);
    });

    // Add navigation after products are loaded
    addNavigation();

    console.log("Product carousel successfully loaded!");
    console.log("Features implemented:");
    console.log("- Horizontal scrolling carousel");
    console.log("- Favorite products with localStorage");
    console.log("- Discount calculation and display");
    console.log("- Responsive design for mobile devices");
    console.log("- Smooth hover animations");
    console.log("- Product page navigation");
  } catch (error) {
    console.error("Error loading products:", error);
    const container = document.getElementById("ebebek-products");
    container.innerHTML =
      '<div class="ebebek-case-product">Error loading products. Please refresh the page.</div>';
  }
}

// Start the carousel
loadProducts();
