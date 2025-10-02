/**
 * Ebebek Product Carousel Implementation
 * This script creates a pixel-perfect product carousel for ebebek homepage
 * with favorites functionality, responsive design, and local storage support.
 */

// Clean up any existing carousel to avoid duplicates
const existingCarousel = document.querySelector(".ebebek-case-carousel");
if (existingCarousel) {
  existingCarousel.remove();
}

const existingStyle = document.querySelector("style");
if (existingStyle && existingStyle.textContent.includes("ebebek-case")) {
  existingStyle.remove();
}

/**
 * CSS Styles for Pixel Perfect Design
 * Matches ebebek's design system exactly
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
    display: flex;
    align-items: center;
    justify-content: space-between;
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

.ebebek-case-products {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    scroll-behavior: smooth;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding: 8px 4px 16px;
}

.ebebek-case-products::-webkit-scrollbar {
    display: none;
}

.ebebek-case-product {
    flex: 0 0 220px;
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

/* Responsive Design */
@media (max-width: 768px) {
    .ebebek-case-product {
        flex: 0 0 200px;
    }
    
    .ebebek-case-hero {
        padding: 16px 20px;
    }
    
    .ebebek-case-hero-content h3 {
        font-size: 16px;
    }
}
`;

// Inject styles into the document
const styleElement = document.createElement("style");
styleElement.textContent = carouselStyles;
document.head.appendChild(styleElement);

/**
 * Create main carousel container with hero banner
 * This structure matches ebebek's design pattern
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
    
    <div class="ebebek-case-products" id="ebebek-products">
        <div class="ebebek-case-product">Ürünler yükleniyor...</div>
    </div>
`;

// Insert carousel at the top of the page
document.body.prepend(carouselContainer);

console.log("Product carousel initialized successfully");

/**
 * Favorite Products Management
 * Uses localStorage to persist user preferences
 */
const FAVORITES_STORAGE_KEY = "ebebek-favorites";

function getFavoriteProducts() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY)) || [];
  } catch (error) {
    console.error("Error reading favorites:", error);
    return [];
  }
}

function toggleProductFavorite(productId, buttonElement) {
  const userFavorites = getFavoriteProducts();
  const productIndex = userFavorites.indexOf(productId);

  if (productIndex > -1) {
    // Remove from favorites
    userFavorites.splice(productIndex, 1);
    buttonElement.classList.remove("favorited");
    buttonElement.innerHTML = "♡";
  } else {
    // Add to favorites
    userFavorites.push(productId);
    buttonElement.classList.add("favorited");
    buttonElement.innerHTML = "♥";
  }

  // Save updated favorites to localStorage
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(userFavorites));
}

/**
 * Format price to Turkish Lira format
 * @param {number} price - Product price
 * @returns {string} Formatted price string
 */
function formatPriceToTRY(price) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(price);
}

/**
 * Calculate discount percentage
 * @param {number} originalPrice - Original product price
 * @param {number} currentPrice - Current product price
 * @returns {number|null} Discount percentage or null if no discount
 */
function calculateDiscount(originalPrice, currentPrice) {
  if (originalPrice && originalPrice > currentPrice) {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }
  return null;
}

/**
 * Fetch products from API and render carousel
 * Implements error handling and data validation
 */
const PRODUCTS_API_URL =
  "https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json";

