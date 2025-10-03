/**
 * Ebebek Product Carousel
 * Professional implementation of product carousel for ebebek homepage
 * Features: Favorite functionality, responsive design, smooth scrolling
 */

(function () {
  "use strict";

  // Check if we're on the homepage
  const currentPath = window.location.pathname;
  if (currentPath !== "/" && !currentPath.includes("ebebek")) {
    console.log("wrong page");
    return;
  }

  // Clean up any existing carousel instances
  const existingCarousel = document.querySelector(".carousel");
  if (existingCarousel) existingCarousel.remove();

  const existingStyle = document.querySelector("style");
  if (existingStyle && existingStyle.textContent.includes("carousel")) {
    existingStyle.remove();
  }

  // Configuration
  const PRODUCTS_API_URL =
    "https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json";
  const PRODUCTS_STORAGE_KEY = "ebebek-products-data";
  const FAVORITES_STORAGE_KEY = "ebebek-favorites";
  const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Format price for Turkish Lira display with decimal places
   */
  const formatPrice = (price) => {
    const [whole, decimal] = price.toString().split(".");
    if (decimal) {
      return `${whole}<span class="decimal">,${decimal}</span>`;
    }
    return whole;
  };

  /**
   * Calculate discount percentage between original and current price
   */
  const calculateDiscount = (originalPrice, currentPrice) => {
    if (originalPrice && originalPrice > currentPrice) {
      return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    }
    return null;
  };

  /**
   * Get cached products from localStorage
   */
  const getCachedProducts = () => {
    try {
      const cached = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > CACHE_DURATION) {
        localStorage.removeItem(PRODUCTS_STORAGE_KEY);
        return null;
      }
      return data;
    } catch (error) {
      return null;
    }
  };

  /**
   * Save products to localStorage cache
   */
  const cacheProducts = (products) => {
    const cacheData = {
      data: products,
      timestamp: Date.now(),
    };
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(cacheData));
  };

  /**
   * Get user's favorite products from localStorage
   */
  const getFavorites = () => {
    try {
      return JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  };

  /**
   * Toggle favorite status for a product
   */
  const toggleFavorite = (productId, button) => {
    const favorites = getFavorites();
    const index = favorites.indexOf(productId);

    if (index > -1) {
      favorites.splice(index, 1);
      button.classList.remove("active");
      button.querySelector(".heart-icon").style.color = "#ccc";
    } else {
      favorites.push(productId);
      button.classList.add("active");
      button.querySelector(".heart-icon").style.color = "#ff6b00";
    }
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  };

  /**
   * Build and inject CSS styles for the carousel
   */
  const buildCSS = () => {
    const styles = `
    <style>
      .carousel {
        padding: 25px 0;
        max-width: 100%;
        margin: 0 auto;
      }

      .carousel .container {
        width: 100%;
        position: relative;
        overflow-x: visible;
      }

      .carousel-wrapper {
        position: relative;
        display: flex;
        gap: 13px;
        overflow-x: auto;
        padding: 20px 0;
        -ms-overflow-style: none;
        scrollbar-width: none;
      }

      .carousel-wrapper::-webkit-scrollbar {
        display: none;
      }

      .carousel-title {
        font-size: 24px;
        font-weight: 600;
        text-align: start;
        margin: 0 0 20px 0;
        padding: 0 15px;
      }

      .carousel-button {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 50px;
        height: 50px;
        border: none;
        border-radius: 50%;
        background: #ffffff;
        cursor: pointer;
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-size: 24px;
        font-weight: bold;
        color: #333;
        transition: all 0.3s ease;
        border: 2px solid #f0f0f0;
      }

      .carousel-button:hover {
        background: #f8f8f8;
        color: #333;
        box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        border-color: #ddd;
        transform: translateY(-50%) scale(1.1);
      }

      .carousel-button.left::before {
        content: "←";
        font-size: 20px;
        font-weight: bold;
      }

      .carousel-button.right::before {
        content: "→";
        font-size: 20px;
        font-weight: bold;
      }

      .carousel-button.left {
        left: -60px;
      }

      .carousel-button.right {
        right: -60px;
      }

      .carousel-item {
        position: relative;
        padding: 0;
        margin: 0;
        flex: 0 0 auto;
      }

      .carousel-item-link {
        height: 100%;
        width: 235px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        border: 0.3px solid #f0f0f0;
        border-radius: 8px;
        overflow: hidden;
        text-decoration: none;
        color: inherit;
        padding: 14px;
        background: white;
        transition: all 0.15s ease;
        position: relative;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      }

      .carousel-item-link:hover {
        text-decoration: none;
        color: inherit;
        border-color: #bcbabaff;
      }

      .star-rating {
        width: 100%;
        display: flex;
        justify-content: start;
        gap: 3px;
      }

      .rate-count {
        opacity: 0.4;
        margin-left: 6px;
        align-self: center;
      }

      .star-rating .star {
        color: #ff8a00 !important;
        font-size: 16px;
      
      }

      .favorite-button {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 50;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        cursor: pointer;
        font-size: 18px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
      }

      .favorite-button .heart-icon {
        color: #ccc;
        font-size: 16px;
        transition: color 0.2s ease;
      }

      .favorite-button:hover .heart-icon {
        color: #ff6b00;
      }

      .favorite-button.active .heart-icon {
        color: #ff6b00 !important;
      }

      .favorite-button:hover {
        background: rgba(255, 107, 0, 0.1);
      }

      .carousel-item img {
        max-height: 60%;
        width: 200px;
        object-fit: cover;
        display: block;
      }

      .product-info {
       width: 100%;
       text-align: left;
       margin-bottom: 8px;
       line-height: 1.3;
        }

      .brand-name {
        font-size: 12px;
        color: #000000ff;
        font-weight: bold; /* Marka adı kalın */
      }

      .product-name {
       font-size: 12px;
       color: #333;
       font-weight: normal; /* Ürün adı normal */
  }

      .item-name {
        font-size: 12px;
        font-weight: 500;
        line-height: 1.4;
        color: #333;
        margin-bottom: 8px;
        width: 100%;
        text-align: left;
      }

      .price-container {
        width: calc(100% - 50px);
        display: flex;
        flex-direction: column;
        text-align: start;
        margin-bottom: 8px;
        margin-top: auto;
      }

      .discount-price-section {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .original-price {
        font-size: 12px;
        color: #666;
        text-decoration: line-through;
      }

      .sepet-label {
        font-size: 11px;
        color: #00a365;
        font-weight: bold;
      }

      .discounted-price {
        font-size: 16px;
        font-weight: bold;
        color: #00a365;
      }

      .current-price {
        font-size: 16px;
        font-weight: bold;
        color: #333;
      }

      .decimal {
        font-size: 0.7em;
      }

      .featured-badge {
        display: inline-block;
        background: #4caf50;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
        margin-bottom: 8px;
        width: 100%;
        text-align: left;
      }

      .fast-delivery {
        color: #4caf50;
        font-size: 12px;
        font-weight: 600;
        margin-bottom: 8px;
        width: 100%;
        text-align: left;
      }

      .add-to-cart {
        width: 40px;
        height: 40px;
        background: transparent;
        color: #3f99f3ff;
        border: 1px solid #f0f0f0;
        border-radius: 50%;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.15s ease;
        font-size: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        bottom: 14px;
        right: 14px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      }

      .add-to-cart:hover {
        background: #1f87c7ff;
        color: white;
        border-color: #1f87c7ff;
      }

      .installment-badge {
        color: #ff6b00;
        font-size: 11px;
        font-weight: 600;
        margin-bottom: 6px;
        width: 100%;
        text-align: left;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .installment-badge::before {
        content: "✓";
        color: #ff6b00;
        font-size: 12px;
        font-weight: bold;
      }

      @media (max-width: 1440px) {
        .carousel-item-link {
          width: 275px;
        }
      }

      @media (max-width: 1024px) {
        .carousel-item-link {
          width: 295px;
        }
      }

      @media (max-width: 768px) {
        .carousel .container {
          padding: 0 15px;
        }

        .carousel-item-link {
          width: 335px;
        }

        .carousel-title {
          font-size: 20px;
        }

        .carousel-button {
          display: none;
        }
      }

      @media (max-width: 480px) {
        .carousel-item-link {
          width: 190px;
        }

        .carousel-button {
          width: 35px;
          height: 35px;
        }

        .carousel-button.left::before,
        .carousel-button.right::before {
          font-size: 16px;
        }

        .carousel-item img {
          width: 160px;
        }

        .current-price,
        .discounted-price {
          font-size: 18px;
        }

        .add-to-cart {
          width: 35px;
          height: 35px;
          font-size: 18px;
        }
      }
    </style>
    `;

    document.head.insertAdjacentHTML("beforeend", styles);
  };

  /**
   * Build HTML structure for the carousel
   */
  const buildHTML = () => {
    const carouselHTML = `
    <div class="carousel">
      <div class="container">
        <h2 class="carousel-title">Sizin için Seçtiklerimiz</h2>
        <button class="carousel-button left" aria-label="Önceki ürünler"></button>
        <div class="carousel-wrapper" id="carousel-wrapper"></div>
        <button class="carousel-button right" aria-label="Sonraki ürünler"></button>
      </div>
    </div>
    `;

    const heroBanner = document.querySelector(
      '.hero-banner, .banner, [class*="hero"], [class*="banner"]'
    );
    if (heroBanner) {
      heroBanner.insertAdjacentHTML("afterend", carouselHTML);
    } else {
      document.body.insertAdjacentHTML("afterbegin", carouselHTML);
    }
  };

  /**
   * Add navigation functionality to carousel buttons
   */
  const addNavigation = () => {
    const leftButton = document.querySelector(".carousel-button.left");
    const rightButton = document.querySelector(".carousel-button.right");
    const carouselWrapper = document.querySelector(".carousel-wrapper");

    if (!leftButton || !rightButton || !carouselWrapper) return;

    const scrollAmount = 300;

    leftButton.addEventListener("click", () => {
      carouselWrapper.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    });

    rightButton.addEventListener("click", () => {
      carouselWrapper.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    });
  };

  /**
   * Set up event listeners for user interactions
   */
  const setEvents = () => {
    const carouselWrapper = document.querySelector(".carousel-wrapper");

    if (!carouselWrapper) return;

    carouselWrapper.addEventListener("click", (e) => {
      if (e.target.closest(".favorite-button")) {
        const favoriteButton = e.target.closest(".favorite-button");
        const itemId = favoriteButton.dataset.id;
        toggleFavorite(itemId, favoriteButton);
        e.preventDefault();
        e.stopPropagation();
      }

      if (e.target.closest(".add-to-cart")) {
        const addToCartBtn = e.target.closest(".add-to-cart");
        const carouselItem = addToCartBtn.closest(".carousel-item");
        const itemId = carouselItem.dataset.id;
        console.log("Ürün sepete eklendi:", itemId);
        e.preventDefault();
        e.stopPropagation();
      }
    });
  };

  /**
   * Render products in the carousel
   */
  const renderProducts = (products) => {
    const container = document.getElementById("carousel-wrapper");
    if (!container) return;

    const favorites = getFavorites();

    const productsHTML = products
      .slice(0, 15)
      .map((product) => {
        const isDiscounted =
          product.original_price && product.original_price > product.price;
        const discountPercent = isDiscounted
          ? Math.round(
              ((product.original_price - product.price) /
                product.original_price) *
                100
            )
          : 0;

        const hasInstallment = product.price > 500;

        return `
        <div class="carousel-item" data-id="${product.id}">
          <button class="favorite-button ${
            favorites.includes(product.id.toString()) ? "active" : ""
          }" 
                  data-id="${product.id}" 
                  aria-label="${
                    favorites.includes(product.id.toString())
                      ? "Favorilerden çıkar"
                      : "Favorilere ekle"
                  }">
            <span class="heart-icon">♥</span>
          </button>
          <a href="${
            product.url || "#"
          }" target="_blank" class="carousel-item-link">
            <img src="${product.img}" alt="${product.name}" loading="lazy">
            
            ${
              product.featured
                ? '<div class="featured-badge">ÖNE ÇIKAN</div>'
                : ""
            }
            
            <div class="product-info">
              <span class="brand-name">${product.brand}</span>
              <span class="product-name"> - ${product.name}</span>
            </div>

            ${
              hasInstallment
                ? '<div class="installment-badge">Vadesiz & taksit fırsatı</div>'
                : ""
            }

            <div class="star-rating">
              <span class="star">★</span>
              <span class="star">★</span>
              <span class="star">★</span>
              <span class="star">★</span>
              <span class="star">★</span>
              <span class="rate-count"> (${Math.floor(
                Math.random() * 150 + 50
              )})</span>
            </div>

            <div class="price-container">
              ${
                !isDiscounted
                  ? `<span class="current-price">${formatPrice(
                      product.price
                    )} TL</span>`
                  : `<div class="discount-price-section">
                       <span class="original-price">${formatPrice(
                         product.original_price
                       )} TL</span>
                       <span class="sepet-label">Sepette</span>
                       <span class="discounted-price">${formatPrice(
                         product.price
                       )} TL</span>
                     </div>`
              }
            </div>
            
            ${
              product.fastDelivery
                ? '<div class="fast-delivery">Yarın kargoda</div>'
                : ""
            }
            
            <button class="add-to-cart" aria-label="Sepete ekle">+</button>
          </a>
        </div>
      `;
      })
      .join("");

    container.innerHTML = productsHTML;
  };
  /**
   * Load products from API or cache
   */
  const loadProducts = async () => {
    try {
      let products = getCachedProducts();

      if (!products) {
        console.log("Fetching products from API...");
        const response = await fetch(PRODUCTS_API_URL);
        const data = await response.json();

        products = Array.isArray(data)
          ? data
          : data.products
          ? data.products
          : Object.values(data);

        cacheProducts(products);
        console.log("Products fetched from API and cached");
      } else {
        console.log("Products loaded from cache");
      }

      renderProducts(products);
      addNavigation();
      setEvents();
      console.log("Carousel loaded successfully!");
    } catch (error) {
      console.error("Error loading products:", error);
      const container = document.getElementById("carousel-wrapper");
      if (container) {
        container.innerHTML =
          '<div class="carousel-item">Error loading products. Please refresh the page.</div>';
      }
    }
  };

  /**
   * Initialize the carousel application
   */
  const init = () => {
    buildCSS();
    buildHTML();
    loadProducts();
  };

  // Start the application
  init();
})();
