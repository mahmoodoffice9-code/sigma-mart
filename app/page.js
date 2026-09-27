import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function Home() {
  // Fetch products from Supabase table 'products'
  const { data: products, error } = await supabase.from('products').select('*');

  if (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10 border-b border-gray-800 pb-4">
          <h1 className="text-2xl font-bold tracking-wider text-red-500">🔥 ROGUE STORE</h1>
          <span className="text-sm text-gray-400">Powered by Supabase & Vercel</span>
        </header>

        <h2 className="text-xl font-semibold mb-6">Available Products</h2>

        {products && products.length === 0 ? (
          <p className="text-gray-400">No products found in the database. Add items in Supabase!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products?.map((product) => (
              <div key={product.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex flex-col justify-between">
                <div>
                  {product.image && (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{product.description}</p>
                </div>
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-lg font-semibold text-green-400">${product.price}</span>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition cursor-pointer">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
