'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShoppingCart, Search, Filter, Star, Package, Sparkles, Check, SlidersHorizontal } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/components/CartProvider';
import toast from 'react-hot-toast';

function ShopPageContent() {
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc'>('name');
  const [showFilters, setShowFilters] = useState(false);
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());

  // Read search query from URL on mount
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
    const urlCategory = searchParams.get('category');
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [searchParams]);

  useEffect(() => {
    loadData();
  }, []);

  const handleAddToCart = (product: any) => {
    const displayName = (product.name_sl || product.name || 'Izdelek').trim();
    addToCart({
      id: product.id,
      name: displayName,
      price: Number(product.price),
      type: 'product',
      image: product.image_url,
    }, 1);
    
    // Show added animation
    setAddedProducts(prev => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedProducts(prev => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1500);
    
    toast.success(`${displayName} dodan v košarico`);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: cats } = await supabase
        .from('shop_categories')
        .select('id, name, name_sl, description, description_sl, active, order_index')
        .eq('active', true)
        .order('order_index', { ascending: true });

      const { data: prods } = await supabase
        .from('shop_products')
        .select('id, name, name_sl, description, description_sl, price, image_url, stock, category_id, slug, active')
        .eq('active', true)
        .order('name', { ascending: true });

      setCategories(cats || []);
      setProducts(prods || []);
    } catch (error) {
      console.error('Failed to load shop data:', error);
    }
    setLoading(false);
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(p => {
    const matchesSearch = !searchQuery || 
      p.name_sl?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description_sl?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || p.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
    if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
    return (a.name_sl || a.name || '').localeCompare(b.name_sl || b.name || '', 'sl');
  });

  const byCategory: Record<string, any[]> = {};
  sortedProducts.forEach((p) => {
    const key = p.category_id || 'uncategorized';
    if (!byCategory[key]) byCategory[key] = [];
    byCategory[key].push(p);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50 py-20">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles size={16} />
            Premium Izdelki za Vaše Zdravje
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent mb-4">
            Trgovina
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Prehranska dopolnila, funkcionalne gobe, homeopatija, zeliščni pripravki in premium CBD izdelki za vašo zdravje in počutje.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-4 md:p-6">
          <div className="flex flex-col gap-4">
            {/* Search Input */}
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="text-gray-400" size={20} />
              </div>
              <input
                type="text"
                placeholder="Išči po imenu ali opisu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 h-12 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all"
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  !selectedCategory 
                    ? 'bg-teal-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Vse kategorije
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    selectedCategory === cat.id 
                      ? 'bg-teal-600 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {(cat.name_sl || cat.name || '').trim()}
                </button>
              ))}
            </div>
          </div>
          
          {/* Sort and Results */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-sm text-gray-600 font-medium">
              Prikazano: {filteredProducts.length} {filteredProducts.length === 1 ? 'izdelek' : 'izdelkov'}
              {searchQuery && ` za "${searchQuery}"`}
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
              >
                <option value="name">Po imenu (A-Ž)</option>
                <option value="price-asc">Cena: nizka → visoka</option>
                <option value="price-desc">Cena: visoka → nizka</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {categories.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg font-medium">Ni kategorij na voljo</p>
            <p className="text-gray-500 text-sm mt-2">Seeding podatkov v teku...</p>
          </div>
        ) : (
          (selectedCategory ? [categories.find(c => c.id === selectedCategory)].filter(Boolean) : categories).map((cat) => (
            <section key={cat.id} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-teal-500 to-green-500 rounded-full"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{(cat.name_sl || cat.name || '').trim()}</h2>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                  {(byCategory[cat.id] || []).length} izdelkov
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {(byCategory[cat.id] || []).length === 0 ? (
                  <div className="col-span-full text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                    <Package size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500 font-medium">Ni izdelkov v tej kategoriji</p>
                  </div>
                ) : (
                  (byCategory[cat.id] || []).map((p) => {
                    const descriptionText = (p.description_sl || p.description || '').trim();
                    const shortDescription = descriptionText.length > 220 ? `${descriptionText.slice(0, 220)}…` : descriptionText;

                    return (
                    <div key={p.id} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
                      <Link href={`/trgovina/${p.slug}`} className="flex-1 flex flex-col">
                        <div className="relative flex-1 bg-gray-50 overflow-hidden">
                          {p.image_url ? (
                            <div className="relative w-full h-64 overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img 
                                src={p.image_url} 
                                alt={(p.name_sl || p.name || '').trim()} 
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-4" 
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                          ) : (
                            <div className="h-64 w-full bg-gradient-to-br from-teal-100 to-green-100 flex items-center justify-center">
                              <Package size={48} className="text-teal-300" />
                            </div>
                          )}
                          
                          {/* Badge for stock status */}
                          {p.stock !== null && p.stock <= 5 && p.stock > 0 && (
                            <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                              Samo še {p.stock}!
                            </div>
                          )}
                          {p.stock === 0 && (
                            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                              Razprodano
                            </div>
                          )}
                        </div>
                      </Link>
                      
                      <div className="p-5 flex flex-col flex-1">
                        <Link href={`/trgovina/${p.slug}`}>
                          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors line-clamp-2 min-h-14">
                            {(p.name_sl || p.name || '').trim()}
                          </h3>
                        </Link>
                        
                        {(p.description_sl || p.description) && (
                          <p className="text-sm text-gray-700 mb-3 flex-1 leading-relaxed">
                            {shortDescription || 'Opis bo kmalu na voljo v slovenščini.'}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                          <div className="flex flex-col">
                            <span className="text-2xl font-bold text-teal-600">
                              €{Number(p.price || 0).toFixed(2)}
                            </span>
                            <span className="text-xs text-gray-500 mt-1 font-medium">
                              {p.stock > 0 ? `Na zalogi: ${p.stock}` : 'Ni na zalogi'}
                            </span>
                          </div>
                          <button
                            onClick={() => handleAddToCart(p)}
                            disabled={p.stock === 0 || addedProducts.has(p.id)}
                            className={`px-3 py-2 rounded-lg font-semibold transition-all text-sm flex items-center gap-1 ${
                              addedProducts.has(p.id)
                                ? 'bg-green-500 text-white'
                                : p.stock === 0
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-teal-600 text-white hover:bg-teal-700'
                            }`}
                          >
                            {addedProducts.has(p.id) ? (
                              <>
                                <Check size={16} />
                                Dodano
                              </>
                            ) : (
                              <>
                                <ShoppingCart size={16} />
                                Dodaj
                              </>
                            )}
                          </button>
                        </div>

                        <Link
                          href={`/trgovina/${p.slug}`}
                          className="mt-3 inline-flex items-center text-teal-600 font-semibold text-sm hover:underline"
                        >
                          Več podrobnosti v slovenščini →
                        </Link>
                      </div>
                    </div>
                    );
                  })
                )}
              </div>
            </section>
          ))
        )}

        {filteredProducts.length === 0 && searchQuery && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <Search size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg font-medium">Ni rezultatov za "{searchQuery}"</p>
            <p className="text-gray-500 text-sm mt-2">Poskusite z drugimi ključnimi besedami</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-4 text-teal-600 font-medium hover:underline"
            >
              Počisti iskanje
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={(
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-200 border-t-teal-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Nalagam izdelke...</p>
          </div>
        </div>
      )}
    >
      <ShopPageContent />
    </Suspense>
  );
}
