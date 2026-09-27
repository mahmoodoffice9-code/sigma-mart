import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// Supabase client initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function Home() {
  const { data: products, error } = await supabase.from('products').select('*');

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      
      {/* 1. Professional Navbar (Matching Reference Layout) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo / Brand Name */}
          <Link href="/" className="text-2xl font-black tracking-wider text-amber-600 flex items-center gap-2">
            <span>⚡</span> Sigma Mart
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-gray-700">
            <Link href="/" className="hover:text-amber-600 transition">HOME</Link>
            <Link href="#categories" className="hover:text-amber-600 transition">CATEGORIES</Link>
            <Link href="#products" className="hover:text-amber-600 transition">PRODUCTS</Link>
            <Link href="#about" className="hover:text-amber-600 transition">ABOUT</Link>
            <Link href="#contact" className="hover:text-amber-600 transition">CONTACT</Link>
          </nav>

          {/* Right Icons (Search / Cart) */}
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="bg-amber-600 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-amber-700 transition shadow-md">
              Cart 🛒
            </Link>
          </div>

        </div>
      </header>

      {/* 2. Hero Banner Section (Like Reference Image) */}
      <section className="relative bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 py-24 px-4 sm:px-6 lg:px-8 border-b border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          
          {/* Left Text Content */}
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

          {/* Right Hero Visual Showcase */}
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

      {/* 3. Categories Section */}
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

      {/* 4. Products Section (From Supabase) */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50/50 rounded-3xl my-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">Featured Products</h2>
            <p className="text-gray-500 mt-1">Live inventory loaded straight from Supabase database.</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-center font-medium">
            Error loading products: {error.message}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products && products.length > 0 ? (
            products.map((product) => (
              <div key={product.id || product.name} className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-xl transition flex flex-col justify-between group">
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
                  <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-amber-600 transition shadow-sm">
                    Add to Cart 🛒
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100 shadow-sm">
              No products found in database. Add items in your Supabase table! 🛠️
            </div>
          )}
        </div>
      </section>

      {/* 5. About Section */}
      <section id="about" className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">About Sigma Mart</h2>
        <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
          Sigma Mart is built to provide seamless, ultra-fast online shopping experiences. We bring top-tier products, secure transactions, and clean modern interfaces together to give you the ultimate digital shopping destination.
        </p>
      </section>

      {/* 6. Contact Section */}
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

      {/* 7. Footer */}
      <footer className="bg-gray-950 text-gray-400 py-8 text-center text-sm border-t border-gray-900">
        <p>© 2026 Sigma Mart. Powered by Next.js & Supabase. All rights reserved. ⚡</p>
      </footer>

    </div>
  );
}
