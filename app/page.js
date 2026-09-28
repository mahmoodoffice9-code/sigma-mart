'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
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

  useEffect(() => {
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
            <style>
              @keyframes slideUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
              }
              @keyframes pulseGlow {
                0%, 100% { box-shadow: 0 0 15px rgba(234, 88, 12, 0.4); }
                50% { box-shadow: 0 0 30px rgba(234, 88, 12, 0.8); }
              }
              .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
              .animate-glow { animation: pulseGlow 3s infinite; }
            </style>
          </head>
          <body class="bg-gray-50 text-gray-950 font-sans">
            <header class="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 px-8 py-5 flex items-center justify-between shadow-md">
              <div class="text-2xl font-black text-orange-600 flex items-center gap-2 tracking-wide transform hover:scale-110 transition duration-300">
                <span>🛒</span> ONLINE SHOP
              </div>
              <button onclick="window.close()" class="text-sm font-bold bg-gray-100 hover:bg-red-500 hover:text-white px-5 py-2.5 rounded-xl text-gray-700 transition-all duration-300 transform hover:scale-105 shadow">✕ Close Tab</button>
            </header>

            <main class="max-w-7xl mx-auto px-6 py-16 animate-slide-up">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-start bg-white p-10 rounded-3xl border border-gray-200 shadow-2xl animate-glow">
                <!-- Left: Product Image -->
                <div class="overflow-hidden rounded-2xl group shadow-lg">
                  <div class="w-full h-[450px] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center">
                    <img src="${product.image_url || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2'}" class="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-125 group-hover:rotate-1" />
                  </div>
                </div>

                <!-- Right: Product Details -->
                <div class="space-y-6">
                  <h1 class="text-4xl font-black text-gray-900 leading-snug tracking-tight">${product.name}</h1>
                  
                  <div class="flex items-center gap-3">
                    <span class="text-amber-500 text-lg animate-pulse">★★★★★</span>
                    <span class="text-sm text-gray-500 font-medium">(0) Reviews</span>
                  </div>

                  <div class="text-xs bg-emerald-100 text-emerald-800 font-bold px-4 py-2 rounded-full inline-block shadow-sm">
                    ✓ 50 In Stock
                  </div>

                  <div class="text-5xl font-black text-orange-600 tracking-tight">
                    Rs.${product.price}
                  </div>

                  <div class="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-200 text-sm space-y-2 shadow-inner">
                    <div class="flex justify-between font-bold text-gray-800 text-base">
                      <span>Total price:</span>
                      <span class="text-orange-600 text-xl">Rs.${product.price}</span>
                    </div>
                    <div class="text-gray-500 text-xs font-semibold">Tax: Incl. • Fast Shipping Available</div>
                  </div>

                  <div class="flex gap-4 pt-4">
                    <button onclick="alert('Order placed successfully!')" class="flex-1 bg-gray-950 text-white font-bold py-4 rounded-2xl hover:bg-orange-600 transition-all duration-300 shadow-xl transform hover:-translate-y-2 hover:scale-105 active:scale-95">
                      Buy Now ⚡
                    </button>
                    <button onclick="alert('Added to cart successfully!')" class="flex-1 bg-orange-500 text-white font-bold py-4 rounded-2xl hover:bg-orange-600 transition-all duration-300 shadow-xl transform hover:-translate-y-2 hover:scale-105 active:scale-95">
                      Add To Cart 🛒
                    </button>
                  </div>
                </div>
              </div>

              <!-- Bottom: Product Description Section -->
              <div class="mt-12 bg-white p-10 rounded-3xl border border-gray-200 shadow-2xl transition-all duration-500 hover:shadow-orange-100">
                <h3 class="text-2xl font-black text-gray-900 mb-4 pb-3 border-b border-gray-200">Product Description</h3>
                <p class="text-gray-700 text-lg leading-relaxed whitespace-pre-line">${product.description || 'No detailed description provided for this product.'}</p>
              </div>
            </main>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-amber-500 selection:text-white">
      
      {/* Custom CSS for Heavy Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes glowBorder {
          0%, 100% { border-color: rgba(245, 158, 11, 0.3); box-shadow: 0 0 20px rgba(245, 158, 11, 0.2); }
          50% { border-color: rgba(245, 158, 11, 0.9); box-shadow: 0 0 40px rgba(245, 158, 11, 0.6); }
        }
        @keyframes fadeInScale {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-glow-box { animation: glowBorder 4s infinite; }
        .animate-fade-scale { animation: fadeInScale 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      {/* 1. Navbar */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 shadow-2xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="#" className="text-2xl font-black tracking-wider text-amber-500 flex items-center gap-2 transform hover:scale-125 hover:rotate-6 transition duration-300">
            <span>⚡</span> Sigma Mart
          </a>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-300">
            <a href="#" className="hover:text-amber-400 transition transform hover:-translate-y-1 hover:scale-110">HOME</a>
            <a href="#categories" className="hover:text-amber-400 transition transform hover:-translate-y-1 hover:scale-110">CATEGORIES</a>
            <a href="#products" className="hover:text-amber-400 transition transform hover:-translate-y-1 hover:scale-110">PRODUCTS</a>
            <a href="#about" className="hover:text-amber-400 transition transform hover:-translate-y-1 hover:scale-110">ABOUT</a>
            <a href="#contact" className="hover:text-amber-400 transition transform hover:-translate-y-1 hover:scale-110">CONTACT</a>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-3 animate-fade-scale">
                <span className="text-xs font-semibold bg-slate-800 text-amber-400 px-4 py-2 rounded-full shadow-lg border border-slate-700">
                  {user.isAdmin ? '👑 Admin' : '👤 User'}: {user.email}
                </span>
                <button onClick={handleLogout} className="bg-red-500/20 text-red-400 border border-red-500/50 px-4 py-2 rounded-full font-bold text-xs hover:bg-red-500 hover:text-white transition duration-300 transform hover:scale-110 shadow-lg">
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={() => { setAuthMode('login'); setIsAuthOpen(true); }} className="border-2 border-amber-500 text-amber-400 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-amber-500 hover:text-slate-950 transition duration-300 transform hover:scale-110 shadow-lg">
                Login / Signup
              </button>
            )}

            <a href="#products" className="bg-amber-500 text-slate-950 px-6 py-2.5 rounded-full font-extrabold text-sm hover:bg-amber-400 transition duration-300 transform hover:scale-110 shadow-xl hover:shadow-amber-500/50">
              Cart 🛒
            </a>
          </div>
        </div>
      </header>

      {/* 2. ADMIN PANEL */}
      {user && user.isAdmin && (
        <section className="bg-slate-900/90 border-b border-amber-500/30 py-12 px-4 sm:px-6 lg:px-8 animate-fade-scale">
          <div className="max-w-4xl mx-auto bg-slate-950 p-8 rounded-3xl shadow-2xl border-2 border-amber-500/50 animate-glow-box">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-amber-400">👑 Admin Dashboard (Product Manager)</h2>
              <span className="bg-amber-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full animate-bounce">Active Session</span>
            </div>
            
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Product Title</label>
                <input type="text" placeholder="e.g. Cyber Jacket" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white p-3.5 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition duration-300 shadow-inner" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Price (Rs.)</label>
                <input type="number" placeholder="e.g. 2299" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white p-3.5 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition duration-300 shadow-inner" required />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-400 mb-1">Description</label>
                <input type="text" placeholder="Full product description..." value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white p-3.5 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition duration-300 shadow-inner" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-400 mb-1">Image URL (Direct Link)</label>
                <input type="text" placeholder="https://i.ibb.co/xxxx/image.jpg" value={newImage} onChange={(e) => setNewImage(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white p-3.5 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition duration-300 shadow-inner" />
              </div>
              <div className="sm:col-span-2 mt-2">
                <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black py-4 rounded-xl hover:from-amber-400 hover:to-orange-400 transition duration-300 shadow-xl transform hover:-translate-y-1 hover:scale-[1.02]">
                  + Add Product to Database 🚀
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* 3. Hero Banner Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/40 py-28 px-4 sm:px-6 lg:px-8 border-b border-slate-800 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          <div className="space-y-6 text-center md:text-left animate-fade-scale">
            <span className="bg-amber-500/20 text-amber-400 border border-amber-500/50 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg inline-block animate-pulse">
              Limited Time Offer 🔥
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              Get Free High-Tech Gear on Orders Above <span className="text-amber-500 animate-pulse">Rs. 3,000!</span>
            </h1>
            <p className="text-slate-400 text-lg">
              Upgrade your lifestyle with exclusive tech essentials and cyber apparel delivered right to your doorstep with heavy speeds.
            </p>
            <div>
              <a href="#products" className="inline-block bg-amber-500 text-slate-950 font-black px-9 py-4 rounded-full hover:bg-amber-400 transition duration-300 shadow-2xl transform hover:scale-110 hover:shadow-amber-500/50 active:scale-95">
                Shop All Products 🚀
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-full max-w-md h-80 bg-gradient-to-tr from-amber-500/20 to-orange-500/20 rounded-3xl border-2 border-amber-500/40 shadow-2xl flex items-center justify-center p-6 animate-float animate-glow-box">
              <div className="text-center">
                <span className="text-7xl mb-3 block animate-bounce">⚡🛍️</span>
                <p className="font-extrabold text-2xl text-amber-400">Sigma Premium Collection</p>
                <p className="text-sm text-slate-400 mt-1">Quality Assured • Fast Shipping</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Categories Section */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-white">Shop By Categories</h2>
          <p className="text-slate-400 mt-2">Explore our curated collections designed for peak performance.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {['Cyber Apparel', 'Tech Gear', 'Accessories', 'Exclusive Drops'].map((cat, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center hover:shadow-2xl hover:border-amber-500 transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 cursor-pointer group shadow-xl">
              <div className="h-20 bg-slate-800 rounded-2xl w-20 mx-auto mb-4 flex items-center justify-center text-amber-400 font-bold text-2xl group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-500 group-hover:rotate-45 group-hover:scale-110 shadow-lg">
                📦
              </div>
              <h3 className="font-bold text-slate-200 group-hover:text-amber-400 transition">{cat}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Products Section */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-slate-900/40 rounded-3xl my-8 border border-slate-800/80 shadow-2xl">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-black text-white">Featured Products</h2>
            <p className="text-slate-400 mt-1">Live inventory loaded straight from Supabase database.</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-2xl mb-6 text-center font-medium shadow-lg">
            Error loading products: {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-amber-400 font-bold text-lg animate-pulse">Loading heavy products... ⏳</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products && products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl hover:shadow-amber-500/20 hover:border-amber-500/60 transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] flex flex-col justify-between group">
                  <div>
                    <div className="h-60 bg-slate-950 rounded-2xl mb-4 overflow-hidden relative cursor-pointer shadow-inner" onClick={() => openProductInNewTab(product)}>
                      <img 
                        src={product.image_url && product.image_url.trim() !== '' ? product.image_url : "https://images.unsplash.com/photo-1556905055-8f358a7a47b2"} 
                        alt={product.name} 
                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-125 group-hover:rotate-2" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <span className="text-amber-400 text-xs font-bold tracking-wider uppercase">Click to view details ↗</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => openProductInNewTab(product)} 
                      className="font-extrabold text-xl text-white mb-2 hover:text-amber-400 transition duration-300 text-left block w-full underline decoration-amber-500/50 decoration-2 underline-offset-4 cursor-pointer"
                    >
                      {product.name} ↗
                    </button>

                    <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">{product.description || "High quality sigma gear built for performance."}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-amber-400 font-black text-2xl">Rs.{product.price}</span>
                      <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-3.5 py-1.5 rounded-full shadow-md animate-pulse">In Stock</span>
                    </div>
                    
                    <div className="flex gap-3">
                      <button className="flex-1 bg-slate-800 text-white py-3.5 rounded-2xl font-bold hover:bg-amber-500 hover:text-slate-950 transition-all duration-300 shadow-xl text-sm transform hover:scale-105 active:scale-95">
                        Add to Cart 🛒
                      </button>
                      
                      {user && user.isAdmin && (
                        <button 
                          type="button"
                          onClick={() => handleDeleteProduct(product.id)} 
                          className="bg-red-500/20 text-red-400 border border-red-500/40 px-4 py-3.5 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all duration-300 text-sm cursor-pointer z-10 transform hover:scale-110 active:scale-95 shadow-xl" 
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
              <div className="col-span-full text-center py-20 text-slate-500 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl font-medium">
                No products found in database. 🛠️
              </div>
            )}
          </div>
        )}
      </section>

      {/* 6. About Section */}
      <section id="about" className="max-w-5xl mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-black text-white mb-6">About Sigma Mart</h2>
        <p className="text-slate-400 text-lg leading-relaxed max-w-3xl mx-auto">
          Sigma Mart is built to provide seamless, ultra-fast online shopping experiences with heavy dynamic animations. We bring top-tier products, secure transactions, and clean modern interfaces together.
        </p>
      </section>

      {/* 7. Contact Section */}
      <section id="contact" className="bg-slate-900 text-white py-24 px-4 border-t border-slate-800 shadow-2xl">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-4">Get In Touch</h2>
          <p className="text-slate-400 mb-8">Have questions about our drops or need support? Reach out anytime.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <input type="email" placeholder="Enter your email address" className="px-6 py-4 rounded-full bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500 w-full sm:w-80 shadow-inner transition duration-300" />
            <button className="bg-amber-500 text-slate-950 font-black px-9 py-4 rounded-full hover:bg-amber-400 transition duration-300 shadow-2xl transform hover:scale-110 hover:shadow-amber-500/50">
              Contact Us ✉️
            </button>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="bg-slate-950 text-slate-500 py-8 text-center text-sm border-t border-slate-900">
        <p>© 2026 Sigma Mart. Powered by Next.js & Supabase. All rights reserved. ⚡</p>
      </footer>

      {/* LOGIN / SIGNUP MODAL */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-scale">
          <div className="bg-slate-900 text-white rounded-3xl max-w-md w-full p-8 shadow-2xl border-2 border-amber-500/50 relative transform transition-all duration-300 animate-glow-box">
            <button onClick={() => setIsAuthOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white font-bold text-xl transition transform hover:rotate-90 hover:scale-125">
              ✕
            </button>
            
            <h3 className="text-2xl font-black text-amber-400 mb-2">
              {authMode === 'login' ? 'Welcome Back 👋' : 'Create Account 🚀'}
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              {authMode === 'login' ? 'Login with admin credentials to manage store.' : 'Sign up to start shopping.'}
            </p>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Email Address</label>
                <input type="email" placeholder="Mahmoodoffice9@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-700 text-white p-3.5 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition shadow-inner" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Password</label>
                <input type="password" placeholder="12345678" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-700 text-white p-3.5 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition shadow-inner" required />
              </div>
              <button type="submit" className="w-full bg-amber-500 text-slate-950 font-black py-4 rounded-xl hover:bg-amber-400 transition duration-300 shadow-xl transform hover:-translate-y-1 hover:scale-[1.02]">
                {authMode === 'login' ? 'Login' : 'Sign Up'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-400">
              {authMode === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <button onClick={() => setAuthMode('signup')} className="text-amber-400 font-bold hover:underline">
                    Sign Up
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button onClick={() => setAuthMode('login')} className="text-amber-400 font-bold hover:underline">
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
