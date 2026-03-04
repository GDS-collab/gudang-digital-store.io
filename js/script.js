// Konfigurasi WhatsApp Admin
const ADMIN_WHATSAPP = "6281234567890";
const BASE_URL = "https://username-anda.github.io/gudang-digital-store/";

// Data Produk
const products = [
  {
    id: 1,
    name: "Instagram Feed Template",
    description: "50+ template feed Instagram aesthetic untuk konten kreator",
    price: 49000,
    image: "https://via.placeholder.com/640x360/667eea/ffffff?text=Instagram+Feed",
    category: "Social Media",

  },
  {
    id: 2,
    name: "Canva Presentation Bundle",
    description: "Template presentasi profesional untuk pitch deck & laporan",
    price: 75000,
    image: "https://via.placeholder.com/640x360/764ba2/ffffff?text=Presentation",
    category: "Business",

  },
  {
    id: 3,
    name: "TikTok Story Template Pack",
    description: "30 template story TikTok viral dengan animasi menarik",
    price: 39000,
    image: "https://via.placeholder.com/640x360/e74c3c/ffffff?text=TikTok+Story",
    category: "Social Media",

  },
  {
    id: 4,
    name: "Logo & Branding Kit",
    description: "Template logo, kartu nama, dan branding untuk UMKM",
    price: 99000,
    image: "https://via.placeholder.com/640x360/3498db/ffffff?text=Branding+Kit",
    category: "Branding",

  }
];

// State Cart
let cart = [];

// Format Rupiah
const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(angka);
};

// ✅ Generate Product Schema untuk SEO
const generateProductSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": products.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": product.name,
        "description": product.description,
        "image": product.image,
        "category": product.category,
        "offers": {
          "@type": "Offer",
          "price": product.price,
          "priceCurrency": "IDR",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": "Gudang Digital Store"
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": product.rating,
          "reviewCount": product.reviewCount
        }
      }
    }))
  };
  
  document.getElementById('product-schema').textContent = JSON.stringify(schema);
};

// Render Produk dengan SEO Markup
const renderProducts = () => {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = products.map((product, index) => `
    <article class="product-card" data-id="${product.id}" itemscope itemtype="https://schema.org/Product">
      <meta itemprop="productID" content="${product.id}"/>
      <meta itemprop="brand" content="Gudang Digital Store"/>
      <meta itemprop="category" content="${product.category}"/>
      
      <div class="product-image">
        <img src="${product.image}" 
             alt="${product.name} - Template digital ${product.category}"
             itemprop="image"
             width="640"
             height="360"
             loading="lazy"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="placeholder" style="display:none;">
          <i class="fas fa-image"></i>
        </div>
      </div>
      
      <div class="product-info">
        <h4 class="product-title" itemprop="name">${product.name}</h4>
        <p class="product-desc" itemprop="description">${product.description}</p>
        
        
        <div class="product-price" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
          <meta itemprop="priceCurrency" content="IDR"/>
          <meta itemprop="price" content="${product.price}"/>
          <meta itemprop="availability" content="https://schema.org/InStock"/>
          <span itemprop="price" content="${product.price}">${formatRupiah(product.price)}</span>
        </div>
        
        <div class="product-actions">
          <button class="btn-cart" onclick="addToCart(${product.id})" aria-label="Tambah ${product.name} ke keranjang">
            <i class="fas fa-shopping-cart"></i> Keranjang
          </button>
          <button class="btn-buy" onclick="buyNow(${product.id})" aria-label="Beli ${product.name} via WhatsApp">
            <i class="fab fa-whatsapp"></i> Beli
          </button>
        </div>
      </div>
    </article>
  `).join('');
};

// Add to Cart
const addToCart = (productId) => {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    alert('Produk sudah ada di keranjang!');
    return;
  }
  
  cart.push(product);
  updateCartCount();
  showNotification('✅ Ditambahkan ke keranjang!');
  
  // ✅ Track Event untuk Analytics (jika pakai GA)
  if (typeof gtag !== 'undefined') {
    gtag('event', 'add_to_cart', {
      event_category: 'ecommerce',
      event_label: product.name,
      value: product.price
    });
  }
};

