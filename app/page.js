import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// Supabase client initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function Home() {
  // Supabase se products fetch karna
  const { data: products, error } = await supabase.from('products').select('*');

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      
      {/* 1. Navbar / Header */}
      <header className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Name (Clickable to Home) */}
          <Link href="/" className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-90 transition">
            Sigma Mart ⚡
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="hover:text-cyan-400 transition">Home</Link>
            <Link href="#products" className="hover:text-cyan-400 transition">Products</Link>
            <Link href="#categories" className="hover:text-cyan-400 transition">Categories</Link>
            
            {/* Cart Button */}
            <Link href="/cart" className="bg-cyan-500 text-gray-950 px-4 py-2 rounded-lg font-bold hover:bg-cyan-400 transition shadow-md">
              Cart 🛒
            </Link>
          </nav>

        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="py-20 text-center bg-gradient-to-b from-gray-900 to-gray-950 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
            Welcome to <span className="text-cyan-400">Sigma Mart</span> 🚀
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Your ultimate destination for high-tech gear, cyber apparel, and exclusive drops. Built with speed and precision.
          </p>
          <a href="#products" className="inline-block bg-cyan-500 text-gray-950 font-bold px-8 py-3 rounded-xl hover:bg-cyan-400 transition shadow-lg">
            Shop Now 🔥
          </a>
        </div>
      </section>

      {/* 3. Categories Quick-Bar */}
      <section id="categories" className="max-w-7xl mx-auto px-4 py-8 border-b border-gray-900">
        <div className="flex flex-wrap justify-center gap-4">
          {['All Products', 'Cyber Apparel', 'Tech Gear', 'Accessories'].map((cat, idx) => (
            <button key={idx} className="bg-gray-900 border border-gray-800 px-6 py-2 rounded-full text-sm font-semibold hover:border-cyan-400 hover:text-cyan-400 transition">
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 4. Products Grid Section */}
      <section id="products" className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold border-l-4 border-cyan-400 pl-3">Featured Products</h2>
          <span className="text-sm text-gray-400">Live from Supabase Database ⚡</span>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-center">
            Error loading products: {error.message}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products && products.length > 0 ? (
            products.map((product) => (
              <div key={product.id || product.name} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-cyan-500 transition shadow-md flex flex-col justify-between">
                <div>
                  <div className="h-48 bg-gray-800 rounded-xl mb-4 flex items-center justify-center text-gray-500 overflow-hidden relative">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <span>[No Image]</span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description || "High quality sigma gear."}</p>
                </div>
                <div>
                  <p className="text-cyan-400 font-bold text-lg mb-4">${product.price}</p>
                  <button className="w-full bg-gray-800 border border-gray-700 py-2.5 rounded-xl font-medium hover:bg-cyan-500 hover:text-gray-950 transition shadow-sm">
                    Add to Cart 🛒
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500 bg-gray-900/50 rounded-2xl border border-gray-800">
              No products found in database. Add some items to your Supabase table! 🛠️
            </div>
          )}
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-8 text-center text-gray-500 text-sm">
        <p>© 2026 Sigma Mart. Powered by Next.js & Supabase. ⚡</p>
      </footer>

    </div>
  );
}
