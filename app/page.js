'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newImage, setNewImage] = useState('');

  // Categories data with specific images
  const categories = [
    { name: 'Cyber Apparel', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f' },
    { name: 'Tech Gear', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475' },
    { name: 'Accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30' },
    { name: 'Exclusive Drops', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e' }
  ];

  useEffect(() => {
    // Load AOS animations library dynamically on client side safely
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/aos@next/dist/aos.js';
      script.async = true;
      script.onload = () => {
        if (window.AOS) {
          window.AOS.init({
            duration: 800,
            once: false,
            mirror: true
          });
        }
      };
      document.body.appendChild(script);

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/aos@next/dist/aos.css';
      document.head.appendChild(link);
    }

    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      setError(error.message);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  }

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (authMode === 'login') {
      if (email === 'Mahmoodoffice9@gmail.com' && password === '12345678') {
        setUser({ email, isAdmin: true });
        alert('Welcome back, Admin Mahmood! ⚡');
      } else {
        setUser({ email, isAdmin: false });
        alert(`Logged in successfully as ${email}! 🎉`);
      }
    } else {
      alert(`Account created successfully for ${email}! You are now logged in. 🎉`);
      setUser({ email, isAdmin: email === 'Mahmoodoffice9@gmail.com' });
    }
    setIsAuthOpen(false);
    setEmail('');
    setPassword('');
  };

  const handleLogout = () => {
    setUser(null);
    alert('Logged out successfully.');
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newTitle || !newPrice) {
      alert('Please fill in at least the product title and price!');
      return;
    }

    const { data, error } = await supabase.from('products').insert([
      {
        name: newTitle,
        price: parseFloat(newPrice),
        description: newDesc || 'High quality sigma gear.',
        image_url: newImage && newImage.trim() !== '' ? newImage : 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2'
      }
    ]).select();

    if (error) {
      alert('Error adding product: ' + error.message);
    } else {
      alert('Product added successfully! 🚀');
      setNewTitle('');
      setNewPrice('');
      setNewDesc('');
      setNewImage('');
      fetchProducts();
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Kya aap waqai is product ko delete karna chahte hain?')) return;

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      
      if (error) {
        alert('Delete failed: ' + error.message);
      } else {
        alert('Product successfully delete ho gaya! 🗑️');
        fetchProducts();
      }
    } catch (err) {
      alert('Unexpected error occurred while deleting.');
    }
  };

  const openProductInNewTab = (product) => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>${product.name} - Online Shop</title>
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body class="bg-white text-gray-900 font-sans">
            <header class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
              <div class="text-2xl font-black text-orange-600 flex items-center gap-2">
                <span>🛒</span> ONLINE SHOP
              </div>
              <button onclick="window.close()" class="text-sm font-bold bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-gray-700 transition">✕ Close Tab</button>
            </header>

            <main class="max-w-7xl mx-auto px-6 py-12">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-start bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                  <div class="w-full h-[450px] bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 shadow-inner flex items-center justify-center">
                    <img src="${product.image_url || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2'}" class="w-full h-full object-cover" />
                  </div>
                </div>

                <div class="space-y-6">
                  <h1 class="text-3xl font-extrabold text-gray-900 leading-snug">${product.name}</h1>
                  
                  <div class="flex items-center gap-3">
                    <span class="text-amber-500 text-lg">★★★★★</span>
                    <span class="text-sm text-gray-500 font-medium">(0) Reviews</span>
                  </div>

                  <div class="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full inline-block">
                    ✓ 50 In Stock
                  </div>

                  <div class="text-3xl font-black text-orange-600">
                    Rs.${product.price}
                  </div>

                  <div class="bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm space-y-2">
                    <div class="flex justify-between font-bold text-gray-800">
                      <span>Total price:</span>
                      <span class="text-orange-600">Rs.${product.price}</span>
                    </div>
                    <div class="text-gray-500 text-xs">Tax: Incl.</div>
                  </div>

                  <div class="flex gap-4 pt-2">
                    <button onclick="alert('Order placed successfully!')" class="flex-1 bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition shadow-md">
                      Buy Now
                    </button>
                    <button onclick="alert('Added to cart successfully!')" class="flex-1 bg-orange-500 text-white font-bold py-3.5 rounded-xl hover:bg-orange-600 transition shadow-md">
                      Add To Cart
                    </button>
                  </div>
                </div>
              </div>

              <div class="mt-12 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h3 class="text-xl font-extrabold text-gray-900 mb-4 pb-3 border-b border-gray-100">Product Description</h3>
                <p class="text-gray-700 text-base leading-relaxed whitespace-pre-line">${product.description || 'No detailed description provided for this product.'}</p>
              </div>
            </main>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden scroll-smooth">
      
      {/* Custom Styles matching theme + Marquee Animation */}
      <style jsx global>{`
        .gradient-text { background: linear-gradient(135deg, #d97706 0%, #ea580c 50%, #fbbf24 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .glass-card { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(16px); border: 1px solid rgba(245, 158, 11, 0.2); box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.08); transition: all 0.4s ease; }
        .glass-card:hover { border-color: rgba(245, 158, 11, 0.6); transform: translateY(-4px); }
        .glow-button { box-shadow: 0 0 20px rgba(245, 158, 11, 0.4); }

        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      {/* 1. Navbar */}
      <header data-aos="fade-down" data-aos-duration="800" className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="#" className="text-2xl font-black tracking-wider text-amber-600 flex items-center gap-2">
            <span className="bg-amber-600 text-white p-1.5 rounded-xl text-lg font-bold shadow-md shadow-amber-500/30">⚡</span> Sigma Mart
          </a>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-gray-700">
            <a href="#" className="hover:text-amber-600 transition">HOME</a>
            <a href="#categories" className="hover:text-amber-600 transition">CATEGORIES</a>
            <a href="#products" className="hover:text-amber-600 transition">PRODUCTS</a>
            <a href="#about" className="hover:text-amber-600 transition">ABOUT</a>
            <a href="#contact" className="hover:text-amber-600 transition">CONTACT</a>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold bg-gray-100 px-3 py-1.5 rounded-full text-gray-700">
                  {user.isAdmin ? '👑 Admin' : '👤 User'}: {user.email}
                </span>
                <button onClick={handleLogout} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-full font-bold text-xs hover:bg-gray-300 transition">
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={() => { setAuthMode('login'); setIsAuthOpen(true); }} className="border border-amber-600 text-amber-600 px-5 py-2 rounded-full font-bold text-sm hover:bg-amber-50 transition">
                Login / Signup
              </button>
            )}

            <a href="#products" className="bg-amber-600 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-amber-700 transition shadow-md">
              Cart 🛒
            </a>
          </div>
        </div>
      </header>

      {/* 2. ADMIN PANEL */}
      {user && user.isAdmin && (
        <section data-aos="zoom-in" className="bg-amber-50 border-b border-amber-200 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-lg border border-amber-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-amber-800">👑 Admin Dashboard (Product Manager)</h2>
              <span className="bg-amber-200 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">Active Session</span>
            </div>
            
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Product Title</label>
                <input type="text" placeholder="e.g. Cyber Jacket" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-amber-500" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Price (Rs.)</label>
                <input type="number" placeholder="e.g. 2299" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-amber-500" required />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-600 mb-1">Description</label>
                <input type="text" placeholder="Full product description..." value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-amber-500" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-600 mb-1">Image URL (Direct Link)</label>
                <input type="text" placeholder="https://i.ibb.co/xxxx/image.jpg" value={newImage} onChange={(e) => setNewImage(e.target.value)} className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-amber-500" />
              </div>
              <div className="sm:col-span-2 mt-2">
                <button type="submit" className="w-full bg-amber-600 text-white font-bold py-3.5 rounded-xl hover:bg-amber-700 transition shadow-md">
                  + Add Product to Database 🚀
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* 3. Hero Banner Section with AOS Animations */}
      <section className="relative bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 py-24 px-4 sm:px-6 lg:px-8 border-b border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          <div className="space-y-6 text-center md:text-left">
            <div data-aos="fade-down" data-aos-duration="1000" className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-amber-500/10 text-amber-800 rounded-full border border-amber-500/30 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span> Limited Time Offer 🔥
            </div>
            <h1 data-aos="zoom-in" data-aos-duration="1200" className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Get Free High-Tech Gear on Orders Above <span className="gradient-text">Rs. 3,000!</span>
            </h1>
            <p data-aos="fade-up" data-aos-delay="200" data-aos-duration="1000" className="text-gray-600 text-lg">
              Upgrade your lifestyle with exclusive tech essentials and cyber apparel delivered right to your doorstep.
            </p>
            <div data-aos="fade-up" data-aos-delay="400" data-aos-duration="1000">
              <a href="#products" className="glow-button inline-block bg-gray-950 text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-amber-600 transition shadow-lg">
                Shop All Products 🚀
              </a>
            </div>
          </div>
          <div data-aos="fade-left" data-aos-duration="1200" className="flex justify-center">
            <div className="relative w-full max-w-md h-80 bg-gradient-to-tr from-amber-200/40 to-orange-200/60 rounded-3xl border border-amber-200/60 shadow-xl flex items-center justify-center p-6">
              <div className="text-center">
                <span className="text-6xl mb-3 block animate-bounce">⚡🛍️</span>
                <p className="font-bold text-xl text-gray-800">Sigma Premium Collection</p>
                <p className="text-sm text-gray-500 mt-1">Quality Assured • Fast Shipping</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Categories Section with Right-to-Left Infinite Scroll & Images */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 overflow-hidden">
        <div data-aos="fade-up" className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">Shop By Categories</h2>
          <p className="text-gray-500 mt-2">Explore our curated collections designed for peak performance.</p>
        </div>

        <div className="relative w-full overflow-hidden py-4">
          <div className="animate-marquee flex gap-6">
            {/* Duplicating the categories array for seamless infinite sliding loop */}
            {[...categories, ...categories, ...categories].map((cat, idx) => (
              <div key={idx} className="glass-card rounded-2xl p-4 text-center cursor-pointer group w-64 flex-shrink-0">
                <div className="h-36 bg-gray-100 rounded-xl mb-4 overflow-hidden relative">
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                  />
                </div>
                <h3 className="font-bold text-gray-800 text-lg">{cat.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Products Section */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50/50 rounded-3xl my-8">
        <div data-aos="fade-up" className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">Featured Products</h2>
            <p className="text-gray-500 mt-1">Live inventory loaded straight from Supabase database.</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-center font-medium">
            Error loading products: {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-gray-400 font-medium">Loading products... ⏳</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products && products.length > 0 ? (
              products.map((product, idx) => (
                <div key={product.id} data-aos="zoom-in-up" data-aos-delay={idx * 100} className="glass-card rounded-2xl p-4 flex flex-col justify-between group">
                  <div>
                    <div className="h-52 bg-gray-100 rounded-xl mb-4 overflow-hidden relative cursor-pointer" onClick={() => openProductInNewTab(product)}>
                      <img 
                        src={product.image_url && product.image_url.trim() !== '' ? product.image_url : "https://images.unsplash.com/photo-1556905055-8f358a7a47b2"} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                      />
                    </div>
                    
                    <button 
                      onClick={() => openProductInNewTab(product)} 
                      className="font-bold text-lg text-gray-900 mb-1 hover:text-amber-600 transition text-left block w-full underline decoration-amber-300 decoration-2 underline-offset-4 cursor-pointer"
                    >
                      {product.name} ↗
                    </button>

                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description || "High quality sigma gear built for performance."}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-amber-600 font-extrabold text-xl">Rs.{product.price}</span>
                      <span className="text-xs bg-emerald-50 text-emerald-600 font-semibold px-2.5 py-1 rounded-full">In Stock</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button onClick={() => alert('Added to cart successfully!')} className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-amber-600 transition shadow-sm text-sm">
                        Add to Cart 🛒
                      </button>
                      
                      {user && user.isAdmin && (
                        <button 
                          type="button"
                          onClick={() => handleDeleteProduct(product.id)} 
                          className="bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-xl font-bold hover:bg-red-600 hover:text-white transition text-sm cursor-pointer z-10" 
                          title="Delete Product"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100 shadow-sm">
                No products found in database. 🛠️
              </div>
            )}
          </div>
        )}
      </section>

      {/* 6. About Section */}
      <section id="about" data-aos="fade-up" className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="glass-card p-10 rounded-3xl">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">About Sigma Mart</h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
            Sigma Mart is built to provide seamless, ultra-fast online shopping experiences. We bring top-tier products, secure transactions, and clean modern interfaces together to give you the ultimate digital shopping destination.
          </p>
        </div>
      </section>

      {/* 7. Contact Section */}
      <section id="contact" data-aos="fade-up" className="bg-gray-900 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-4">Get In Touch</h2>
          <p className="text-gray-400 mb-8">Have questions about our drops or need support? Reach out anytime.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <input type="email" placeholder="Enter your email address" className="px-6 py-3.5 rounded-full bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-amber-500 w-full sm:w-80" />
            <button className="bg-amber-600 text-white font-bold px-8 py-3.5 rounded-full hover:bg-amber-700 transition">
              Contact Us ✉️
            </button>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="bg-gray-950 text-gray-400 py-8 text-center text-sm border-t border-gray-900">
        <p>© 2026 Sigma Mart. Powered by Next.js & Supabase. All rights reserved. ⚡</p>
      </footer>

      {/* LOGIN / SIGNUP MODAL */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div data-aos="zoom-in" className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-100 relative">
            <button onClick={() => setIsAuthOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 font-bold text-lg">
              ✕
            </button>
            
            <h3 className="text-2xl font-black text-gray-900 mb-2">
              {authMode === 'login' ? 'Welcome Back 👋' : 'Create Account 🚀'}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {authMode === 'login' ? 'Login with admin credentials to manage store.' : 'Sign up to start shopping.'}
            </p>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Email Address</label>
                <input type="email" placeholder="Mahmoodoffice9@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-200 p-3.5 rounded-xl text-sm focus:outline-none focus:border-amber-500" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Password</label>
                <input type="password" placeholder="12345678" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-200 p-3.5 rounded-xl text-sm focus:outline-none focus:border-amber-500" required />
              </div>
              <button type="submit" className="w-full bg-amber-600 text-white font-bold py-3.5 rounded-xl hover:bg-amber-700 transition shadow-md">
                {authMode === 'login' ? 'Login' : 'Sign Up'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              {authMode === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <button onClick={() => setAuthMode('signup')} className="text-amber-600 font-bold hover:underline">
                    Sign Up
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button onClick={() => setAuthMode('login')} className="text-amber-600 font-bold hover:underline">
                    Login
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