// Buy Now
const buyNow = (productId) => {
  const product = products.find(p => p.id === productId);
  const message = `Halo Admin Gudang Digital Store! 👋%0A%0ASaya ingin membeli:%0A📦 ${product.name}%0A💰 Harga: ${formatRupiah(product.price)}%0A%0AMohon info metode pembayarannya. Terima kasih! 🙏`;
  
  window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${message}`, '_blank');
  
  // ✅ Track Event
  if (typeof gtag !== 'undefined') {
    gtag('event', 'click_whatsapp', {
      event_category: 'conversion',
      event_label: product.name,
      value: product.price
    });
  }
};

// Update Cart Count
const updateCartCount = () => {
  document.getElementById('cartCount').textContent = cart.length;
};

// Show Cart Modal
const showCart = () => {
  const modal = document.getElementById('cartModal');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<p style="text-align:center; color:#7f8c8d;">Keranjang masih kosong 😊</p>';
    cartTotal.textContent = formatRupiah(0);
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong><br>
          <small>${formatRupiah(item.price)}</small>
        </div>
        <button onclick="removeFromCart(${item.id})" 
                style="background:#e74c3c; color:white; border:none; border-radius:5px; padding:5px 10px; cursor:pointer;"
                aria-label="Hapus ${item.name} dari keranjang">
          Hapus
        </button>
      </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotal.textContent = formatRupiah(total);
  }
  
  modal.classList.add('active');
};

// Remove from Cart
const removeFromCart = (productId) => {
  cart = cart.filter(item => item.id !== productId);
  updateCartCount();
  showCart();
};

// Checkout via WhatsApp
const checkoutWhatsApp = () => {
  if (cart.length === 0) {
    alert('Keranjang masih kosong!');
    return;
  }
  
  const itemList = cart.map((item, index) => 
    `${index + 1}. ${item.name} - ${formatRupiah(item.price)}`
  ).join('%0A');
  
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const message = `Halo Admin Gudang Digital Store! 👋%0A%0ASaya ingin checkout:%0A%0A${itemList}%0A%0A💰 *Total: ${formatRupiah(total)}*%0A%0AMohon info metode pembayaran (OVO/DANA/Gopay/Transfer Bank). Terima kasih! 🙏`;
  
  window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${message}`, '_blank');
  
  // ✅ Track Event
  if (typeof gtag !== 'undefined') {
    gtag('event', 'checkout', {
      event_category: 'ecommerce',
      value: total,
      items: cart.map(item => ({ item_name: item.name, price: item.price }))
    });
  }
};

// Notification
const showNotification = (message) => {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed; top: 20px; right: 20px;
    background: #2ecc71; color: white;
    padding: 12px 20px; border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    z-index: 3000; animation: slideIn 0.3s ease;
  `;
  notification.setAttribute('role', 'alert');
  notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
};

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
  
  /* Skip Link untuk Accessibility */
  .skip-link:focus {
    position: absolute;
    left: 20px;
    top: 20px;
    z-index: 9999;
    background: #2c3e50;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
  }
  
  /* FAQ Styles */
  .faq { padding: 60px 0; background: #f8f9fa; }
  .faq-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 25px;
  }
  .faq-item {
    background: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.08);
  }
  .faq-item h4 {
    color: #2c3e50;
    margin-bottom: 10px;
    font-size: 1rem;
  }
  .faq-item p {
    color: #7f8c8d;
    font-size: 0.95rem;
    line-height: 1.6;
  }
  
  /* CTA Section */
  .cta {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-align: center;
    padding: 80px 20px;
  }
  .cta h3 { font-size: 2rem; margin-bottom: 15px; }
  .cta p { font-size: 1.2rem; margin-bottom: 25px; opacity: 0.9; }
  .cta .btn-primary { background: white; color: #667eea; }
  
  /* Rating Stars */
  .product-rating {
    margin-bottom: 10px;
    color: #f1c40f;
    font-size: 0.9rem;
  }
  .review-count {
    color: #7f8c8d;
    margin-left: 5px;
  }
  
  /* Social Links */
  .social-links {
    margin-top: 15px;
    display: flex;
    gap: 15px;
  }
  .social-links a {
    color: white;
    font-size: 1.5rem;
    transition: opacity 0.3s;
  }
  .social-links a:hover { opacity: 0.8; }
  
  /* Footer Links */
  .footer-links ul li {
    margin-bottom: 8px;
  }
  .footer-links a {
    color: rgba(255,255,255,0.8);
    transition: color 0.3s;
  }
  .footer-links a:hover { color: white; }
`;
document.head.appendChild(style);

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  generateProductSchema(); // ✅ Generate Schema.org markup
  
  document.getElementById('cartIcon').addEventListener('click', showCart);
  document.getElementById('closeCart').addEventListener('click', () => {
    document.getElementById('cartModal').classList.remove('active');
  });
  
  document.getElementById('cartModal').addEventListener('click', (e) => {
    if (e.target.id === 'cartModal') {
      document.getElementById('cartModal').classList.remove('active');
    }
  });
  
  document.getElementById('checkoutBtn').addEventListener('click', checkoutWhatsApp);
  
  // ✅ Keyboard accessibility untuk cart icon
  document.getElementById('cartIcon').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      showCart();
    }
  });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});