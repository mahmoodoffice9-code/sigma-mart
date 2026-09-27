'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase client initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auth & Admin State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null); // { email, isAdmin }

  // Admin New Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newImage, setNewImage] = useState('');

  // Fetch Products on Load
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

  // Handle Login / Signup Submission
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

  // Handle Logout
  const handleLogout = () => {
    setUser(null);
    alert('Logged out successfully.');
  };

  // Admin: Add Product to Supabase
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
        image_url: newImage || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2'
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
      fetchProducts(); // Refresh list
    }
  };

  // Admin: Delete Product from Supabase
  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      alert('Error deleting product: ' + error.message);
    } else {
      alert('Product deleted successfully! 🗑️');
      fetchProducts(); // Refresh list
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      
      {/* 1. Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="#" className="text-2xl font-black tracking-wider text-amber-600 flex items-center gap-2">
            <span>⚡</span> Sigma Mart
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

      {/* 2. ADMIN PANEL (Only visible if user is admin Mahmoodoffice9@gmail.com) */}
      {user && user.isAdmin && (
        <section className="bg-amber-50 border-b border-amber-200 py-12 px-4 sm:px-6 lg:px-8">
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
                <label className="block text-xs font-bold text-gray-600 mb-1">Price ($)</label>
                <input type="number" placeholder="e.g. 59.99" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-amber-500" required />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-600 mb-1">Description</label>
                <input type="text" placeholder="Short description..." value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-amber-500" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-600 mb-1">Image URL (Optional)</label>
                <input type="text" placeholder="https://image-link.com/photo.jpg" value={newImage} onChange={(e) => setNewImage(e.target.value)} className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-amber-500" />
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

      {/* 3. Hero Banner Section */}
      <section className="relative bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 py-24 px-4 sm:px-6 lg:px-8 border-b border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          <div className="space-y-6 text-center md:text-left">
            <span className="bg-amber-200/60 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
              Limited Time Offer 🔥
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Get Free High-Tech Gear on Orders Above <span className="text-amber-600">Rs. 3,000!</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Upgrade your lifestyle with exclusive tech essentials and cyber apparel delivered right to your doorstep.
            </p>
            <div>
              <a href="#products" className="inline-block bg-gray-950 text-white font-bold px-8 py-3.5 rounded-full hover:bg-amber-600 transition shadow-lg">
                Shop All Products 🚀
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-full max-w-md h-80 bg-gradient-to-tr from-amber-200/40 to-orange-200/60 rounded-3xl border border-amber-200/60 shadow-xl flex items-center justify-center p-6">
              <div className="text-center">
                <span className="text-6xl mb-3 block">⚡🛍️</span>
                <p className="font-bold text-xl text-gray-800">Sigma Premium Collection</p>
                <p className="text-sm text-gray-500 mt-1">Quality Assured • Fast Shipping</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Categories Section */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">Shop By Categories</h2>
          <p className="text-gray-500 mt-2">Explore our curated collections designed for peak performance.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {['Cyber Apparel', 'Tech Gear', 'Accessories', 'Exclusive Drops'].map((cat, idx) => (
            <div key={idx} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center hover:shadow-lg hover:border-amber-500 transition cursor-pointer group">
              <div className="h-16 bg-amber-100 rounded-full w-16 mx-auto mb-4 flex items-center justify-center text-amber-600 font-bold text-xl group-hover:bg-amber-600 group-hover:text-white transition">
                📦
              </div>
              <h3 className="font-bold text-gray-800">{cat}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Products Section */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50/50 rounded-3xl my-8">
        <div className="flex items-center justify-between mb-12">
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
              products.map((product) => (
                <div key={product.id} className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-xl transition flex flex-col justify-between group">
                  <div>
                    <div className="h-52 bg-gray-100 rounded-xl mb-4 overflow-hidden relative">
                      <img 
                        src={product.image_url || "https://images.unsplash.com/photo-1556905055-8f358a7a47b2"} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                      />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description || "High quality sigma gear built for performance."}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-amber-600 font-extrabold text-xl">${product.price}</span>
                      <span className="text-xs bg-emerald-50 text-emerald-600 font-semibold px-2.5 py-1 rounded-full">In Stock</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-amber-600 transition shadow-sm text-sm">
                        Add to Cart 🛒
                      </button>
                      
                      {/* Delete Button visible only to Admin */}
                      {user && user.isAdmin && (
                        <button onClick={() => handleDeleteProduct(product.id)} className="bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-xl font-bold hover:bg-red-600 hover:text-white transition text-sm">
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
      <section id="about" className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">About Sigma Mart</h2>
        <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
          Sigma Mart is built to provide seamless, ultra-fast online shopping experiences. We bring top-tier products, secure transactions, and clean modern interfaces together to give you the ultimate digital shopping destination.
        </p>
      </section>

      {/* 7. Contact Section */}
      <section id="contact" className="bg-gray-900 text-white py-20 px-4">
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
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-100 relative">
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