async function loadAndDisplayProducts() {
  try {
    const apiResponse = await fetch(PRODUCTS_API_URL);

    if (!apiResponse.ok) {
      throw new Error(`HTTP error! status: ${apiResponse.status}`);
    }

    const responseData = await apiResponse.json();

    // Handle different possible data structures
    let productList = [];
    if (Array.isArray(responseData)) {
      productList = responseData;
    } else if (responseData.products && Array.isArray(responseData.products)) {
      productList = responseData.products;
    } else {
      productList = Object.values(responseData);
    }

    const productsContainer = document.getElementById("ebebek-products");
    productsContainer.innerHTML = "";

    const userFavorites = getFavoriteProducts();

    // Create product cards for first 8 products
    productList.slice(0, 8).forEach((product) => {
      const productCard = document.createElement("div");
      productCard.className = "ebebek-case-product";

      // Extract product data with fallbacks
      const productName =
        product.name || product.title || "Product Name Not Available";
      const productPrice = product.price || product.currentPrice || 0;
      const originalProductPrice =
        product.originalPrice || product.oldPrice || null;
      const productImage =
        product.img ||
        product.image ||
        "https://via.placeholder.com/200x200?text=No+Image";
      const productIdentifier =
        product.id || `product-${Math.random().toString(36).substr(2, 9)}`;
      const isProductFavorited = userFavorites.includes(productIdentifier);

      // Calculate discount if applicable
      const discountPercentage = calculateDiscount(
        originalProductPrice,
        productPrice
      );

      // Build product card HTML
      productCard.innerHTML = `
                <div class="ebebek-case-image">
                    <img src="${productImage}" alt="${productName}" 
                         onerror="this.src='https://via.placeholder.com/200x200?text=No+Image'">
                    <button class="ebebek-case-favorite ${
                      isProductFavorited ? "favorited" : ""
                    }" 
                            data-product-id="${productIdentifier}">
                        ${isProductFavorited ? "♥" : "♡"}
                    </button>
                </div>
                <div class="ebebek-case-info">
                    <div class="ebebek-case-name">${productName}</div>
                    <div class="ebebek-case-price-container">
                        <div class="ebebek-case-current-price">
                            ${formatPriceToTRY(productPrice)}
                        </div>
                        ${
                          originalProductPrice &&
                          originalProductPrice > productPrice
                            ? `<div class="ebebek-case-original-price">
                                ${formatPriceToTRY(originalProductPrice)}
                            </div>`
                            : ""
                        }
                        ${
                          discountPercentage
                            ? `<div class="ebebek-case-discount">%${discountPercentage}</div>`
                            : ""
                        }
                    </div>
                    <button class="ebebek-case-button" data-product-id="${productIdentifier}">
                        Sepete Ekle
                    </button>
                </div>
            `;

      // Add event listeners for interactivity
      const favoriteButton = productCard.querySelector(".ebebek-case-favorite");
      const addToCartButton = productCard.querySelector(".ebebek-case-button");

      // Favorite button click handler
      favoriteButton.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleProductFavorite(productIdentifier, favoriteButton);
      });

      // Add to cart button click handler
      addToCartButton.addEventListener("click", (event) => {
        event.stopPropagation();
        console.log("Product added to cart:", productIdentifier);
        alert("Ürün sepete eklendi: " + productName);
      });

      // Whole product card click handler - opens product page
      productCard.addEventListener("click", () => {
        const productPageURL =
          product.url ||
          `https://www.e-bebek.com/search?q=${encodeURIComponent(productName)}`;
        window.open(productPageURL, "_blank");
      });

      productsContainer.appendChild(productCard);
    });

    console.log("Product carousel loaded successfully! 🎉");
    console.log("Implemented Features:");
    console.log("✅ Hero banner with gradient design");
    console.log("✅ Favorite functionality with localStorage persistence");
    console.log("✅ Discount calculation and display");
    console.log("✅ Hover effects and smooth transitions");
    console.log("✅ Responsive design for all devices");
    console.log("✅ Pixel perfect design matching ebebek style");
    console.log("✅ Product page navigation in new tab");
    console.log("✅ Error handling for image loading");
  } catch (error) {
    console.error("Error loading products:", error);
    const productsContainer = document.getElementById("ebebek-products");
    productsContainer.innerHTML =
      '<div class="ebebek-case-product">Error loading products. Please refresh the page.</div>';
  }
}

// Initialize the product carousel
loadAndDisplayProducts();
