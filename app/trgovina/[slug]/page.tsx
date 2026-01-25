'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, ShoppingCart, Image as ImageIcon, ChevronDown, ChevronUp, Info, AlertTriangle, BookOpen, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '@/components/CartProvider';

interface Product {
  id: string;
  name: string;
  name_sl?: string | null;
  slug: string;
  description: string | null;
  description_sl?: string | null;
  short_description?: string | null;
  short_description_sl?: string | null;
  price: number;
  currency: string;
  stock: number;
  active: boolean;
  image_url: string | null;
  category_id: string;
  ingredients?: string | null;
  ingredients_sl?: string | null;
  nutrition_facts?: any;
  usage_instructions?: string | null;
  usage_instructions_sl?: string | null;
  warnings?: string | null;
  warnings_sl?: string | null;
  faq?: any;
  brand?: string | null;
  weight?: string | null;
  dosage?: string | null;
}

interface Category {
  id: string;
  name: string;
  name_sl?: string | null;
  slug: string;
}

// Accordion component for expandable sections
function Accordion({ title, icon: Icon, children, defaultOpen = false }: { 
  title: string; 
  icon: React.ElementType; 
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon size={20} className="text-teal-600" />
          <span className="font-semibold text-gray-900">{title}</span>
        </div>
        {isOpen ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-white">
          {children}
        </div>
      )}
    </div>
  );
}

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const { data: prod, error } = await supabase
        .from('shop_products')
        .select('id, name, name_sl, slug, description, description_sl, short_description, short_description_sl, price, currency, stock, active, image_url, category_id, ingredients, ingredients_sl, nutrition_facts, usage_instructions, usage_instructions_sl, warnings, warnings_sl, faq, brand, weight, dosage')
        .eq('slug', slug)
        .eq('active', true)
        .single();

      if (error || !prod) {
        toast.error('Product not found');
        return;
      }

      setProduct(prod);

      // Load category
      const { data: cat } = await supabase
        .from('shop_categories')
        .select('id, name, name_sl, slug')
        .eq('id', prod.category_id)
        .single();

      setCategory(cat);
    } catch (error) {
      toast.error('Napaka pri nalaganju izdelka');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-200 border-t-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Nalagam podrobnosti izdelka...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <Link href="/trgovina" className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 mb-8">
            <ArrowLeft size={20} />
            <span>Nazaj v trgovino</span>
          </Link>
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Izdelek ni najden</h1>
            <p className="text-gray-600">Ta izdelek ni več na voljo.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (quantity > product.stock) {
      toast.error('Ni dovolj zaloge');
      return;
    }
    const displayName = (product.name_sl || product.name || 'Izdelek').trim();
    addToCart({
      id: product.id,
      type: 'product',
      name: displayName,
      price: Number(product.price),
      image: product.image_url || undefined,
      slug: product.slug,
    }, quantity);
    toast.success(`Dodano v košarico: ${quantity}x ${displayName}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/trgovina" className="hover:text-teal-600 font-medium">Trgovina</Link>
          <span>/</span>
          {category && (
            <>
              <Link href={`/trgovina?category=${category.slug}`} className="hover:text-teal-600 font-medium">
                {(category.name_sl || category.name || '').trim()}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-900 font-semibold">{(product.name_sl || product.name || '').trim()}</span>
        </div>

        {/* Back Button */}
        <Link href="/trgovina" className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 mb-8 font-medium">
          <ArrowLeft size={20} />
          <span>Nazaj v trgovino</span>
        </Link>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Image */}
          <div className="flex items-center justify-center bg-gradient-to-br from-teal-50 to-green-50 rounded-2xl shadow-lg p-8">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={(product.name_sl || product.name || '').trim()}
                className="w-full h-auto max-h-96 object-contain"
              />
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-teal-100 to-green-100 rounded-lg flex items-center justify-center">
                <ImageIcon size={64} className="text-teal-300" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{(product.name_sl || product.name || '').trim()}</h1>
            </div>
            {category && (
              <p className="text-gray-600">
                Kategorija: <span className="font-medium">{(category.name_sl || category.name || '').trim()}</span>
              </p>
            )}

            {/* Price */}
            <div className="bg-gradient-to-br from-teal-50 to-green-50 rounded-2xl p-6 border border-teal-100">
              <p className="text-gray-600 text-sm mb-2 font-medium">Cena</p>
              <p className="text-5xl font-bold text-teal-600">
                €{Number(product.price).toFixed(2)}
              </p>
            </div>

            {/* Short Description */}
            {(product.short_description_sl || product.short_description || product.description_sl || product.description) && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <p className="text-base text-gray-700 leading-relaxed">
                  {(product.short_description_sl || product.short_description || product.description_sl || product.description || '').trim().slice(0, 300)}
                  {((product.short_description_sl || product.short_description || product.description_sl || product.description || '').length > 300) && '...'}
                </p>
              </div>
            )}

            {/* Product Meta Info */}
            {(product.brand || product.weight || product.dosage) && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {product.brand && (
                    <div>
                      <span className="text-gray-500">Blagovna znamka:</span>
                      <span className="ml-2 font-medium text-gray-900">{product.brand}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div>
                      <span className="text-gray-500">Neto količina:</span>
                      <span className="ml-2 font-medium text-gray-900">{product.weight}</span>
                    </div>
                  )}
                  {product.dosage && (
                    <div className="col-span-2">
                      <span className="text-gray-500">Priporočeno doziranje:</span>
                      <span className="ml-2 font-medium text-gray-900">{product.dosage}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <p className="text-sm text-gray-600 mb-3 font-medium">Razpoložljivost</p>
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`text-lg font-semibold ${product.stock > 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {product.stock > 0 ? `Na zalogi: ${product.stock} kosov` : 'Razprodano'}
                </span>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            {product.stock > 0 && (
              <div className="space-y-4 bg-white rounded-2xl p-6 border border-gray-100">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Izberite količino</label>
                  <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-2 w-fit">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 font-bold text-lg border border-gray-200"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 px-3 py-2 border-0 text-center font-bold text-lg bg-transparent"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 font-bold text-lg border border-gray-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-teal-600 to-green-600 text-white py-4 rounded-xl font-bold hover:from-teal-700 hover:to-green-700 transition-all shadow-lg flex items-center justify-center space-x-2 text-lg"
                >
                  <ShoppingCart size={24} />
                  <span>Dodaj v košarico</span>
                </button>
              </div>
            )}

            {product.stock === 0 && (
              <button
                disabled
                className="w-full bg-gray-400 text-white py-4 rounded-xl font-bold cursor-not-allowed text-lg"
              >
                Razprodano
              </button>
            )}
          </div>
        </div>

        {/* Detailed Information Accordions */}
        <div className="mb-12 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Za tiste, ki želijo več</h2>
          
          {/* Full Description */}
          {(product.description_sl || product.description) && (
            <Accordion title="Podroben opis" icon={Info} defaultOpen={true}>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {(product.description_sl || product.description || '').trim()}
                </p>
              </div>
            </Accordion>
          )}

          {/* Ingredients */}
          {(product.ingredients_sl || product.ingredients) && (
            <Accordion title="Sestavine" icon={BookOpen}>
              <div className="space-y-4">
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {(product.ingredients_sl || product.ingredients || '').trim()}
                </div>
                
                {/* Nutrition Facts Table */}
                {product.nutrition_facts && typeof product.nutrition_facts === 'object' && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Hranilne vrednosti</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="text-left px-4 py-2 border border-gray-200">Sestavina</th>
                            <th className="text-right px-4 py-2 border border-gray-200">Na porcijo</th>
                            <th className="text-right px-4 py-2 border border-gray-200">%DV</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.isArray(product.nutrition_facts) && product.nutrition_facts.map((item: any, idx: number) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="px-4 py-2 border border-gray-200">{item.name || item.ingredient}</td>
                              <td className="text-right px-4 py-2 border border-gray-200">{item.amount}</td>
                              <td className="text-right px-4 py-2 border border-gray-200">{item.dv || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </Accordion>
          )}

          {/* Usage Instructions */}
          {(product.usage_instructions_sl || product.usage_instructions) && (
            <Accordion title="Uporaba / Navodila" icon={BookOpen}>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {(product.usage_instructions_sl || product.usage_instructions || '').trim()}
              </div>
            </Accordion>
          )}

          {/* Warnings */}
          {(product.warnings_sl || product.warnings) && (
            <Accordion title="Opozorila" icon={AlertTriangle}>
              <div className="text-amber-800 bg-amber-50 p-4 rounded-lg leading-relaxed whitespace-pre-line">
                {(product.warnings_sl || product.warnings || '').trim()}
              </div>
            </Accordion>
          )}

          {/* FAQ */}
          {product.faq && Array.isArray(product.faq) && product.faq.length > 0 && (
            <Accordion title="Pogosta vprašanja" icon={HelpCircle}>
              <div className="space-y-4">
                {product.faq.map((item: any, idx: number) => (
                  <div key={idx} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <h4 className="font-semibold text-gray-900 mb-2">{item.q || item.question}</h4>
                    <p className="text-gray-700">{item.a || item.answer}</p>
                  </div>
                ))}
              </div>
            </Accordion>
          )}
        </div>

        {/* Related Products */}
        <div className="border-t pt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Nadaljuj z nakupovanjem</h2>
          <Link
            href="/trgovina"
            className="inline-block bg-gradient-to-r from-teal-600 to-green-600 text-white px-8 py-3 rounded-xl hover:from-teal-700 hover:to-green-700 transition-all shadow-lg font-semibold"
          >
            Nazaj na vse izdelke
          </Link>
        </div>
      </div>
    </div>
  );
}
